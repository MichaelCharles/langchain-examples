import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import * as dotenv from "dotenv";
dotenv.config();

/* This is a basic example of how to use the LLMChain class.
 * It is a simple wrapper around the OpenAI class and the PromptTemplate class.
 * It takes a prompt template and a language model (in this case, OpenAI).
 * It will then run the prompt with the given values and return the result.
 */

const template =
  "Create a product name for a new kind of environmentally friendly {product}?";
const prompt = new PromptTemplate({
  template,
  inputVariables: ["product"],
});

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  modelName: "gpt-3.5-turbo",
});

const chain = new LLMChain({
  llm,
  prompt,
});

async function main() {
  const result = await chain.call({
    product: "brand of coffee",
  });

  console.log(result);
}

main().catch(console.error);
