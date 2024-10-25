import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});
const maxArraySize = 1024; // The total size of the array
const sentencesArray = new Array(maxArraySize).fill(''); // Initialize the array with empty strings

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  

// Function to add a sentence to the array
function addSentenceToArray(newSentence: string) {
    // Clear the existing sentences array
    for (let i = 0; i < maxArraySize; i++) {
        sentencesArray[i] = ''; // Reset to empty strings
    }

    let startIndex = 0;
    let arrayIndex = 0; // To keep track of the current index in sentencesArray

    // Loop until the entire sentence has been processed or we fill the array
    while (startIndex < newSentence.length && arrayIndex < maxArraySize) {
        // Extract a substring of up to 1024 characters
        const substring = newSentence.substring(startIndex, startIndex + maxArraySize);

        // Add the substring to the array
        sentencesArray[arrayIndex] = substring;
        console.log("Substring added successfully:", substring);

        // Update the start index and the array index for the next iteration
        startIndex += maxArraySize;
        arrayIndex++;
    }

    // If there are remaining positions not filled in the array, they will stay as empty strings.
    return sentencesArray; // Return the updated array
}



async function query(data:any) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/thenlper/gte-large",
		{
			headers: {
				Authorization: `Bearer ${process.env.HF_API_KEY}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}




async function insertToPinecone(embeddings: Float32Array, indexName: string) {
    const index = pinecone.Index(indexName); // Replace with your index name

    // Prepare the data for Pinecone
    const vector = {
        id: `unique_id-${Date.now()}`, // Provide a unique ID for this embedding
        values: Array.from(embeddings), // Convert to a regular array if needed
        metadata: { // Add any metadata you want to associate with the embedding
            // Example: category: 'cars', description: 'A detailed description of cars'
        },
    };

    // Upsert the vector
    await index.upsert([{ ...vector }]); // Wrap the vector in an array
}

export const POST = async (req: NextRequest) => {
    try {
        const text = "Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....Cars are integral to modern life, offering convenience, performance, and a blend of personal style....".repeat(10);


// Add the initial sentence
const sentenceArray = addSentenceToArray(text);
console.log("the ==--", sentenceArray)

        // Validate input text
        if (typeof text !== "string" || text.trim() === "") {
            return NextResponse.json(
                { message: "Invalid input text" },
                { status: 400 }
            );
        }
        console.log("Received text:");

        const embedding = await query({"inputs": {
            "source_sentence": text,
            "sentences": sentenceArray
        }})


        console.log(embedding);


        // Generate text embeddings
        // const embedding: any = await getEmbeddings(text);
        // console.log("Embedding generated:", embedding);

        if (!embedding || embedding.length === 0) {
            throw new Error("Embedding generation failed");
        }

        // Insert the embedding into Pinecone
        await insertToPinecone(embedding, 'hackathon'); 

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
