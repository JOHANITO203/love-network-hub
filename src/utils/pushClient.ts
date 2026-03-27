export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, unknown>;
}

export const sendPushNotification = async (userId: string, payload: PushNotificationPayload) => {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
  const url = `${baseUrl}/functions/v1/notifications`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({
        type: "push",
        payload: {
          ...payload,
          user_id: userId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Push notification failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("[push] failed to queue notification", error);
  }
};
