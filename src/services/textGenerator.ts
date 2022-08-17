import tesseract from "node-tesseract-ocr";
/*import Tesseract, { ImageLike } from "tesseract.js";

async function imageToText(img: any): Promise<string> {
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

export default imageToText;
