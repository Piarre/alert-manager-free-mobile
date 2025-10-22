import log from "./log";

export default () => {
  if (!process.env.FREE_MOBILE_USER || !process.env.FREE_MOBILE_PASS) {
    log.error("Missing Free Mobile credentials.");
    log.error("Please set FREE_MOBILE_USER and FREE_MOBILE_PASS environment variables.");
    process.exit(1);
  }

  if (process.env.LOG_SMS === "true" && !process.env.LOG_DB_URI) {
    log.error("Logging is enabled but LOG_DB_URI is not set.");
    log.error("Please set LOG_DB_URI environment variable.");
    process.exit(1);
  }

  log.info("Bootstrap completed");
};
