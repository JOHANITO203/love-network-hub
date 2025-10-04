import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://localhost:3000, http://localhost:3000', // Restrict to specific domains
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

// Initialize Supabase client for JWT verification
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// JWT verification middleware
async function verifyJWT(request: Request): Promise<{ user: User | null; error: string | null }> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { user: null, error: 'Invalid or expired token' };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Token verification failed' };
  }
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userKey = `ws_${userId}`;
  const userLimit = rateLimitStore.get(userKey);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userKey, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Input sanitization
function sanitizeMessage(message: Record<string, unknown>): Record<string, unknown> | null {
  if (typeof message !== 'object' || message === null) {
    return null;
  }

  // Remove potentially dangerous fields
  const sanitized = { ...message };
  delete sanitized.__proto__;
  delete sanitized.constructor;

  // Limit message size
  const messageStr = JSON.stringify(sanitized);
  if (messageStr.length > 10000) { // 10KB limit
    throw new Error('Message too large');
  }

  return sanitized;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify JWT token before upgrading to WebSocket
  const { user, error: authError } = await verifyJWT(req);
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // Check rate limiting
  if (!checkRateLimit(user.id, 5, 60000)) { // 5 connections per minute
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", {
      status: 400,
      headers: corsHeaders
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    socket.close(1011, 'Server configuration error');
    return response;
  }

  let openAISocket: WebSocket | null = null;
  let sessionEstablished = false;
  let currentTranscript = '';
  let audioBuffer: string[] = [];
  let messageCount = 0;
  const MAX_MESSAGES_PER_SESSION = 100;

  // Log connection for audit
  console.log(`WebSocket connection established for user: ${user.id} at ${new Date().toISOString()}`);

  const connectToOpenAI = async () => {
    try {
      console.log(`Connecting to OpenAI Realtime API for user: ${user.id}`);
      openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", [], {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1"
        }
      });

      openAISocket.onopen = () => {
        console.log(`Connected to OpenAI Realtime API for user: ${user.id}`);
      };

      openAISocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Filter sensitive information from logs
          const logData = { ...data };
          delete logData.delta; // Don't log audio data
          console.log(`OpenAI message for user ${user.id}:`, logData.type);

          // Handle session created event
          if (data.type === 'session.created') {
            console.log(`Session created for user: ${user.id}`);
            sessionEstablished = true;

            // Send session update with МойDate configuration
            const sessionUpdate = {
              type: "session.update",
              session: {
                modalities: ["text", "audio"],
                instructions: `You are a helpful assistant for МойDate, a dating app. Help users have meaningful conversations with their matches. Be friendly, engaging, and respectful. Keep responses concise and natural. User ID: ${user.id}`,
                voice: "alloy",
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                input_audio_transcription: {
                  model: "whisper-1"
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                },
                temperature: 0.8,
                max_response_output_tokens: 500 // Limit response length
              }
            };

            openAISocket?.send(JSON.stringify(sessionUpdate));
          }

          // Handle audio response with size limits
          if (data.type === 'response.audio.delta') {
            if (audioBuffer.length < 1000) { // Limit buffer size
              audioBuffer.push(data.delta);
              socket.send(JSON.stringify({
                type: 'response.audio.delta',
                delta: data.delta
              }));
            }
          }

          // Handle audio transcript
          if (data.type === 'response.audio_transcript.delta') {
            currentTranscript += data.delta;
            // Limit transcript length
            if (currentTranscript.length > 5000) {
              currentTranscript = currentTranscript.slice(-4000);
            }
            socket.send(JSON.stringify({
              type: 'response.audio_transcript.delta',
              delta: data.delta,
              transcript: currentTranscript
            }));
          }

          // Handle audio done
          if (data.type === 'response.audio.done') {
            console.log(`Audio response completed for user: ${user.id}`);
            socket.send(JSON.stringify({
              type: 'response.audio.done',
              transcript: currentTranscript
            }));
            // Reset for next response
            currentTranscript = '';
            audioBuffer = [];
          }

          // Handle other important events
          if (data.type === 'response.created') {
            socket.send(JSON.stringify({ type: 'response.created' }));
          }

          if (data.type === 'response.done') {
            socket.send(JSON.stringify({ type: 'response.done' }));
          }

          if (data.type === 'error') {
            console.error(`OpenAI error for user ${user.id}:`, data.error);
            // Send generic error to client (don't expose internal details)
            socket.send(JSON.stringify({
              type: 'error',
              error: 'Service temporarily unavailable'
            }));
          }

        } catch (error) {
          console.error(`Error processing OpenAI message for user ${user.id}:`, error);
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Message processing failed'
          }));
        }
      };

      openAISocket.onerror = (error) => {
        console.error(`OpenAI WebSocket error for user ${user.id}:`, error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'AI service connection failed'
        }));
      };

      openAISocket.onclose = (event) => {
        console.log(`OpenAI WebSocket closed for user ${user.id}:`, event.code, event.reason);
        socket.close(1000, 'AI service disconnected');
      };

    } catch (error) {
      console.error(`Error connecting to OpenAI for user ${user.id}:`, error);
      socket.close(1011, 'Failed to connect to AI service');
    }
  };

  // Handle client messages with enhanced security
  socket.onmessage = (event) => {
    try {
      // Rate limiting per session
      messageCount++;
      if (messageCount > MAX_MESSAGES_PER_SESSION) {
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Session message limit exceeded'
        }));
        socket.close(1008, 'Message limit exceeded');
        return;
      }

      const message = JSON.parse(event.data);
      const sanitizedMessage = sanitizeMessage(message);

      if (!sanitizedMessage) {
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Invalid message format'
        }));
        return;
      }

      console.log(`Client message from user ${user.id}:`, sanitizedMessage.type);

      if (!sessionEstablished && sanitizedMessage.type !== 'session.update') {
        console.log(`Session not established yet for user ${user.id}, queuing message`);
        return;
      }

      // Forward sanitized messages to OpenAI
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(JSON.stringify(sanitizedMessage));
      } else {
        console.error(`OpenAI socket not ready for user ${user.id}`);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'AI service not ready'
        }));
      }
    } catch (error) {
      console.error(`Error processing client message for user ${user.id}:`, error);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Invalid message format'
      }));
    }
  };

  socket.onopen = () => {
    console.log(`Client WebSocket connected for user: ${user.id}`);
    connectToOpenAI();
  };

  socket.onclose = () => {
    console.log(`Client WebSocket disconnected for user: ${user.id}`);
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error(`Client WebSocket error for user ${user.id}:`, error);
  };

  return response;
});