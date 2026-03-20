type OneSignalCreateNotificationRequest = {
  app_id: string;
  include_aliases: {
    external_id: string[];
  };
  target_channel: "push";
  headings: Record<string, string>;
  contents: Record<string, string>;
  data?: Record<string, unknown>;
};

export async function sendOneSignalNotification(payload: {
  externalUserIds: string[];
  title: string;
  message: string;
  data?: Record<string, unknown>;
}) {
  const appId = process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!appId || !apiKey) {
    throw new Error("ONESIGNAL_APP_ID/ONESIGNAL_REST_API_KEY non configurati");
  }

  if (payload.externalUserIds.length === 0) {
    return { id: null, recipients: 0 };
  }

  const requestBody: OneSignalCreateNotificationRequest = {
    app_id: appId,
    include_aliases: { external_id: payload.externalUserIds },
    target_channel: "push",
    headings: { en: payload.title, it: payload.title },
    contents: { en: payload.message, it: payload.message },
    data: payload.data,
  };

  const response = await fetch("https://api.onesignal.com/notifications?c=push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OneSignal error ${response.status}: ${body}`);
  }

  return response.json() as Promise<{
    id: string;
    recipients: number;
    errors?: string[];
  }>;
}
