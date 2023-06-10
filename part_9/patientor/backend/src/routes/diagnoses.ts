import express from "express";
import diagnoseService from "../services/diagnoseService";

const router = express.Router();

router.get("/", (_req, res) => {
  const diagnoses = diagnoseService.getDiagnoses();
  res.json(diagnoses);
});

export default router;
