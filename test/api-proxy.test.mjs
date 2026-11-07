// тест прокси: POST /api/gigachat/cards
const r = await fetch('http://127.0.0.1:8000/api/gigachat/cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Гиппокамп — часть лимбической системы мозга, отвечающая за память. Нейрон — структурная единица нервной системы.',
    topic: 'Биология',
  }),
})
const data = await r.json().catch(() => ({}))
console.log(`status=${r.status}`)
console.log(JSON.stringify(data, null, 2).slice(0, 600))
