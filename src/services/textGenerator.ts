import Tesseract, { ImageLike } from "tesseract.js";

async function imageToText(img: ImageLike): Promise<string> {
  const convertedToText: Tesseract.RecognizeResult = await Tesseract.recognize(img, "eng", {
    logger: (m) => console.log(m),
  });
  return convertedToText.data["text"];
}
export default imageToText;
