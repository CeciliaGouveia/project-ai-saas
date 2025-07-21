import { v2 as Translate } from "@google-cloud/translate"
import path from "path"

// Garante caminho absoluto do ficheiro JSON
const keyPath = path.resolve("src/credentials/google-translate.json")

const translate = new Translate.Translate({
  keyFilename: keyPath,
})

export const translateToEnglish = async (text) => {
  const [translation] = await translate.translate(text, "en")
  return translation.toLowerCase()
}
