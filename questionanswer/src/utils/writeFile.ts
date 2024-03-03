import fs from "node:fs";

export function writeToFile(text: string) {
  fs.writeFile("./tests/bucket/text.txt", text, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  console.log("text is  : ", text);
}
