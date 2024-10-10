// pages/api/delete_audio.js
import { SquareCloudBlob } from "@squarecloud/blob";

const apiKey = process.env.SQUARECLOUD_API_KEY;
const blob = new SquareCloudBlob(apiKey);

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const { name } = req.query;

      if (!name) {
        return res
          .status(400)
          .json({ error: "O nome do arquivo é necessário." });
      }

      const url = new URL(name);
      const urlParts = url.pathname.split("/").filter(Boolean);

      if (urlParts.length < 2) {
        return res.status(400).json({ error: "URL inválida." });
      }

      const [id, objectName] = urlParts;
      const objectToDelete = `${id}/${objectName}`;

      await blob.objects.delete([objectToDelete]);

      res.status(200).json({ message: "Áudio deletado com sucesso!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao deletar o áudio." });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
