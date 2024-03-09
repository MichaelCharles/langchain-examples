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

/* This is a combination of all the previous examples. We import
 * the restaurantInformationRetrievalTool from the retrieval-chain-tool
 * which is a tool that retrieves information from a vector store about
 * the restaurant Katsuya Sushi. We then create an agent that uses
 * the ChatOpenAI model to respond to user input and uses the
 * restaurantInformationRetrievalTool to retrieve information about
 * the restaurant.
 *
 * This demonstrates how RAG agents can be created using the
 * langchain/agents package.
 */

async function main() {
  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      "You are a helpful assistant that provides information about the restaurant Katsuya Sushi."
    ),
    new MessagesPlaceholder("chat_history"), // The chat history is injected here.
    HumanMessagePromptTemplate.fromTemplate("{input}"), // The user's input is injected here.
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
    verbose: false, // Set to true to see the agent's internal state
  });

  const result = await agentExecutor.invoke({
    input: "What are your hours?",
    chat_history: [
      // In a real chat, you would load the chat history so far
      // from the database and pass it in here as an array of
      // HumanMessage, SystemMessage, and AIMessage objects.
    ],
  });

  console.log(result);
}

main().catch(console.error);
