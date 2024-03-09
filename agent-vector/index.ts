import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { Calculator } from "langchain/tools/calculator";
import * as dotenv from "dotenv";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { restaurantInformationRetrievalTool } from "./retrieval-chain-tool";
dotenv.config();

async function main() {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });

  const tools = [restaurantInformationRetrievalTool];

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const result = await agentExecutor.invoke({
    input: "What is the most popular thing on the menu at Katsuya Sushi?",
    chat_history: [],
  });

  console.log(result);
}

main().catch(console.error);
