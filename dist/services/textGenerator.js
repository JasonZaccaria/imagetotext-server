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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_tesseract_ocr_1 = __importDefault(require("node-tesseract-ocr"));
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
const imageToText = (img) => __awaiter(void 0, void 0, void 0, function* () {
    const convertedToText = yield node_tesseract_ocr_1.default.recognize(img);
    return convertedToText;
});
exports.default = imageToText;
