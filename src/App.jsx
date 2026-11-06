import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header.jsx'
import Upload from './screens/Upload.jsx'
import Placeholder from './screens/Placeholder.jsx'
import { useApp } from './store.js'

export default function App() {
  const screen = useApp((s) => s.screen)
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AnimatePresence mode="wait">
        <motion.div key={screen} className="flex flex-1 flex-col">
          {screen === 'upload' && <Upload />}
          <Placeholder screen={screen} />        </motion.div>
      </AnimatePresence>
    </div>
  )
}
