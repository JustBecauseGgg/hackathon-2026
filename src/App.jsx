import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header.jsx'
import Upload from './screens/Upload.jsx'
import Loading from './screens/Loading.jsx'
import Deck from './screens/Deck.jsx'
import Stats from './screens/Stats.jsx'
import Blitz from './screens/Blitz.jsx'
import Login from './screens/Login.jsx'
import Register from './screens/Register.jsx'
import { useApp } from './store.js'

export default function App() {
  const screen = useApp((s) => s.screen)
  const user = useApp((s) => s.user)

  // функция приложения закрыта до входа: нет user — показываются только auth-страницы
  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key={screen === 'register' ? 'register' : 'login'} className="flex min-h-screen flex-col">
          {screen === 'register' ? <Register /> : <Login />}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AnimatePresence mode="wait">
        <motion.div key={screen} className="flex flex-1 flex-col">
          {screen === 'upload' && <Upload />}
          {screen === 'loading' && <Loading />}
          {screen === 'deck' && <Deck />}
          {screen === 'stats' && <Stats />}
          {screen === 'blitz' && <Blitz />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
