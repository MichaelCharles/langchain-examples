import * as dotenv from "dotenv";
dotenv.config({ path: require("path").resolve(__dirname, "../.env") });

import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";

async function main() {
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
    query: "What is the name of the cook of Katsuya Sushi?",
  });

  console.log(result);
}

main().catch(console.error);
