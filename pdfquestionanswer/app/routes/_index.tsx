import { prisma } from "#app/utils/db.server.ts";
// import { openAI } from "#app/utils/openai.server.ts";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
// import { FileUpload } from "../components/file-upload";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { useState } from "react";
// import { z } from "zod";
import * as pdfjsLib from "pdfjs-dist";

// const MAX_UPLOAD_SIZE = 1024 * 1024 * 10; // 10MB

// const FileFieldsetSchema = z.object({
//   id: z.string().optional(),
//   file: z
//     .instanceof(File)
//     .optional()
//     .refine((file) => {
//       return !file || file.size <= MAX_UPLOAD_SIZE;
//     }, "File size must be less than 10MB"),
//   altText: z.string().optional(),
// });

// type FileFieldset = z.infer<typeof FileFieldsetSchema>;

// function FileHasId(
//   File: FileFieldset
// ): File is FileFieldset & { id: NonNullable<FileFieldset["id"]> } {
//   return File.id != null;
// }

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

async function extractTextFromPDF(pdfData: ArrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  let text = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    text += pageText + "\n"; // Add a newline between pages
  }

  return text;
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  // console.log("Form Data:", formData.get("blobfile"));
  const data = formData.get("blobfile");
  const pdfData = await data?.arrayBuffer();
  const blob = Buffer.from(pdfData);
  const res = {
    altText: "testing the altText",
    contentType: "application/pdf",
    blob: blob,
  };
  // const numbes_of_string = blob.toJSON().data;
  // const test = numbes_of_string.slice(0, 10000);
  // const string_form_number = String.fromCharCode(...test);
  // const uint8Array = new Uint8Array(blob);

  // // If you want to convert it to a string
  // const text = new TextDecoder().decode(uint8Array);
  // console.log("text is  : ", text);

  // const firstTenBytes = Array.from(uint8Array.slice(0, 10))
  //   .map((byte) => byte.toString(16).padStart(2, "0"))
  //   .join("");
  // console.log("firstTenBytes is  : ", firstTenBytes);

  extractTextFromPDF(pdfData)
    .then((text) => {
      //NOTE: This is where you get the extracted text
      //TODO: we can send this data to the text to speach api
      console.log("Extracted text:", text);
      // Do something with the extracted text
    })
    .catch((error) => {
      console.error("Error extracting text:", error);
    });

  //database connection
  // await prisma.file.create({
  //   data: {
  //     ...res,
  //   },
  // });
  console.log("res is  :", res);
  return redirect("/");
}

export const loader = async () => {
  const res = await prisma.file.findMany();
  return json({ res: res });
};

async function openTest() {
  console.log("running main function");
  // console.log(openai);
}

export default function Index() {
  const [PreviewFile, setPreviewFile] = useState<string | null>(null);
  const data = useLoaderData<typeof loader>();
  const file = data.res;

  return (
    <div className="flex flex-col w-full h-full bg-red-200">
      <div className="flex flex-1 flex-col h-screen w-full bg-emerald-200">
        <Form method="post" encType="multipart/form-data" id="file_upload_form">
          <label htmlFor="avatar-input">Avatar</label>
          <input
            id="avatar-input"
            type="file"
            name="blobfile"
            onChange={(e) => {
              const file = e.target.files?.[0];
              console.log("File:", file);
              if (file) {
                const reader = new FileReader();
                console.log("Reader:", reader);
                reader.onload = (e) => {
                  const res = e.target?.result as string;
                  console.log("result is  : ", reader.result);
                  // console.log("Result:", res);
                  setPreviewFile(res);
                };

                reader.readAsDataURL(file);

                // reader.onloadend = (e) => {
                //   console.log("ended reading file");
                //   console.log("e is ", e);
                // };
              } else {
                setPreviewFile(null);
              }
            }}
          />
        </Form>

        <button
          form="file_upload_form"
          type="submit"
          className="fixed bottom-4 right-4 px-4 py-2 text-white bg-sky-400 rounded-md"
          onClick={() => {
            setPreviewFile(null);
          }}
        >
          Submit
        </button>
      </div>
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        .PDF (MAX. 800x400px).
      </p>
      <button
        className="bg-sky-400 w-32 h-32"
        onClick={() => {
          console.log("clicked the button");
          // openAI();
          openTest();
        }}
      >
        testing...
      </button>
      This is where the file will be uploaded
      {PreviewFile && (
        // <embed
        //   src={PreviewFile}
        //   type="application/pdf"
        //   width="100%"
        //   height="100%"
        // />
        <div className="flex w-[80%] h-[500px] mx-10 justify-center items-center bg-slate-400 ">
          <FileViewer
            src={PreviewFile}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      )}
      <ul>
        {file.map((file) => (
          <li key={file.id}>
            {file.altText}
            {file.contentType}
            {file.id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FileViewer({
  src,
  type,
  width,
  height,
}: {
  src: string;
  type: string;
  width: string;
  height: string;
}) {
  return <embed src={src} type={type} width={width} height={height} />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}
