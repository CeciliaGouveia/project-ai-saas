import express from "express"
import { auth } from "../middlewares/auth.js"
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview,
} from "../controllers/ai.controller.js"
import { upload } from "../middlewares/multer.js"

const featuresRouter = express.Router()

featuresRouter.post("/generate-article", auth, generateArticle)
featuresRouter.post("/generate-blog-title", auth, generateBlogTitle)
featuresRouter.post("/generate-image", auth, generateImage)
featuresRouter.post(
  "/remove-image-background",
  auth,
  upload.single("image"),
  removeImageBackground
)
featuresRouter.post(
  "/remove-image-object",
  auth,
  upload.single("image"),
  removeImageObject
)
featuresRouter.post(
  "/resume-review",
  auth,
  upload.single("resume"),
  resumeReview
)

export default featuresRouter
