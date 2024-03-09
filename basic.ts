import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import * as dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
const Timer = require("readable-elapsed-timer");
dotenv.config();

/* This is a basic example of how to use the LLMChain class.
 * It is a simple wrapper around the OpenAI class and the PromptTemplate class.
 * It takes a prompt template and a language model (in this case, OpenAI).
 * It will then run the prompt with the given values and return the result.
 *
 * I've also included a Timer class to measure the time it takes to generate the result.
 *
 * This example uses simple completion prompts as opposed to chat prompts.
 */

const template =
  "Create a product name for a new kind of environmentally friendly {product}? Give only one result with no explanations.";
const prompt = new PromptTemplate({
  template,
  inputVariables: ["product"],
});

const openAIModel = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  modelName: "gpt-4-turbo-preview",
});

const googleModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "gemini-pro",
  temperature: 0.9,
});

const anthropicModel = new ChatAnthropic({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  modelName: "claude-3-opus-20240229",
  temperature: 0.9,
});

async function main() {
  console.log(
    "Generating the name of a new kind of environmentally friendly coffee..."
  );
  const googleChain = new LLMChain({
    llm: googleModel,
    prompt,
  });

  const openAIChain = new LLMChain({
    llm: openAIModel,
    prompt,
  });

  const anthropicChain = new LLMChain({
    llm: anthropicModel,
    prompt,
  });

  const googleTimer = new Timer();
  const googleResult = await googleChain.call({
    product: "brand of coffee",
  });
  const googleElapsed = googleTimer.elapsed();

  const openAITimer = new Timer();
  const openAIResult = await openAIChain.call({
    product: "brand of coffee",
  });
  const openAIElapsed = openAITimer.elapsed();

  const anthropicTimer = new Timer();
  const anthropicResult = await anthropicChain.call({
    product: "brand of coffee",
  });
  const anthropicElapsed = anthropicTimer.elapsed();

  console.log({
    googleElapsed,
    googleResult,
    openAIElapsed,
    openAIResult,
    anthropicElapsed,
    anthropicResult,
  });
}

main().catch(console.error);
