import express from "express";
import cors from "cors";
import { sendResponse } from "./v1/middleware/sendResponse.js";
import { loadModels } from "./v1/models/models.js";
import { loadRoutes } from "./common/routesLoader.js";
async function server() {
  const app = express();
  // Middleware setup
  app.use(cors({ origin: "*" }));
  //FOR API RESPONSE MSG
  app.use(sendResponse);
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Load models
  await loadModels();
  // Load routes
  const WEB_ADMIN_URL = "/webservices";
  const VERSIONS = ["v1"];
  await loadRoutes(app, WEB_ADMIN_URL, VERSIONS);

  return app;
}

export default server;
