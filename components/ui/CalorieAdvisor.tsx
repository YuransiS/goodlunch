'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRICING } from '@/lib/constants'

type Gender = 'male' | 'female'
type ActivityLevel = 1 | 2 | 3 | 4 | 5

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725,
  5: 1.9
}

const ACTIVITY_ICONS: Record<ActivityLevel, string> = {
  1: '🛋️',
  2: '🚶',
  3: '🚴',
  4: '🏋️',
  5: '🏆'
}

function findClosestTier(tdee: number, pkg: 'meals3' | 'meals4'): number {
  const options = PRICING[pkg]
  let closest = options[0]
  let minDiff = Math.abs(tdee - options[0].value)
  for (const opt of options) {
    const diff = Math.abs(tdee - opt.value)
    if (diff < minDiff) {
      minDiff = diff
      closest = opt
    }
  }
  return closest.value
}

export function CalorieAdvisor({
  isOpen,
  onCloseAction,
  onSelectCaloriesAction,
  mealPackage,
  dict
}: {
  isOpen: boolean
  onCloseAction: () => void
  onSelectCaloriesAction: (calories: number) => void
  mealPackage: 'meals3' | 'meals4'
  dict: any
}) {
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState<ActivityLevel>(2)
  const [result, setResult] = useState<number | null>(null)
  const [suggestedCalories, setSuggestedCalories] = useState<number | null>(null)

  const a = dict.advisor

  const calculate = (e: React.FormEvent) => {
    e.preventDefault()
    const ageN = parseInt(age)
    const heightN = parseInt(height)
    const weightN = parseInt(weight)

    // Mifflin-St Jeor formula
    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weightN + 6.25 * heightN - 5 * ageN + 5
    } else {
      bmr = 10 * weightN + 6.25 * heightN - 5 * ageN - 161
    }

    const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activity])
    const closest = findClosestTier(tdee, mealPackage)
    setResult(tdee)
    setSuggestedCalories(closest)
  }

  const handleSelect = () => {
    if (suggestedCalories) {
      onSelectCaloriesAction(suggestedCalories)
      onCloseAction()
    }
  }

  const handleClose = () => {
    setResult(null)
    setSuggestedCalories(null)
    onCloseAction()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="advisor-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        >
          <div onClick={handleClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            {/* Header gradient */}
            <div className="bg-gradient-to-r from-brand-orange to-orange-400 px-6 pt-6 pb-8">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
              </button>
              <div className="text-4xl mb-3">🧮</div>
              <h3 className="text-xl font-extrabold text-white">{a.title}</h3>
              <p className="text-orange-100 text-sm mt-1">{a.subtitle}</p>
            </div>

            <div className="px-6 pt-4 pb-6 -mt-4 bg-white rounded-t-3xl">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={calculate}
                    className="space-y-4"
                  >
                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{a.gender_label}</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['male', 'female'] as Gender[]).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                              gender === g
                                ? 'border-brand-orange bg-orange-50 text-brand-orange'
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <span className="text-xl">{g === 'male' ? '♂️' : '♀️'}</span>
                            {g === 'male' ? a.gender_male : a.gender_female}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age / Height / Weight */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{a.age_label}</label>
                        <input
                          required
                          type="number"
                          min={10} max={100}
                          value={age}
                          onChange={e => setAge(e.target.value)}
                          placeholder={a.age_placeholder}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 font-medium text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{a.height_label}</label>
                        <input
                          required
                          type="number"
                          min={100} max={250}
                          value={height}
                          onChange={e => setHeight(e.target.value)}
                          placeholder={a.height_placeholder}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 font-medium text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{a.weight_label}</label>
                        <input
                          required
                          type="number"
                          min={30} max={250}
                          value={weight}
                          onChange={e => setWeight(e.target.value)}
                          placeholder={a.weight_placeholder}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Activity Level */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{a.activity_label}</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {([1, 2, 3, 4, 5] as ActivityLevel[]).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setActivity(lvl)}
                            title={a[`activity_${lvl}`]}
                            className={`flex flex-col items-center py-2.5 px-1 rounded-xl border-2 transition-all text-xs font-semibold ${
                              activity === lvl
                                ? 'border-brand-orange bg-orange-50 text-brand-orange'
                                : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            <span className="text-lg mb-1">{ACTIVITY_ICONS[lvl]}</span>
                            <span className="leading-tight text-center">{lvl}</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 text-center">{a[`activity_${activity}`]}</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-brand-orange to-orange-400 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-brand-orange/30 mt-2"
                    >
                      {a.calculate_btn} ✨
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <div className="text-5xl mb-3">🎯</div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">{a.result_title}</p>
                    <div className="text-5xl font-extrabold text-brand-orange mb-1">
                      {result} <span className="text-2xl text-gray-400">kcal</span>
                    </div>
                    {suggestedCalories && (
                      <div className="mt-2 mb-4 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                        <span className="text-xs text-gray-500">Нearestt plan:</span>
                        <span className="font-extrabold text-brand-orange">{suggestedCalories} kcal</span>
                      </div>
                    )}
                    <p className="text-gray-500 text-sm px-2 mb-6">{a.result_comment}</p>

                    <div className="flex flex-col gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSelect}
                        className="w-full bg-gradient-to-r from-brand-orange to-orange-400 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-brand-orange/30"
                      >
                        {a.select_btn} →
                      </motion.button>
                      <button
                        onClick={() => setResult(null)}
                        className="w-full text-gray-500 font-semibold py-2 hover:text-gray-700 text-sm"
                      >
                        ← {a.back_btn}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
