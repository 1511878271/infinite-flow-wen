import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { randomUUID } from "crypto";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { ApiError, toApiErrorBody } from "./lib/errors.js";
import { apiRouter } from "./routes/api.js";
import { getDoubaoRuntimeConfig } from "./providers/doubao.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use((req, res, next) => {
  const requestId = req.header("x-request-id") || randomUUID();
  (req as any).requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
});

const corsOrigin = process.env.PLUGIN_CORS_ORIGIN || "*";
app.use(
  cors({
    origin: corsOrigin === "*" ? "*" : corsOrigin.split(",").map((s) => s.trim()),
    // Strategy A: allow all origins and secure API via x-plugin-token.
    // With wildcard origin, credentials must stay disabled.
    credentials: false,
    allowedHeaders: ["content-type", "authorization", "x-plugin-token", "x-request-id"],
    exposedHeaders: ["x-request-id"],
  }),
);

app.get("/health", (_req, res) => res.json({ ok: true }));

const modelLibraryDir = String(process.env.MODEL_LIBRARY_DIR || "").trim() || path.resolve(__dirname, "../../../glb");
if (fs.existsSync(modelLibraryDir)) {
  app.use(
    "/models",
    express.static(modelLibraryDir, {
      setHeaders: (res) => {
        res.setHeader("Cache-Control", "public, max-age=3600");
      },
    }),
  );
}

const requirePluginToken: express.RequestHandler = (req, _res, next) => {
  // Allow proxy and chat routes to be accessed without token
  if (
    req.path === "/proxy" ||
    req.path === "/api/proxy" ||
    req.originalUrl.startsWith("/api/proxy") ||
    req.path === "/chat" ||
    req.path === "/api/chat" ||
    req.originalUrl.startsWith("/api/chat") ||
    req.path === "/feedback" ||
    req.path === "/api/feedback" ||
    req.originalUrl.startsWith("/api/feedback")
  ) {
    return next();
  }
  const required = process.env.PLUGIN_REQUIRED_TOKEN;
  if (!required) return next();
  const token = req.header("x-plugin-token") || "";
  if (token !== required) return next(new ApiError("UNAUTHORIZED", 401, "Invalid token"));
  next();
};

app.use("/api", requirePluginToken, apiRouter());
const uiDist = path.resolve(__dirname, "../../plugin-ui/dist");
if (fs.existsSync(uiDist)) {
  app.use(
    express.static(uiDist, {
      setHeaders: (res, filePath) => {
        const norm = filePath.replace(/\\/g, "/");
        if (norm.endsWith("/embed/ai-plugin-wc.js") || norm.endsWith("/embed/ai-plugin-react.js")) {
          // Keep embed entry files fresh so host pages can sync updates quickly.
          res.setHeader("Cache-Control", "public, max-age=60, must-revalidate");
          return;
        }
        if (/\/(assets|embed)\/.+\.[A-Za-z0-9_-]{6,}\.(js|css)$/.test(norm)) {
          // Hashed artifacts are content-addressed and can be cached aggressively.
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }
        if (norm.endsWith("/index.html")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    }),
  );
  app.get(["/", "/settings"], (_req, res) => res.sendFile(path.join(uiDist, "index.html")));
}

app.use((req, _res, next) => next(new ApiError("BAD_REQUEST", 404, `Not found: ${req.path}`)));

app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const requestId = String((req as any).requestId || "");
  const { status, body } = toApiErrorBody(err, requestId);
  res.status(status).json(body);
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  const d = getDoubaoRuntimeConfig();
  process.stdout.write(
    `[doubao] mockMode=${d.mockMode} hasApiKey=${d.hasApiKey} baseUrl=${d.baseUrl || "-"} model=${d.model || "-"}\n`,
  );
  process.stdout.write(`plugin-server listening on http://localhost:${port}\n`);
});
