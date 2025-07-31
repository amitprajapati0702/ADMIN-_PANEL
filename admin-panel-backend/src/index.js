import dotenv from "dotenv";
import connectDB from "./config/database.js";
import server from "./server.js";

dotenv.config();
const port = process.env.PORT || 9000;
const startServer = async () => {
  try {
    await connectDB();
    const app = await server();

    app.get("/", (req, res) => {
      res.set('Cache-Control', 'no-store');
      res.status(200).send("Server is running !!");
    });

    app.post("/test", (req, res) => {
      res.set('Cache-Control', 'no-store');
      res.status(200).send("Server is running for post !!");
    });

    app.listen(port, "0.0.0.0", () => {
      console.log("server is running on port " + port);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();