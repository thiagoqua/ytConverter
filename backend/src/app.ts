import express from "express";
import { downloadRouter } from "./routes/download";
import cors from "cors";
import { wakeupRouter } from "./routes/wakeup";
import { fetchWelcome } from "./utils/fetchWelcome";

const app = express();
const PORT = process.env.PORT ?? 8080;
const corsRules = {
  origin: (origin: any, callback: any) => {
    const ACCEPTED_ORIGINS = [
      "http://localhost",
      "https://youtconverter.netlify.app",
      "https://youtconverter.netlify.app/",
    ];

    if (origin && ACCEPTED_ORIGINS.includes(origin))
      return callback(null, true);

    return callback(new Error("NOT ALLOWED BY CORS"));
  },
  exposedHeaders: "Content-Disposition",
};

// paths
app.use("/wakeup", cors(), wakeupRouter);
app.use("/download",cors(corsRules), downloadRouter);

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`);
});

//to wake up the app in 1 hour interval
setInterval(fetchWelcome,3600000);
