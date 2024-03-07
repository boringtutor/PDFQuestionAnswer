"use client";
import { DropZoneArea } from "@/components/DropZone";
import { writeToFile } from "@/utils/writeFile";
import axios from "axios";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const initialState = {
  blobfile: "",
};

type fileType = {
  altText: string;
  contentType: string;
  blob: string;
};

const uploadState: fileType = {
  altText: "testing the altText",
  contentType: "application/pdf",
  blob: "blob",
};

function createInitialState(
  initialstate: typeof initialState,
  formData: FormData
) {
  console.log("Form Data:");
  const data = formData.get("file-input");
  console.log("Form Data:", data);
  return {
    blobfile: "testing the altText",
  };
}

async function getArrayData(data: FormDataEntryValue) {
  const pdfData = await data?.arrayBuffer();
  const blob = Buffer.from(pdfData);
  return blob;
}

async function extractTextFromPDF(pdfData: ArrayBuffer) {
  const loadingTask = pdfjs.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  let extractedText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    let pageData = "";
    const textContent = await page.getTextContent();
    textContent.items.forEach((textItem) => {
      pageData += textItem.str;
      extractedText += textItem.str + "\n";
    });

    console.log("Page Data:", pageData);
    //TODO: send the page data to the server so we can work page by page on the data.
    //TODO: we have to implement the server where we send the data and then

    //TODO: get the answer back and then figure out how to display the answer using useEffect or something.
  }

  // const cofig = {
  //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   data: {
  //     extractedText,
  //   },
  //   withCredentials: true,
  // };

  axios
    .post("http://localhost:3000/questionanswer", {
      data: {
        extractedText: extractedText,
      },
    })
    .then((res) => {
      console.log("Response:", res);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}

// async function extractTextFromPDF(pdfData: ArrayBuffer) {
//   const loadingTask = p.getDocument({ data: pdfData });
//   const pdf = await loadingTask.promise;
//   const numPages = pdf.numPages;
//   let text = "";

//   for (let i = 1; i <= numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     const pageText = content.items.map((item) => item.str).join(" ");
//     text += pageText + "\n"; // Add a newline between pages
//   }

//   return text;
// }

async function uploadFile(initlaState: fileType, formData: FormData) {
  const data = await formData.get("file-upload");
  console.log("upload data", data);
  const honeypot = await formData.get("honey-pot");
  if (honeypot) {
    return {
      altText: "failed",
      contentType: "failed",
      blob: "failed",
    };
  }
  const pdfData = await data?.arrayBuffer();
  const extractedText = await extractTextFromPDF(pdfData);

  return {
    altText: "sending from data from server",
    contentType: "application/pdf",
    blob: extractedText,
  };
}

export default function Home() {
  // const [state, formAction] = useFormState(createInitialState, initialState);
  const [upload, uploadAction] = useFormState(uploadFile, uploadState);
  // const [display, setDisplay] = useState<string>("");
  const [PreviewFile, setPreviewFile] = useState<string | null>(null);

  const { pending } = useFormStatus();

  const name = "file-input";
  // function SubmitButton() {
  //   const { pending } = useFormStatus();
  //   if (pending) {
  //     console.log("Pending");
  //   }
  //   return (
  //     <button type="submit" aria-disabled={pending}>
  //       Add
  //     </button>
  //   );
  // }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <form action={uploadAction}>
        <div className="flex flex-col">
          {/* <label
            htmlFor="file-upload "
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Upload File
          </label>

          <input
            type="file"
            id="file-upload"
            name="file-upload"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            onChange={(e) => {
              const file = e.target.files?.[0];
              // console.log("File:", file);
              if (file) {
                const reader = new FileReader();
                // console.log("Reader:", reader);
                reader.onload = (e) => {
                  const res = e.target?.result as string;
                  // console.log("result is  : ", reader.result);
                  // console.log("Result:", res);
                  setPreviewFile(res);
                };
                reader.readAsDataURL(file);
              } else {
                setPreviewFile(null);
              }
            }}
         /> */}

          <DropZoneArea setPreviewFile={setPreviewFile} />

          <div className="flex ">
            <input
              id="honey-pot"
              name="honey-pot"
              className=""
              hidden
              aria-hidden
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              type="submit"
              aria-disabled={pending}
              onClick={() => {
                setPreviewFile(null);
              }}
            >
              upload
            </button>
          </div>
        </div>
      </form>
      {PreviewFile && (
        <div className="flex w-[80%] h-[500px] mx-10 justify-center items-center bg-slate-400 ">
          <FileViewer
            src={PreviewFile}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex">{upload?.altText}</div>
        <div>{upload?.contentType}</div>
        <div>{upload?.blob}</div>
      </div>

      {/*TODO: Testing the axios service */}
      <button
        className="bg-blue-500 text-white m-10 px-4 py-2 rounded-md"
        onClick={() => {
          console.log("clickeing");
          axios
            .post("http://localhost:3000/questionanswer", {
              data: {
                extractedText:
                  "This is the text that is being sent to the server",
              },
            })
            .then((res) => {
              console.log("Response:", res);
            })
            .catch((err) => {
              console.log("Error:", err);
            });
        }}
      >
        Testing Axios
      </button>
    </main>
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
