import mammoth from 'mammoth'
import * as pdfjs from 'pdfjs-dist'

// shortcut: mammoth (≈500KB) statically imported ради .docx в хакатонной сборке;
// при вырастании бандла — вынести в dynamic import по расширению файла

// pdf-воркер: bundled worker через новый API pdf.js (не нужен отдельный файл в public)
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

// текст постранично, склейка с пустой строкой между страницами
async function extractPdfText(file) {
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }
  return pages.join('\n\n')
}

export async function extractText(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.docx')) {
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    return value
  }
  if (name.endsWith('.pdf')) return extractPdfText(file)
  return file.text()
}
