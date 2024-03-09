import * as dotenv from "dotenv";
dotenv.config({ path: require("path").resolve(__dirname, "../.env") });

import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

/*
 * This is a tool which uses the method established in `/vector/use-vectorstore.ts`
 * to retrieve information about the restaurant Katsuya Sushi. This is
 * encapsulated in a DynamicStructuredTool, which is a type of tool that
 * can be used in the Langchain platform.
 *
 * This tool can then be passed to an agent, so that an agent can
 * use it to retrieve information about the restaurant Katsuya Sushi.
 */

async function retrieveRestaurantInformation(query: string) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await FaissStore.load("./", embeddings);

  const model = new OpenAI({
    temperature: 0.9,
    modelName: "gpt-4-turbo-preview",
  });

  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAStuffChain(model),
    retriever: vectorStore.asRetriever(),
    returnSourceDocuments: true,
  });

  const result = await chain.invoke({
    query,
  });

  return result.text;
}

export const restaurantInformationRetrievalTool = new DynamicStructuredTool({
  name: "restaurant-information-retrieval-tool",
  description: "retrieves information about the restaurant Katsuya Sushi",
  schema: z.object({
    query: z
      .string()
      .describe(
        "This is a question in human language regarding the restaurant Katsuya Sushi. For example, 'What is the name of the cook of Katsuya Sushi?'"
      ),
  }),
  func: async ({ query }) => await retrieveRestaurantInformation(query),
});
