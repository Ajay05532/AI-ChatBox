import { Router } from "express";
import { askLLM } from "../controller/askLLM.js";

const router = Router();

router.post("/ask", async (req, res) => {
    const { prompt } = req.body;
    const response = await askLLM(prompt);
    res.json({ response });
});

export default router;