import dotenv from "dotenv"
dotenv.config()
import OpenAI from "openai"

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
})

export const generateGeminiAIResponse = async (prompt, length) => {
  const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        // "role" define o papel dessa msg, quem está enviando-a
        role: "system",
        // explico como esse agente (ou seja, a inteligência artificial) deve agir
        content: `Aja como uma assistente inteligente para negócios digitais, especializada em SEO, copywriting, conteúdo de alto impacto e edição de imagem profissional. Sua tarefa será realizar uma ou mais das seguintes funções, de forma precisa, clara, criativa e com alto padrão de qualidade:

                  1. Gere **títulos chamativos e otimizados para SEO**, utilizando técnicas de copywriting e gatilhos mentais, respeitando as melhores práticas para atrair cliques. Essencial que os títulos **envolvam os temas mais procurados nos mecanismos de busca**.
                  
                  2. Escreva um **artigo completo**, com base em um tema fornecido, seguindo as regras gramaticais, ortográficas e semânticas da língua portuguesa. O texto deve ser **otimizado para SEO**, conter palavras-chave relevantes, utilizar técnicas de **copywriting** para manter a atenção do leitor, e apresentar uma estrutura clara (título, introdução, desenvolvimento, conclusão).

                  3. Faça uma **análise crítica de resumos textuais**, revisando ortografia, semântica, estrutura acadêmica, clareza e coesão. Certifique-se de que o resumo aborde os pontos principais do tema de forma otimizada e objetiva.

                  Responda de forma especializada, utilizando linguagem compatível com o contexto (acadêmico, publicitário, técnico ou comercial). Seja objetiva, coesa e mantenha o tom profissional.
                `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: length,
  })
  return response.choices[0].message.content
}
