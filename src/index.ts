import { Elysia } from "elysia";
import debugRoutes from "@/routes/debug";
import smsRoutes from "@/routes/sms";
import log from "@/lib/utils/log";
import bootstrap from "./lib/utils/bootstrap";

(async () => {
  bootstrap();

  const PORT = parseInt(process.env.PORT || "2025", 10);
  const app = new Elysia().use(debugRoutes).use(smsRoutes).listen(PORT);

  log(`🦊 Elysia is running at ${app.server?.url?.href}`);

  log.info("Press Ctrl+C to stop the server.");

  process.on("SIGINT", () => {
    log.info("👋 Shutting down gracefully...");
    log.error("Server stopped.");
    app.stop();
    process.exit(0);
  });
})();
