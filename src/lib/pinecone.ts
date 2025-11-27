import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";



let pinecone: Pinecone | null = null;

// Singleton pattern to create a single Pinecone client
export const getPineconeClient = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

export async function loadS3IntoPinecone(fileKey: string) {
  console.log("Downloading file from S3...");
  
  // 1. Download the PDF from S3
  const file_name = await downloadFromS3(fileKey);

  // - Read PDF
  if(!file_name){
    throw  new Error('could not download from s3');
  }
const loader = new PDFLoader(file_name);
const pages = await loader.load();

return pages;


  // - Split into chunks
  // - Generate embeddings
  // - Upsert to Pinecone

 
}