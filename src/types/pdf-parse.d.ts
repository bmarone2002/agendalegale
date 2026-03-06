// pdf-parse@1.1.1 non include tipi; dichiarazione minima per il build
declare module "pdf-parse" {
  function pdfParse(buffer: Buffer): Promise<{ text?: string }>;
  export default pdfParse;
}
