"use client"
import { FilePond } from "react-filepond"
import "filepond/dist/filepond.min.css"
import { useState } from "react"

export default function FileUpload() {
  // const [imageData, setImageData] = useState<File | null>(null);

  // const convertImageToBase64 = (image: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve((reader.result as string).split(",")[1]);
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(image);
  //   });
  // };

  // const getText = async (imageData:any) => {
  //   const responce = await fetch(
  //     "https://openrouter.ai/api/v1/chat/completions",
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer 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`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         model: "meta-llama/llama-3.2-11b-vision-instruct:free",
  //         messages: [
  //           {
  //             role: "user",
  //             content: [
  //               {
  //                 type: "text",
  //                 text: "What's in this image?",
  //               },
  //               {
  //                 type: "image_url",
  //                 image_url: {
  //                   url: imageData,
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       }),
  //     }
  //   );

  //   console.log("responce", await responce.json());
  // };
  // const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const data = convertImageToBase64(file);
  //   data.then((data) => getText(data));

  //   }
  // };

  return (
    // <div className="mb-4">
    //   <label
    //     htmlFor="image-upload"
    //     className="cursor-pointer bg-blue-500 text-white p-2 rounded"
    //   >
    //     Upload Image
    //   </label>
    //   <input
    //     id="image-upload"
    //     type="file"
    //     accept="image/*"
    //     onChange={handleImageUpload}
    //     style={{ display: "none" }}
    //   />
    // </div>

    <FilePond
      server={{
        process: "/api/upload",
        fetch: null,
        revert: null
      }}
    />
  )
}
