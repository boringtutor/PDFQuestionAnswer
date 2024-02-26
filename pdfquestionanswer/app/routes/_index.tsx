import { prisma } from "#app/utils/db.server.ts";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
// import { FileUpload } from "../components/file-upload";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 10; // 10MB

const FileFieldsetSchema = z.object({
  id: z.string().optional(),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 10MB"),
  altText: z.string().optional(),
});

type FileFieldset = z.infer<typeof FileFieldsetSchema>;

function FileHasId(
  File: FileFieldset
): File is FileFieldset & { id: NonNullable<FileFieldset["id"]> } {
  return File.id != null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  // console.log("Form Data:", formData.get("blobfile"));
  const data = formData.get("blobfile");
  const blob = Buffer.from(await data?.arrayBuffer());
  const res = {
    altText: "testing the altText",
    contentType: "application/pdf",
    blob: blob,
  };
  //database connection
  await prisma.file.create({
    data: {
      ...res,
    },
  });
  console.log("res is  :", res);
  return redirect("/");
}

export const loader = async () => {
  const res = await prisma.file.findMany();
  return json({ res: res });
};

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
                  console.log("Result:", res);
                  setPreviewFile(res);
                };
                reader.readAsDataURL(file);
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
