"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//import tesseract from "node-tesseract-ocr";
//import Tesseract, { ImageLike } from "tesseract.js";
const tesseract_js_1 = require("tesseract.js");
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
/*const imageToText = async (img: string) => {
  const convertedToText: string = await tesseract.recognize(img);
  return convertedToText;
};*/
const worker = (0, tesseract_js_1.createWorker)({
    logger: (m) => console.log(m),
});
const imageToText = (img) => __awaiter(void 0, void 0, void 0, function* () {
    yield worker.load();
    yield worker.loadLanguage("eng");
    yield worker.initialize("eng");
    const { data } = yield worker.recognize(img);
    console.log(data.text);
    //await worker.terminate();
    return data.text;
});
exports.default = imageToText;
