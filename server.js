import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config(); // Carrega variáveis do ambiente

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Cria cliente da OpenAI com a chave da variável de ambiente
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/consultar", async (req, res) => {
  const { categoria, peso } = req.body;

  const prompt = `Quais são os principais modelos disponíveis no mercado para a categoria "${categoria}" com peso operacional de "${peso}"? Inclua exemplos da Caterpillar, Komatsu e Volvo.`;

  try {
    const resposta = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7
    });

    res.json({ resposta: resposta.choices[0].message.content });
  } catch (error) {
    console.error("❌ Erro ao consultar OpenAI:", error.message);
    res.status(500).json({ erro: "Erro ao consultar o ChatGPT." });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando com ChatGPT");
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log("🔑 OPENAI_API_KEY carregada:", process.env.OPENAI_API_KEY ? "✅ PRESENTE" : "❌ NÃO ENCONTRADA");
});
