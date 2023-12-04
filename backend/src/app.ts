import express from "express";
import { downloadRouter } from "./routes/download";
import cors from "cors";
import { wakeupRouter } from "./routes/wakeup";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(cors({
  origin:(origin,callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:4200',
      'https://youtconverter.netlify.app',
      'https://youtconverter.netlify.app/',
      'https://notifier-app.netlify.app'     //wake up alarm
    ]
    
    if(origin && ACCEPTED_ORIGINS.includes(origin))
      return callback(null,true);

    return callback(new Error('NOT ALLOWED BY CORS'));
  },
  exposedHeaders: "Content-Disposition"
}));

// paths
app.use('/download',downloadRouter);
app.use('/wakeup',wakeupRouter);

app.listen(PORT,() => {
  console.log(`server started on http://localhost:${PORT}`);
});
