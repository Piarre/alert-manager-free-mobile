import { Elysia } from "elysia";
import debugRoutes from "@/routes/debug";
import smsRoutes from "@/routes/sms";
import { prepareDb } from "@/lib/db";
import log from "@/lib/utils/log";

(async () => {
  const PORT = parseInt(process.env.PORT || "2025", 10);
  const app = new Elysia().use(debugRoutes).use(smsRoutes).listen(PORT);

  if (process.env.LOG_SMS === "true") await prepareDb();

  log(`🦊 Elysia is running at ${app.server?.url?.href}`);

  log.info("Press Ctrl+C to stop the server.");

  process.on("SIGINT", () => {
    log.info("👋 Shutting down gracefully...");
    log.error("Server stopped.");
    app.stop();
    process.exit(0);
  });
})();
