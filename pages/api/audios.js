// pages/api/audios.js
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.SQUARECLOUD_API_KEY;

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const fetch = (await import("node-fetch")).default;
      const options = {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
      };

      const response = await fetch(
        "https://blob.squarecloud.app/v1/objects",
        options
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json({ response: data });
    } catch (err) {
      console.error("Erro ao listar objetos:", err);
      if (err.message.includes("Invalid Object Url")) {
        res.status(400).json({ error: "URL de objeto inválida." });
      } else {
        res.status(500).json({ error: "Erro ao buscar os áudios" });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
