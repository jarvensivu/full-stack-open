import express from "express";
import patientService from "../services/patientService";
import { toNewPatient } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  const patientData = patientService.getNonSensitivePatientData();
  res.json(patientData);
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  if (patient) {
    res.json(patient);
  }
  else {
    res.status(404).send({Error: "patient not found"});
  }
});

router.post("/", (req, res) => {
  try{
    const newPatient = toNewPatient(req.body);
    const returnedPatient = patientService.addPatient(newPatient);
    res.json(returnedPatient);
  }
  catch(e) {
    if (e instanceof Error) {
      res.status(400).send({Error: `${e.message}`});
    }
    else {
      res.status(400).send({Error: "unknown error"});
    }
  }
});

export default router;
