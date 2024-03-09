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
dotenv.config();

/* This builds off of the agent-openai.ts example, but instead of using SerpAPI,
 * we create a custom tool that can determine the length of a string.
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

  // Create the custom tool for determining the length of a string
  const stringLengthTool = new DynamicStructuredTool({
    name: "string-length-tool",
    description: "gets the length of a received string",
    schema: z.object({
      string: z.string().describe("The string to get the length of"),
    }),
    func: async ({ string }) => `${string.length}`,
  });

  const tools = [new Calculator(), stringLengthTool];

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
    input: 'Get the length of the string "Onomatopoeia" and multiple it by 2.',
    chat_history: [],
  });

  console.log(result);
}

main().catch(console.error);
