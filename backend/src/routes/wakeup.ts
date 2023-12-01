import { Router } from "express";

export const wakeupRouter = Router();

wakeupRouter.get("/",(req,res) => {
  console.log("waked up at " + new Date().toLocaleString('es'));
  res.status(202).send();
});