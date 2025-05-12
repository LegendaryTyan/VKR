import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

import authRoutes from "./routes/auth";
import gamesRoutes from "./routes/games";
import achievementsRoutes from "./routes/achievements";
import profileRoutes from "./routes/profile";

const app = new Hono();

app.use("*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

app.route("/auth", authRoutes);
app.route("/games", gamesRoutes);
app.route("/achievements", achievementsRoutes);
app.route("/profile", profileRoutes);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;