import { OpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import * as dotenv from "dotenv";
import { ConversationChain } from "langchain/chains";
dotenv.config();

/*
 * This is a demonstration of how to use the ConversationChain in
 * combination with BufferMemory to create a chain which automatically
 * remembers the history of a conversation.
 */

async function main() {
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo",
  });

  const memory = new BufferMemory();

  const chain = new ConversationChain({
    llm: model,
    memory,
  });

  const result = await chain.call({
    input: "Hello, my name is Michael.",
  });

  console.log(result);

  const result2 = await chain.call({
    input: "What is my name?",
  });

  console.log(result2);
}

main().catch(console.error);
