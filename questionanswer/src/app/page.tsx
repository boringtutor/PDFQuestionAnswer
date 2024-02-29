"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

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

function uploadFile(initlaState: fileType, formData: FormData) {
  const data = formData.get("file-upload");
  console.log("upload data", data);

  return {
    altText: "testing the altText",
    contentType: "application/pdf",
    blob: "blob",
  };
}

export default function Home() {
  const [state, formAction] = useFormState(createInitialState, initialState);
  const [upload, uploadAction] = useFormState(uploadFile, uploadState);
  const [display, setDisplay] = useState<string>("");
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
      <form action={formAction}>
        <label htmlFor={name}>Enter Task</label>
        <input
          type="text"
          id={name}
          name={name}
          required
          className="text-black"
          value={display}
          onChange={(e) => {
            setDisplay(e.target.value);
          }}
        />
        <button type="submit" aria-disabled={pending}>
          Add
        </button>
        <p aria-live="polite" className="sr-only" role="status">
          {state?.blobfile}
        </p>
      </form>

      <form action={uploadAction}>
        <label htmlFor="file-upload">Upload File</label>
        <input
          type="file"
          id="file-upload"
          name="file-upload"
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
            } else {
              setPreviewFile(null);
            }
          }}
        />
        <button
          type="submit"
          aria-disabled={pending}
          onClick={() => {
            setPreviewFile(null);
          }}
        >
          upload
        </button>
        <p aria-live="polite" className="sr-only" role="status">
          {upload?.altText}
        </p>
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
