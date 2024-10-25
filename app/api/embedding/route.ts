import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline } from '@xenova/transformers';
import { PCA } from 'ml-pca';

// Initialize Pinecone client with API key and environment
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
});
const INDEX_NAME = "paradox";

async function loadModel() {
    const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    return model;
  }
  
  async function getEmbeddings(sentences:string) {
    const model = await loadModel();
    const embeddings = await model(sentences);
    return embeddings;
  }
export const POST = async (req: NextRequest) => {
    try {
        // Parse the incoming JSON request body
        const text = "Cars are integral to modern life, offering convenience, performance, and a blend of personal style. When discussing a car, several key attributes come to mind: brand, color, body type, and features. Each of these aspects plays a role in a car’s appeal, functionality, and the overall driving experience. in my home Additionally, the features of a car have become increasingly important in recent years, with advancements in technology offering everything from advanced safety systems to infotainment. Safety features, such as lane-keeping assistance, automatic emergency braking, and adaptive cruise control, are now commonplace in newer models. Infotainment systems with touch screens, smartphone connectivity, and voice control make for a more enjoyable and convenient driving experience. High-end models offer luxurious extras like leather interiors, heated seats, and premium sound systems, adding to comfort and aesthetic appeal. Electric and hybrid options from brands like Tesla and Toyota also reflect growing environmental consciousness among buyers, with features like extended battery life and fast charging capabilities."
        // Validate input text
        if (typeof text !== "string" || text.trim() === "") {
            return NextResponse.json(
                { message: "Invalid input text" },
                { status: 400 }
            );
        }

        console.log("Received text:");

        // Generate text embeddings using TensorFlow
        const embedding:any = await getEmbeddings(text);
        console.log("Embedding generated:",embedding);
        if (!embedding || embedding.length === 0) {
            throw new Error("Embedding generation failed");
        }

        

        // console.log("Embedding generated:",embedding);

        // // Access the index from Pinecone client
        // const index = pinecone.Index(INDEX_NAME);
        // const vector = {
        //     id: `unique-id-${Date.now()}`, // Generate a unique ID
        //     values: embedding[0] as number[], // Cast to number[] explicitly
        // };

        // console.log("Vector:", vector);

        // Use upsert directly on the vector array
        // await index.upsert([vector]);

        return NextResponse.json(
            { message: "Embedding stored successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in /api/embedding POST handler:", error);
        return NextResponse.json(
            { message: "Failed to store embedding", error: error.message },
            { status: 500 }
        );
    }
};
