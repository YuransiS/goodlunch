'use client'
import { motion } from 'framer-motion'

export default function Features({ dict }: { dict: any }) {
  const features = [
    {
      id: 1,
      title: dict.features.t1, // "Экономишь время"
      desc: dict.features.d1,
      icon: "⏳",
      color: "bg-blue-50 text-blue-600",
      delay: 0.1
    },
    {
      id: 2,
      title: dict.features.t2, // "Дешевле магазина"
      desc: dict.features.d2,
      icon: "💰",
      color: "bg-green-50 text-green-600",
      delay: 0.2
    },
    {
      id: 3,
      title: dict.features.t3, // "Свежо и вкусно"
      desc: dict.features.d3,
      icon: "🥗",
      color: "bg-brand-orange/10 text-brand-orange",
      delay: 0.3
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-brand-dark"
        >
          {dict.features.title}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: f.delay }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}