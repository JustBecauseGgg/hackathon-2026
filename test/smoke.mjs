// смоук всего пайплайна без браузера: auth + генерация + интервальная логика + история колод
import { useApp } from '../src/store.js'

let fails = 0
function ok(cond, name) {
  console.log(cond ? `  ok  ${name}` : `FAIL  ${name}`)
  if (!cond) fails++
}

// 1. регистрация и логин
try {
  await useApp.getState().register('Тест', 'test@ex.ru', '123')
  ok(useApp.getState().user?.name === 'Тест', 'register → user, после входа — «Личный кабинет» (dashboard)')
} catch (e) { ok(false, 'register: ' + e.message) }
try {
  useApp.setState({ user: null, screen: 'login' })
  await useApp.getState().login('test@ex.ru', '123')
  ok(useApp.getState().user?.email === 'test@ex.ru', 'login OK')
} catch (e) { ok(false, 'login: ' + e.message) }
try { await useApp.getState().login('test@ex.ru', 'not-it'); ok(false, 'login отказ с неверным паролем') }
catch { ok(true, 'login отказ с неверным паролем') }

// 2. генерация карточек (mock) → screen=deck, очередь полная
useApp.setState({ sourceText: 'Гиппокамп — часть лимбической системы мозга, отвечающая за память. Нейрон — это структурная единица нервной системы. Митоз называется непрямым делением клетки.' })
await useApp.getState().generateCards()
let st = useApp.getState()
ok(st.screen === 'deck', 'generateCards → screen=deck')
ok(st.queue.length === st.cards.length, 'queue = все карточки')

// 3. интервалы: «Не знаю» → назад через 2; «Знаю»×2 → уходит
const first = st.queue[0]
st.answer(false)
st = useApp.getState()
ok(st.cards.find((c) => c.id === first) && st.queue.length === st.cards.length, '«Не знаю» не теряет карточку')
ok(st.queue[0] !== first, '«Не знаю» ушёл с головы (вернётся через 2)')
ok(st.stats.answered === 1 && st.stats.wrong === 1, 'стат капает: отвечено/ошибок')

// гоняем до завершения колоды: «Знаю» всегда
let guard = 1000
while (useApp.getState().queue.length && guard--) useApp.getState().answer(true)
st = useApp.getState()
ok(st.queue.length === 0, 'колода завершена («Знаю» ×2 у всех)')
ok(!!st.stats.finishedAt, 'finishedAt проставлен')

// 4. история для дашборда
ok(st.decks.length === 1 && st.decks[0].cards === st.cards.length, 'decks: запись завершённой колоды')
ok(st.decks[0].timeMs >= 0, 'время сессии записано (в ноде может быть 0мс)')

// 5. resetDeck
useApp.getState().resetDeck()
ok(useApp.getState().queue.length === st.cards.length, 'resetDeck восстанавливает очередь')
ok(useApp.getState().stats.answered === 0, 'resetDeck сбрасывает сессию')

if (fails) { console.log(`\n${fails} FAILURES`); process.exit(1) }
console.log('\nALL SMOKE OK')
