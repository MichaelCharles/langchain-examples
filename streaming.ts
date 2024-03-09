import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import * as dotenv from "dotenv";
dotenv.config();

const template = "Write a poem about the beauty of {subject}?";
const prompt = new PromptTemplate({
  template,
  inputVariables: ["subject"],
});

const openAIModel = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  modelName: "gpt-3.5-turbo",
  streaming: true,
  callbacks: [
    {
      handleLLMNewToken: (token) => {
        process.stdout.write(token);
      },
    },
  ],
});

async function main() {
  const openAIChain = new LLMChain({
    llm: openAIModel,
    prompt,
  });

  await openAIChain.call({
    subject: "coffee",
  });
}

main().catch(console.error);
