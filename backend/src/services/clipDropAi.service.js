import dotenv from "dotenv"
dotenv.config()
import axios from "axios"
import FormData from "form-data"

export const generateDropAIResponse = async (prompt) => {
  const formData = new FormData()
  formData.append("prompt", prompt)

  try {
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",

      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    )

    console.log("Imagem gerada com sucesso")

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`

    return base64Image
  } catch (err) {
    console.error("Erro ao gerar imagem: ", err.message)
  }
}
