import express from "express";
import cors from "cors";
import { seedIfEmpty } from "./db/seed";

import requestsRouter from "./routes/requests";
import scheduleRouter from "./routes/schedule";
import optimiseRouter from "./routes/optimise";
import dashboardRouter from "./routes/dashboard";
import crewsRouter from "./routes/crews";
import equipmentRouter from "./routes/equipment";
import sectorsRouter from "./routes/sectors";
import ps1Router from "./routes/ps1";
import { resolve } from "node:path";

seedIfEmpty();

const app = express();
app.use(cors());
// PS1 instances upload up to eight CSVs of 2 MB each (routes/ps1.ts), well over express's 100 kb default.
app.use(express.json({ limit: "20mb" }));

app.use("/api/requests", requestsRouter);
app.use("/api/schedule", scheduleRouter);
// app.use("/api/ps1", ps1Router);
app.use("/api", optimiseRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/crews", crewsRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/sectors", sectorsRouter);
app.use("/api/ps1", ps1Router);

// A built frontend can be served by the same process for a hosted deployment.
if (process.env.SERVE_FRONTEND === "1") {
  const frontend = resolve(__dirname, "../../dist");
  app.use(express.static(frontend));
  app.get("/{*path}", (_req, res) => res.sendFile(resolve(frontend, "index.html")));
}

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`[cascade] CAPO backend running on http://localhost:${PORT}`);
});
