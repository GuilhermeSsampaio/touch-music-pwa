// pages/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
// import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Home = () => {
  const [audios, setAudios] = useState([]);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Função para buscar os dados da API
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/audios");
        console.log("Dados recebidos da API:", response.data);
        setAudios(response.data.response.response.objects || []);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        setAudios([]); // Definir como array vazio em caso de erro
      }
    };
    fetchData();
  }, []);

  const handleAudioUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Por favor, selecione um arquivo de áudio.");
      return;
    }

    if (!fileName) {
      alert("Por favor, insira um nome para o arquivo.");
      return;
    }

    setIsUploading(true); // Iniciar o spinner de upload

    const formData = new FormData();
    formData.append("audio", file); // Campo 'audio' deve corresponder ao 'multer.single("audio")'

    try {
      const response = await fetch(
        `/api/upload?name=${encodeURIComponent(fileName)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Upload bem-sucedido:", data);
      alert("Áudio enviado com sucesso!");

      // Adicionar o novo áudio ao estado
      setAudios((prevAudios) => [
        ...prevAudios,
        {
          id: data.data.id,
          size: data.data.size,
          created_at: new Date().toISOString(),
        },
      ]);

      // Resetar o formulário
      setFile(null);
      setFileName("");
      setPreviewUrl("");
    } catch (error) {
      console.error("Erro ao fazer upload do áudio:", error);
      alert("Erro ao enviar o áudio.");
    } finally {
      setIsUploading(false); // Parar o spinner de upload
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Tem certeza que deseja deletar este áudio?");
    if (confirmDelete) {
      setIsDeleting(true); // Iniciar o spinner de deleção
      try {
        const audioUrl = `https://public-blob.squarecloud.dev/${id}`;
        const response = await axios.delete(
          `/api/delete_audio?name=${encodeURIComponent(audioUrl)}`
        );
        console.log("Áudio deletado:", response.data);
        alert("Áudio deletado com sucesso!");

        // Remover o áudio do estado
        setAudios((prevAudios) =>
          prevAudios.filter((audio) => audio.id !== id)
        );
      } catch (error) {
        console.error("Erro ao deletar o áudio:", error);
        alert("Erro ao deletar o áudio.");
      } finally {
        setIsDeleting(false); // Parar o spinner de deleção
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  return (
    <div className="container-fluid bg-dark text-white min-vh-100">
      <Head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      {/* Conteúdo da página */}
      <div className="container mt-4">
        <h2>Dados da API:</h2>

        {audios.length > 0 ? (
          <div className="row">
            {audios.map((object) => (
              <div className="col-md-4" key={object.id}>
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title">Título da música</h5>
                  </div>
                  <div className="card-body">
                    <p>ID: {object.id}</p>
                    <p>Tamanho: {object.size}</p>
                    <p>
                      Criado em:{" "}
                      {new Date(object.created_at).toLocaleDateString()}
                    </p>

                    <audio controls className="mt-2 audio-player w-100">
                      <source
                        src={`https://public-blob.squarecloud.dev/${object.id}`}
                        type="audio/mpeg"
                      />
                      Seu navegador não suporta o elemento de áudio.
                    </audio>

                    <button
                      className="btn btn-danger mt-2"
                      onClick={() => handleDelete(object.id)}
                      disabled={isDeleting} // Desabilitar o botão durante a deleção
                    >
                      {isDeleting ? "Deletando..." : "Deletar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum áudio encontrado.</p>
        )}

        {/* Formulário de Upload */}
        <div className="container mt-5">
          <form id="audioForm" onSubmit={handleAudioUpload}>
            <div className="mb-3">
              <label htmlFor="audioUpload" className="form-label">
                Selecione um arquivo de áudio:
              </label>
              <input
                type="file"
                id="audioUpload"
                accept="audio/*"
                className="form-control"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fileName" className="form-label">
                Digite o nome do arquivo:
              </label>
              <input
                type="text"
                id="fileName"
                className="form-control"
                placeholder="Nome do arquivo"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={isUploading} // Desabilitar o botão durante o upload
            >
              {isUploading ? "Enviando..." : "Enviar"}
            </button>
          </form>

          {/* Preview do Áudio */}
          {previewUrl && (
            <div className="mt-4">
              <h2>Escute seu áudio:</h2>
              <audio
                id="audioPreview"
                controls
                src={previewUrl}
                className="w-100"
              ></audio>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
