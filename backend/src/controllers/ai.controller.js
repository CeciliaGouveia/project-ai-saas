import { generateGeminiAIResponse } from "../services/geminiAi.service.js"
import { generateDropAIResponse } from "../services/clipDropAi.service.js"
import sql from "../configs/db.js"
import { clerkClient } from "@clerk/express"
import {
  uploadImageToCloudinary,
  uploadImageRemoveBackToCloudinary,
  uploadImageRemoveObjToCloudinary,
} from "../utils/cloudinary.js"
import { extractTextFromPdf } from "../utils/pdfReader.js"

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth()

    const { prompt, length } = req.body

    const plan = req.plan

    const free_usage = req.free_usage

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(401).json({
        success: false,
        message: "Limit reached. Upgrade to continue",
      })
    }

    const content = await generateGeminiAIResponse(prompt, length)

    await sql` INSERT INTO creations (user_id, prompt,content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      })
    }

    res.status(200).json({ success: true, content })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth()

    const { prompt } = req.body

    const length = 200

    const plan = req.plan

    const free_usage = req.free_usage

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(401).json({
        success: false,
        message: "Limit reached. Upgrade to continue",
      })
    }

    const content = await generateGeminiAIResponse(prompt, length)

    await sql` INSERT INTO creations (user_id, prompt,content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      })
    }

    res.status(200).json({ success: true, content })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth()

    const { prompt, publish } = req.body

    const plan = req.plan

    if (plan !== "premium") {
      return res.status(401).json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      })
    }

    // gerando a imagem com a IA
    const imageBuffer = await generateDropAIResponse(prompt)

    if (!imageBuffer) {
      return res
        .status(500)
        .json({ success: false, message: "Error generating image." })
    }

    // salvando a imagem gerada no cloudinary
    const { secure_url } = await uploadImageToCloudinary(imageBuffer)

    // salvando no banco de dados
    await sql` INSERT INTO creations (user_id, prompt,content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${
      publish ?? false
    })`

    res.status(200).json({ success: true, content: secure_url })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth()

    const image = req.file

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image doesn't sent." })
    }

    const plan = req.plan

    if (plan !== "premium") {
      return res.status(401).json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      })
    }

    // salvando a imagem passada pelo usuário no cloudinary e removendo o fundo
    const { secure_url } = await uploadImageRemoveBackToCloudinary(image.path)

    // salvando no banco de dados
    await sql` INSERT INTO creations (user_id, prompt,content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`

    res.status(200).json({ success: true, content: secure_url })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth()
    const { object } = req.body

    const image = req.file

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image doesn't sent." })
    }

    const plan = req.plan

    if (plan !== "premium") {
      return res.status(401).json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      })
    }

    // salvando a imagem passada pelo usuário no cloudinary e retirando o objeto determinado pelo usuario
    const imgUrl = await uploadImageRemoveObjToCloudinary(image.path, object)

    // salvando no banco de dados
    await sql` INSERT INTO creations (user_id, prompt,content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imgUrl}, 'image')`

    res.status(200).json({ success: true, content: imgUrl })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth()
    const resume = req.file
    const length = 1000

    if (!resume) {
      return res
        .status(400)
        .json({ success: false, message: "Resume doesn't sent." })
    }

    const plan = req.plan

    if (plan !== "premium") {
      return res.status(401).json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      })
    }

    // Limitando envio de arquivos até 5mb
    if (resume.size > 5 * 1024 * 1024) {
      return res.status(413).json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      })
    }

    const resumeText = await extractTextFromPdf(resume.path)

    const prompt = `Review the following summary and provide constructive feedback on your strengths, weaknesses, and areas for improvement, all in portuguese. Your feedback should be no longer than 11000 characters. Resume Content:\n\n${resumeText}`

    const content = await generateGeminiAIResponse(prompt, length)

    // salvando no banco de dados
    await sql` INSERT INTO creations (user_id, prompt,content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`

    res.status(200).json({ success: true, content })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}
