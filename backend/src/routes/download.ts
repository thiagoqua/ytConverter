import { Router } from "express";
import getEncodedFilename from "../utils/URLhelper";
import getQualityAsBitrate from "../utils/qualityResolver";
import { ensureValidParams } from "../utils/paramsValidator";

export const downloadRouter = Router();

downloadRouter.get("/", async (req, res) => {
  const { url, format, quality } = req.query as {
    url: string;
    format: string;
    quality: string;
  };

  try {
    ensureValidParams(url, format, quality);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});
