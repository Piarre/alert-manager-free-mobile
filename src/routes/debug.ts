import Elysia from "elysia";
import { uptime } from "../lib/utils/uptime";

export default new Elysia().group("/debug", (route) =>
  route
    .get("/uptime", uptime())
    .get("/healthcheck", { status: "ok", uptime: uptime() }),
);
