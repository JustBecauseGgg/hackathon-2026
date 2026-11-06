import { motion } from 'framer-motion'

// placeholder screens until design + components land
export default function App() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-950 text-white flex items-center justify-center"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold">Flashcards</h1>
        <p className="mt-2 text-slate-400">Vite + React + Tailwind + Framer Motion — готово к сборке экранов</p>
      </div>
    </motion.main>
  )
}
