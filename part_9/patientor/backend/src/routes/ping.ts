import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

export default router;
