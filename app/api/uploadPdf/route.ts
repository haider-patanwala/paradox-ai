import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import PDFParser from "pdf2json";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const uploadedFiles = formData.getAll("file");
  let fileName = "";

  console.log("uploadedFiles:", uploadedFiles);

  if (uploadedFiles && uploadedFiles.length > 0) {
    for (const uploadedFile of uploadedFiles) {
      if (uploadedFile instanceof File) {
        console.log("Uploaded file:", uploadedFile);

        // Generate a unique filename
        fileName = uuidv4();
        const tempFilePath = `/tmp/${fileName}.pdf`;

        // Convert ArrayBuffer to Buffer
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
        await fs.writeFile(tempFilePath, fileBuffer);

        // Parse the PDF using pdf2json, wrapped in a promise
        const parsedText = await new Promise<string>((resolve, reject) => {
          const pdfParser = new (PDFParser as any)(null, 1);

          pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.log(errData.parserError);
            reject(errData.parserError);
          });

          pdfParser.on("pdfParser_dataReady", () => {
            const text = (pdfParser as any).getRawTextContent();
            console.log("the parsed text is:", text);
            resolve(text);
          });

          pdfParser.loadPDF(tempFilePath);
        });

        // Return the parsed text after it's ready
        return NextResponse.json({ message: "success", data: parsedText }, { status: 200 });
      } else {
        console.log("Uploaded file is not in the expected format.");
      }
    }
  } else {
    console.log("No files found.");
    return NextResponse.json({ message: "No files found." }, { status: 400 });
  }

  return NextResponse.json({ message: "No valid file processed." }, { status: 400 });
}
