import { supabase } from "@/integrations/supabase/client";

export interface EmailNotificationPayload {
  subject: string;
  body: string;
  data?: Record<string, unknown>;
}

export const sendEmailNotification = async (userId: string, payload: EmailNotificationPayload) => {
  try {
    const { error } = await supabase.functions.invoke("notifications", {
      body: {
        type: "email",
        payload: {
          user_id: userId,
          ...payload,
        },
      },
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[email] failed to queue email notification", error);
  }
};
