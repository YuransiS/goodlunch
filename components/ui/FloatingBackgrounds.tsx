'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function FloatingBackgrounds() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"]
    })

    // Float up
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-500%"])
    // Float down
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "300%"])
    const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360])
    const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180])

    return (
        <div ref={ref} className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">

            {/* Element 1: Leaf */}
            <motion.div
                style={{ y: y1, rotate: rotate1 }}
                className="absolute top-[20%] left-[5%] opacity-10"
            >
                <svg fill="currentColor" className="text-brand-orange w-32 h-32" viewBox="0 0 24 24">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22l1-2.3A4.49,4.49 0 0,0 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 7,11.5 7,11.5C7,11.5 10.9,9.54 13.9,7.6Z" />
                </svg>
            </motion.div>

            {/* Element 2: Orange Circle / Tomato */}
            <motion.div
                style={{ y: y2, rotate: rotate2 }}
                className="absolute top-[50%] right-[10%] opacity-10"
            >
                <svg fill="currentColor" className="text-brand-dark w-40 h-40" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            </motion.div>

            {/* Element 3: Abstract Shape */}
            <motion.div
                style={{ y: y1, rotate: rotate2 }}
                className="absolute top-[80%] left-[15%] opacity-10"
            >
                <svg fill="currentColor" className="text-brand-green w-48 h-48" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
            </motion.div>

        </div>
    )
}
