import { Alert } from "@/lib/types/alert-manager";

const formatAlertMessage = (alert: Alert): string => {
  const { status, labels, annotations } = alert;

  const alertname = labels.alertname || "";
  const instance = labels.instance || "";
  const summary = annotations.summary || annotations.description || "";

  return status === "firing"
    ? `⛔ ${alertname}\n${summary}${instance ? `\n📍 ${instance}` : ""}`
    : `✅ ${alertname} resolved${instance ? `\n📍 ${instance}` : ""}`;
};

const sendMessage = async (message: string): Promise<Response> => {
  const params = new URLSearchParams({
    msg: message,
    user: process.env.FREE_MOBILE_USER!,
    pass: process.env.FREE_MOBILE_PASS!,
  });

  return await fetch(`https://smsapi.free-mobile.fr/sendmsg?${params.toString()}`);
};

export { formatAlertMessage, sendMessage };
