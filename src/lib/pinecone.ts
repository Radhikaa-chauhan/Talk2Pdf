import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { Document } from "@langchain/core/documents";


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

type PDFPage = {
  pageContent: string;
  metadata: { 
    loc: {
    pageNumber: number;
  }
};
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
const pages = (await loader.load()) as PDFPage[];



  // - Split into chunks
const documents = await Promise.all(pages.map(prepareDocument));
  // - Generate embeddings
  // - Upsert to Pinecone

 
}

export const truncateStringByByte = (str: string, bytes: number)=>{
  const enc = new TextEncoder();
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}



async function prepareDocument(page: PDFPage){

  let {pageContent, metadata} = page;
  const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
      new Document({
         pageContent: page.pageContent,
         metadata:{
          pageNumber: page.metadata.loc.pageNumber, 
          text: truncateStringByByte(page.pageContent, 36000)
         } }),
    ]);
    return docs;

}