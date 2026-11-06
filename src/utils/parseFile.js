import mammoth from 'mammoth'

// shortcut: mammoth (≈500KB) statically imported ради .docx в хакатонной сборке;
// при вырастании бандла — вынести в dynamic import по расширению файла
export async function extractText(file) {
  if (file.name.toLowerCase().endsWith('.docx')) {
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    return value
  }
  return file.text()
}
