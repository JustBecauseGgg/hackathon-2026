// self-check честного мока: node test/gigachat.test.mjs
import { extractFromText } from '../src/api/gigachat.js'

const text = 'Гиппокамп — часть лимбической системы мозга, отвечающая за память. Нейрон — это структурная единица нервной системы. Второй абзац просто болтает о погоде и не содержит определений вообще.'
const cards = extractFromText(text, 'Анатомия')
console.assert(cards.length === 2, 'expect 2 cards')
console.assert(cards[0].question === 'Гиппокамп' && !cards[0].answer.startsWith('это'), 'dash term ok')
console.assert(cards[1].question === 'Нейрон' && cards[1].answer.startsWith('структурная'), 'это-strip ok')
console.assert(extractFromText('Текст вообще без определений ни о чём.', '').length === 0, 'no-template -> no cards')
console.log(cards.map(c => `${c.question} → ${c.answer}`))
console.log('ALL OK')
