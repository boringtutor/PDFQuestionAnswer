import { LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useRef, useState } from "react";

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  console.log(formData);
}

export function FileUpload() {
  return (
    <div className="flex flex-1 flex-col h-screen w-full bg-emerald-200">
      <Form
        id="file_upload_form"
        method="POST"
        className="flex h-full flex-col gap-y-4 w-full bg-slate-400 px-10 pb-28 pt-12"
        encType="multipart/form-data" // This is important to upload files
      >
        <FileInput />
      </Form>

      <button
        form="file_upload_form"
        type="submit"
        className="fixed bottom-4 right-4 px-4 py-2 text-white bg-sky-400 rounded-md"
      >
        Submit
      </button>
    </div>
  );
}

export function FileInput() {
  const ref = useRef<HTMLFieldSetElement>(null);
  const [PreviewFile, setPreviewFile] = useState<string | null>(null);
  return (
    <div className="flex w-full h-full flex-col bg-red-400">
      <fieldset
        ref={ref}
        className="flex flex-col gap-y-4 border-4 border-sky-400"
      >
        <div>Upload File</div>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            console.log("File:", file);
            if (file) {
              const reader = new FileReader();
              console.log("Reader:", reader);
              reader.onload = (e) => {
                const res = e.target?.result as string;
                setPreviewFile(res);
              };
              reader.readAsDataURL(file);
            } else {
              setPreviewFile(null);
            }
          }}
        ></input>
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          .PDF (MAX. 800x400px).
        </p>
      </fieldset>

      {
        // Preview the file
        PreviewFile && <div>preview file available</div>
      }
    </div>
  );
}
