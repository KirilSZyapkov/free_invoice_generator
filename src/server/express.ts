import fs from "fs";
import express from "express";
import next from "next";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "../server/trpc/appRouter";
import { createContext } from "../server/trpc/context";
import {requireAuth} from "@clerk/express";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  if(!dev){
    const buildDir = path.join(process.cwd(), ".next");
    if(!fs.existsSync(buildDir)){
      console.error("❌ Missing .next build! Run `npm run build` before starting in production.");
      process.exit(1);
    }
  }
  const server = express();

  server.use(cors());
  server.use(express.json());

  server.use(
    "/api/trpc",
    requireAuth(),
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );

  server.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", time: new Date().toISOString() });
  });

  server.get("/api/hello", (req, res) => {
    res.status(200).json({ message: "Hello from the API!" });
  });

  server.use((req, res) => handle(req, res));

  const PORT = process.env.PORT || 3030;

  server.listen(PORT, () => {
    console.log(`Visit http://localhost:3000/`);
    console.log(`Server is listening on port ${PORT}`);

  });
});

