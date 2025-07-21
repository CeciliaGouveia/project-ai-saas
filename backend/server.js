import express from "express"
import cors from "cors"
import "dotenv/config"
import { clerkMiddleware, requireAuth } from "@clerk/express"
import featuresRouter from "./src/routes/features.route.js"
import connectCloudinary from "./src/configs/cloudinary.js"

const app = express()

await connectCloudinary()

const PORT = process.env.PORT || 3000

app.use(cors())

app.use(express.json())

app.use(clerkMiddleware())

app.get("/", (req, res) => res.send("Servidor ativo"))

app.use(requireAuth())

app.use("/api/ai", featuresRouter)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
