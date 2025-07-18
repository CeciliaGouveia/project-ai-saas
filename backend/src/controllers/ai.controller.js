export const generateArticle = async () => {
  try {
    const { userId } = req.auth()

    const { prompt, length } = req.body

    const plan = req.plan

    const free_usage = req.free_usage

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue",
      })
    }
  } catch (err) {}
}
