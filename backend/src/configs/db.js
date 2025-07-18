import dotenv from "dotenv"
dotenv.config()
import { neon } from "@neondatabase/serverless"

let sql

try {
  const DATABASE_URL = process.env.DATABASE_URL

  if (!DATABASE_URL) {
    throw new Error("DATABASE_RL não está definida nas variáveis de ambiente")
  }

  sql = neon(DATABASE_URL)
} catch (err) {
  console.error("Falha ao inicializar a conexão com o banco de dados Neon", err)
  process.exit(1)
}

export default sql
