import Tesseract, { ImageLike } from "tesseract.js";

/*function imageToText(img: ImageLike): void {
  Tesseract.recognize(img, "eng", { logger: (m) => console.log(m) }).then(
    ({ data: { text } }) => {
      console.log(text);
    }
  );
}*/
async function imageToText(img: ImageLike): Promise<string> {
  const convertedToText: Tesseract.RecognizeResult = await Tesseract.recognize(img, "eng", {
    logger: (m) => console.log(m),
  });
  //console.log(convertedToText.data["text"]);
  return convertedToText.data["text"];
}
export default imageToText;
