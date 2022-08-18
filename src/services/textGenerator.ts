import tesseract from "node-tesseract-ocr";
//import Tesseract, { ImageLike } from "tesseract.js";
//import { createWorker } from "tesseract.js";

/*async function imageToText(img: any): Promise<string> {
  const convertedToText: Tesseract.RecognizeResult = await Tesseract.recognize(
    img,
    "eng",
    {
      logger: (m) => console.log(m),
    }
  );
  return convertedToText.data["text"];
}*/

const imageToText = async (img: string) => {
  const convertedToText: string = await tesseract.recognize(img);
  return convertedToText;
};
/*const worker = createWorker({
  logger: (m) => console.log(m),
});

const imageToText = async (img: string) => {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const { data } = await worker.recognize(img);
  console.log(data.text);
  //await worker.terminate();
  return data.text;
};*/

export default imageToText;
