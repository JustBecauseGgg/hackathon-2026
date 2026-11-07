// e2e-проверка PDF-парсера (того же кода, что в src/utils/parseFile.js)
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

const objs = []
objs[1] = '<</Type/Catalog/Pages 2 0 R>>'
objs[2] = '<</Type/Pages/Kids[3 0 R]/Count 1>>'
objs[3] = '<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>'
const stream = 'BT /F1 24 Tf 72 700 Td (Kvantovaya mechanika test conspekt) Tj ET'
objs[4] = `<</Length ${stream.length}>>stream\n${stream}\nendstream`
objs[5] = '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>'
let pdf = '%PDF-1.4\n'
const offsets = []
for (let i = 1; i <= 5; i++) { offsets[i] = pdf.length; pdf += `${i} 0 obj\n${objs[i]}\nendobj\n` }
const xref = pdf.length
pdf += 'xref\n0 6\n0000000000 65535 f \n' + offsets.slice(1).map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('') + `trailer<</Size 6/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF`

const doc = await pdfjs.getDocument({ data: new TextEncoder().encode(pdf), useWorkerFetch: false, isEvalSupported: false }).promise
const content = await (await doc.getPage(1)).getTextContent()
const text = content.items.map((i) => i.str).join(' ')
console.log('PAGES:', doc.numPages, 'TEXT:', text)
if (doc.numPages !== 1 || !text.includes('Kvantovaya')) {
  console.error('PDF PARSE FAIL')
  process.exit(1)
}
console.log('PDF PARSE OK')
