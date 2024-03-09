import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { Calculator } from "langchain/tools/calculator";
import * as dotenv from "dotenv";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
dotenv.config();

/* This is a basic example of how to use the AgentExecutor class.
 * It is a simple wrapper around the Agent class and the tools.
 * It takes a prompt template and a language model (in this case, OpenAI).
 * It will then run the prompt with the given values and return the result.
 * It also takes a list of tools to use.
 */

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

  const tools = [
    new SerpAPI(process.env.SERP_API_KEY ?? "", {
      hl: "en",
      gl: "us",
    }),
    new Calculator(),
  ];

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    // verbose: true,
  });

  const result = await agentExecutor.invoke({
    input:
      "Get the current temperature in Tokyo, Japan in celsius, then find the square root of that number.",
    chat_history: [],
  });

  console.log(result);
}

main().catch(console.error);
