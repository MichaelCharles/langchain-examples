import * as dotenv from "dotenv";
dotenv.config({ path: require("path").resolve(__dirname, "../.env") });
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

/*
 * This is a demonstration of how to create a vector store from a set of documents.
 * It uses the OpenAIEmbeddings class to embed the documents and the FaissStore
 * class to store the embeddings. The documents are loaded from a file using
 * the TextLoader class and then split into chunks using the
 * CharacterTextSplitter class. The embeddings are then
 * created using the OpenAIEmbeddings class and stored
 * in a FaissStore.
 */

async function main() {
  const loader = new TextLoader("./knowledge.txt");

  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50,
  });

  const documents = await splitter.splitDocuments(docs);
  console.log(documents);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await FaissStore.fromDocuments(documents, embeddings);
  await vectorStore.save("./");
}

main().catch(console.error);
