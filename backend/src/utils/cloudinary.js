import { v2 as cloudinary } from "cloudinary"

export const uploadImageToCloudinary = async (baseImage) => {
  return await cloudinary.uploader.upload(baseImage)
}

export const uploadImageRemoveBackToCloudinary = async (userImagePath) => {
  return await cloudinary.uploader.upload(userImagePath, {
    transformation: [
      {
        effect: "background_removal",
        background_removal: "remove_the_background",
        flags: "preserve_transparency", // mantém fundo transparente
      },
    ],
    quality: "auto:best", // tenta manter a melhor qualidade possível
    format: "png", // garante transparência e sem perdas
    fetch_format: "auto", // deixa o Cloudinary decidir entre png/webp se necessário
    resource_type: "image",
  })
}

export const uploadImageRemoveObjToCloudinary = async (
  userImagePath,
  object
) => {
  const result = await cloudinary.uploader.upload(userImagePath, {
    eager: [{ effect: `gen_remove:${(object || "").trim()}` }],
    format: "png",
    quality: "auto:best",
  })

  const imgUrl = result?.eager?.[0]?.secure_url

  return imgUrl
}
