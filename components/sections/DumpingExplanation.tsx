'use client'
import { motion } from 'framer-motion'

export default function DumpingExplanation({ dict }: { dict: any }) {
    return (
        <section className="py-16 bg-brand-bg relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto bg-white rounded-3xl p-8 lg:p-12 shadow-md border border-brand-orange/10 flex flex-col md:flex-row items-center gap-8"
                >
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12h4l3-9 5 18 3-9h5" />
                        </svg>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">
                            {dict.dumping.title}
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                            {dict.dumping.text}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
