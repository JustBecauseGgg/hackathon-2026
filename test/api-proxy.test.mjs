// e2e: POST /api/gigachat/cards — реальная генерация через Laravel → routerai (gigachat)
const r = await fetch('http://127.0.0.1:8000/api/gigachat/cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Гиппокамп — часть лимбической системы мозга, отвечающая за память. ' +
          'Нейрон — структурная единица нервной системы. ' +
          'Митоз называется непрямым делением клетки. ' +
          'Аксона — длинный отросток нейрона, проводящий импульсы от тела клетки. ' +
          'Синапс — место контакта между двумя нейронами для передачи сигнала.',
    topic: 'Биология',
  }),
})
const data = await r.json().catch(() => ({}))
console.log(`status=${r.status}`)
console.log(JSON.stringify(data, null, 2).slice(0, 1500))
