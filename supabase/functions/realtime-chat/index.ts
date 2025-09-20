import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
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

  const connectToOpenAI = async () => {
    try {
      console.log('Connecting to OpenAI Realtime API...');
      openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", [], {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1"
        }
      });

      openAISocket.onopen = () => {
        console.log('Connected to OpenAI Realtime API');
      };

      openAISocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('OpenAI message:', data.type);

          // Handle session created event
          if (data.type === 'session.created') {
            console.log('Session created, sending session update...');
            sessionEstablished = true;
            
            // Send session update with dating app configuration
            const sessionUpdate = {
              type: "session.update",
              session: {
                modalities: ["text", "audio"],
                instructions: "You are a helpful dating app assistant. You help users have meaningful conversations with their matches. Be friendly, engaging, and help facilitate romantic connections. Keep responses concise and natural.",
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
                max_response_output_tokens: "inf"
              }
            };
            
            openAISocket?.send(JSON.stringify(sessionUpdate));
          }

          // Handle audio response
          if (data.type === 'response.audio.delta') {
            audioBuffer.push(data.delta);
            socket.send(JSON.stringify({
              type: 'response.audio.delta',
              delta: data.delta
            }));
          }

          // Handle audio transcript
          if (data.type === 'response.audio_transcript.delta') {
            currentTranscript += data.delta;
            socket.send(JSON.stringify({
              type: 'response.audio_transcript.delta',
              delta: data.delta,
              transcript: currentTranscript
            }));
          }

          // Handle audio done
          if (data.type === 'response.audio.done') {
            console.log('Audio response completed');
            socket.send(JSON.stringify({
              type: 'response.audio.done',
              transcript: currentTranscript
            }));
            // Reset transcript for next response
            currentTranscript = '';
            audioBuffer = [];
          }

          // Handle other important events
          if (data.type === 'response.created') {
            console.log('Response created');
            socket.send(JSON.stringify(data));
          }

          if (data.type === 'response.done') {
            console.log('Response completed');
            socket.send(JSON.stringify(data));
          }

          if (data.type === 'error') {
            console.error('OpenAI error:', data);
            socket.send(JSON.stringify({
              type: 'error',
              error: data.error
            }));
          }

        } catch (error) {
          console.error('Error processing OpenAI message:', error);
        }
      };

      openAISocket.onerror = (error) => {
        console.error('OpenAI WebSocket error:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Connection to AI service failed'
        }));
      };

      openAISocket.onclose = (event) => {
        console.log('OpenAI WebSocket closed:', event.code, event.reason);
        socket.close(1000, 'AI service disconnected');
      };

    } catch (error) {
      console.error('Error connecting to OpenAI:', error);
      socket.close(1011, 'Failed to connect to AI service');
    }
  };

  // Handle client messages
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Client message:', message.type);

      if (!sessionEstablished && message.type !== 'session.update') {
        console.log('Session not established yet, queuing message');
        return;
      }

      // Forward client messages to OpenAI
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(event.data);
      } else {
        console.error('OpenAI socket not ready');
        socket.send(JSON.stringify({
          type: 'error',
          error: 'AI service not ready'
        }));
      }
    } catch (error) {
      console.error('Error processing client message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Invalid message format'
      }));
    }
  };

  socket.onopen = () => {
    console.log('Client WebSocket connected');
    connectToOpenAI();
  };

  socket.onclose = () => {
    console.log('Client WebSocket disconnected');
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error('Client WebSocket error:', error);
  };

  return response;
});