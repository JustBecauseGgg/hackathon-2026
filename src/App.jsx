import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header.jsx'
import Upload from './screens/Upload.jsx'
import Loading from './screens/Loading.jsx'
import Placeholder from './screens/Placeholder.jsx'
import Login from './screens/Login.jsx'
import Register from './screens/Register.jsx'
import Main from './screens/Main.jsx'
import { useApp } from './store.js'

export default function App() {
  const screen = useApp((s) => s.screen)
  const user = useApp((s) => s.user)

  // нет user — только публичные страницы: главная-лендинг, вход, регистрация
  if (!user && screen !== 'main') {
    return (
      <AnimatePresence mode="wait">
        <motion.div key={screen === 'register' ? 'register' : 'login'} className="flex min-h-screen flex-col">
          {screen === 'register' ? <Register /> : <Login />}
        </motion.div>
      </AnimatePresence>
    )
  }
  if (!user) return <Main />

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AnimatePresence mode="wait">
        <motion.div key={screen} className="flex flex-1 flex-col">
          {screen === 'upload' && <Upload />}
          {screen === 'loading' && <Loading />}
          <Placeholder screen={screen} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
