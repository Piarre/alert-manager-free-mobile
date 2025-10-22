import Elysia, { StatusMap } from "elysia";
import { Payload } from "@/lib/types/alert-manager";
import { formatAlertMessage, sendMessage } from "@/lib/utils/free";
import { FreeResponseCode } from "@/lib/types/free";
import db from "@/lib/db";

export default new Elysia().group("/sms", (route) =>
  route
    .post("/send", async ({ body, status }) => {
      const { alerts } = body as Partial<Payload>;

      if (!alerts || alerts.length === 0) return status(400, { error: "No alerts provided" });

      const messages = alerts.map(formatAlertMessage);
      messages.forEach((msg) => db.log(msg.startsWith("⛔") ? "firing" : "resolved", msg));
      
      const fullMessage = messages.join("\n\n").substring(0, 994);

      await sendMessage(fullMessage).then((response) => {
        const code = response.status;

        if (code in FreeResponseCode) {
          return status(FreeResponseCode[code] as any, {
            error: FreeResponseCode[code],
          });
        }
      });

      return { message: fullMessage };
    })
    .get("/log", ({ status }) => {
      if (process.env.LOG_SMS !== "true") return status(406, { error: "SMS logging is disabled" });

      return db.getLogs();
    }),
);
