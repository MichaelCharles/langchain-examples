import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { restaurantInformationRetrievalTool } from "./retrieval-chain-tool";
import { SystemMessage } from "@langchain/core/messages";
dotenv.config();

async function main() {
  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      "You are a helpful assistant that provides information about the restaurant Katsuya Sushi."
    ),
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
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
    input: "What are your hours?",
    chat_history: [],
  });

  console.log(result);
}

main().catch(console.error);
