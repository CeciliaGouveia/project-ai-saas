import fs from "fs"
import pdf from "pdf-parse/lib/pdf-parse.js"

export const extractTextFromPdf = async (filePath) => {
  // Transformando o resumo num Data Buffer para que retorne dados binários
  const dataBuffer = fs.readFileSync(filePath)

  // Extraindo o texto do pdf para ler e interpretar o conteúdo
  const pdfData = await pdf(dataBuffer)

  return pdfData.text
}
