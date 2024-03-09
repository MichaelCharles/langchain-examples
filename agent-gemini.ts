import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { Calculator } from "langchain/tools/calculator";
import * as dotenv from "dotenv";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage } from "@langchain/core/messages";
dotenv.config();

/* This is an example of using Gemini to create an agent which is able to call
 * other tools. The source is the same as that of the OpenAI variant, other than
 * the language model used. This demonstrates that the createOpenAIFunctionsAgent
 * function can be used with any language model that implements the Chat interface.
 */

async function main() {
  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage("You are a helpful assistant"),
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "gemini-pro",
    temperature: 0.9,
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
    verbose: true,
  });

  const result = await agentExecutor.invoke({
    input:
      "Get the current temperature in Tokyo, Japan in celsius, then find the square root of that number.",
    chat_history: [],
  });

  console.log(result);
}

main().catch(console.error);
