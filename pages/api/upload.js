import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Importar fetch diretamente
import { SquareCloudBlob } from "@squarecloud/blob";

dotenv.config();
const apiKey = process.env.SQUARECLOUD_API_KEY;

// Configurar o armazenamento do multer
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads", // Diretório para armazenar temporariamente os arquivos
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Função do handler para o upload
export default async function handler(req, res) {
  if (req.method === "POST") {
    upload.single("audio")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer upload." });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
        }

        const fileName = req.query.name || "default-name";
        const formData = new FormData();
        const fileStream = fs.createReadStream(req.file.path);

        formData.append("file", fileStream, req.file.filename);

        const options = {
          method: "POST",
          headers: {
            Authorization: apiKey,
            ...formData.getHeaders(),
          },
          body: formData,
        };

        const response = await fetch(
          `https://blob.squarecloud.app/v1/objects?name=${encodeURIComponent(
            fileName
          )}`,
          options
        );

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();

        // Remover o arquivo temporário após o upload
        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: "Áudio enviado com sucesso!", data });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao enviar o áudio." });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}

export const config = {
  api: {
    bodyParser: false, // Desabilita o bodyParser padrão do Next.js
  },
};
