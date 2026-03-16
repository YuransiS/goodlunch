'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { week1Menu, week2Menu } from '@/lib/menuData'

// ─────────────────── Types ───────────────────
type SidebarSection = 'orders' | 'menu'

const STORAGE_KEY_W1 = 'admin_menu_week1'
const STORAGE_KEY_W2 = 'admin_menu_week2'

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
const DAY_NAMES_FULL = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя']
const DISH_TYPE_LABELS = {
    breakfast: '🍳 Сніданок',
    soup: '🍲 Суп',
    main1: '🍽️ Основне 1',
    main2: '🥘 Основне 2',
}

function loadMenuFromStorage(weekKey: string, defaultMenu: any[]) {
    if (typeof window === 'undefined') return defaultMenu
    try {
        const stored = localStorage.getItem(weekKey)
        if (stored) return JSON.parse(stored)
    } catch {}
    return defaultMenu
}

// ─────────────────── Menu Editor Section ───────────────────
function MenuEditorSection() {
    const [weekNum, setWeekNum] = useState<1 | 2>(1)
    const [selectedDay, setSelectedDay] = useState(0) // 0 = Monday
    const [w1, setW1] = useState(() => loadMenuFromStorage(STORAGE_KEY_W1, JSON.parse(JSON.stringify(week1Menu))))
    const [w2, setW2] = useState(() => loadMenuFromStorage(STORAGE_KEY_W2, JSON.parse(JSON.stringify(week2Menu))))
    const [saved, setSaved] = useState(false)

    const currentMenu = weekNum === 1 ? w1 : w2
    const setCurrentMenu = weekNum === 1 ? setW1 : setW2

    const currentDay = currentMenu[selectedDay]

    const handleDishChange = (dishIndex: number, newTitle: string) => {
        const updated = currentMenu.map((day: any, dIdx: number) => {
            if (dIdx !== selectedDay) return day
            return {
                ...day,
                dishes: day.dishes.map((d: any, i: number) =>
                    i === dishIndex ? { ...d, title: newTitle } : d
                )
            }
        })
        setCurrentMenu(updated)
    }

    const handleSave = () => {
        const key = weekNum === 1 ? STORAGE_KEY_W1 : STORAGE_KEY_W2
        localStorage.setItem(key, JSON.stringify(currentMenu))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleReset = () => {
        if (!window.confirm('Скинути тиждень до початкових даних?')) return
        const defaults = weekNum === 1 ? week1Menu : week2Menu
        const fresh = JSON.parse(JSON.stringify(defaults))
        setCurrentMenu(fresh)
        const key = weekNum === 1 ? STORAGE_KEY_W1 : STORAGE_KEY_W2
        localStorage.removeItem(key)
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                        Редактор <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">Меню</span>
                    </h1>
                    <p className="text-zinc-500 mt-1">Змінюйте страви для кожного тижня та дня</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md text-sm font-semibold text-zinc-600 transition-all"
                    >
                        Скинути
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className={`px-5 py-2.5 rounded-xl shadow-sm text-sm font-bold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-brand-orange text-white hover:bg-orange-500'}`}
                    >
                        {saved ? '✓ Збережено!' : 'Зберегти'}
                    </motion.button>
                </div>
            </div>

            {/* Week selector */}
            <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-zinc-200 mb-6 w-fit">
                {([1, 2] as const).map(w => (
                    <button
                        key={w}
                        onClick={() => setWeekNum(w)}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${weekNum === w ? 'bg-brand-orange text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800'}`}
                    >
                        Тиждень {w}
                    </button>
                ))}
            </div>

            <div className="flex gap-6">
                {/* Day list */}
                <div className="flex flex-col gap-2 min-w-[100px]">
                    {DAY_NAMES.map((name, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedDay(idx)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm text-left transition-all ${selectedDay === idx ? 'bg-brand-orange text-white shadow-md' : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                {/* Dish editor */}
                {currentDay && (
                    <div className="flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                        <h3 className="font-extrabold text-zinc-900 text-lg mb-5">
                            {DAY_NAMES_FULL[selectedDay]}
                            <span className="ml-2 text-sm font-medium text-zinc-400">Тиждень {weekNum}</span>
                        </h3>
                        <div className="space-y-4">
                            {currentDay.dishes.map((dish: any, i: number) => (
                                <div key={i}>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                                        {DISH_TYPE_LABELS[dish.type as keyof typeof DISH_TYPE_LABELS]}
                                    </label>
                                    <input
                                        type="text"
                                        value={dish.title}
                                        onChange={e => handleDishChange(i, e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
                                        placeholder="Назва страви..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─────────────────── Lang Badge ───────────────────
const LANG_COLORS: Record<string, string> = {
    pl: 'bg-red-100 text-red-700 border-red-200',
    ua: 'bg-blue-100 text-blue-700 border-blue-200',
    ru: 'bg-green-100 text-green-700 border-green-200',
    en: 'bg-purple-100 text-purple-700 border-purple-200',
    unknown: 'bg-zinc-100 text-zinc-500 border-zinc-200',
}
const LANG_FLAGS: Record<string, string> = { pl: '🇵🇱', ua: '🇺🇦', ru: '🇷🇺', en: '🇬🇧', unknown: '❓' }

// ─────────────────── Main Admin Page ───────────────────
export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [authHeader, setAuthHeader] = useState('')
    const [orders, setOrders] = useState<any[]>([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [activeSection, setActiveSection] = useState<SidebarSection>('orders')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        if (error) setError('')
    }, [login, password])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            })
            if (res.ok) {
                const token = btoa(`${login}:${password}`)
                const headerValue = `Basic ${token}`
                setAuthHeader(headerValue)
                setIsAuthenticated(true)
                fetchOrders(headerValue)
            } else {
                setError('Невірний логін або пароль')
            }
        } catch (e) {
            setError('Помилка сервера. Спробуйте ще раз.')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchOrders = async (header = authHeader) => {
        setIsRefreshing(true)
        try {
            const res = await fetch('/api/admin/orders', { headers: { 'Authorization': header } })
            if (res.ok) {
                setOrders(await res.json())
            } else if (res.status === 401) {
                setIsAuthenticated(false)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsRefreshing(false)
        }
    }

    const deleteOrder = async (id: string) => {
        if (!window.confirm('Ви впевнені, що хочете назавжди видалити це замовлення?')) return
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({ id })
            })
            if (res.ok) setOrders(orders.filter((o: any) => o.id !== id))
        } catch (e) {
            console.error(e)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({ id, status })
            })
            setOrders(orders.map((o: any) => o.id === id ? { ...o, status } : o))
        } catch (e) {
            console.error(e)
        }
    }

    // ─────────── Login Screen ───────────
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-orange/30 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="w-16 h-16 bg-gradient-to-tr from-brand-orange to-orange-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand-orange/40 mb-6"
                            >
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </motion.div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
                            <p className="text-zinc-400 mt-2 text-sm">Введіть свої системні дані доступу</p>
                        </div>
                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Логін</label>
                                <input
                                    type="text" required
                                    className="appearance-none bg-black/40 border border-white/10 rounded-xl block w-full px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-transparent transition-all"
                                    placeholder="admin_username" value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Пароль</label>
                                <input
                                    type="password" required
                                    className="appearance-none bg-black/40 border border-white/10 rounded-xl block w-full px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-transparent transition-all"
                                    placeholder="••••••••••••" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="text-red-400 text-sm text-center font-medium"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            <button
                                type="submit" disabled={isLoading}
                                className="w-full relative flex justify-center py-4 px-4 font-bold rounded-xl text-white bg-brand-orange hover:bg-orange-500 hover:shadow-lg hover:shadow-brand-orange/25 active:scale-[0.98] transition-all disabled:opacity-75 overflow-hidden group"
                            >
                                {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Увійти'}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        )
    }

    // ─────────── Admin Dashboard ───────────
    const sidebarItems = [
        { id: 'orders' as SidebarSection, label: 'Замовлення', icon: '📦', badge: orders.filter(o => o.status === 'New').length },
        { id: 'menu' as SidebarSection, label: 'Меню', icon: '🍽️', badge: null },
    ]

    return (
        <div className="min-h-screen bg-zinc-50 font-sans flex">
            {/* Sidebar mobile overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: isSidebarOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-64 bg-zinc-950 z-50 flex flex-col lg:translate-x-0 lg:static lg:z-auto lg:animate-none"
                style={{ transform: undefined }}
            >
                <div className="lg:hidden">
                    <motion.aside
                        className="fixed top-0 left-0 h-full w-64 bg-zinc-950 z-50 flex flex-col"
                        initial={{ x: '-100%' }}
                        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <SidebarContent
                            items={sidebarItems}
                            activeSection={activeSection}
                            onSelect={(s) => { setActiveSection(s); setIsSidebarOpen(false) }}
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </motion.aside>
                </div>
                <div className="hidden lg:flex flex-col h-full">
                    <SidebarContent
                        items={sidebarItems}
                        activeSection={activeSection}
                        onSelect={(s) => setActiveSection(s)}
                    />
                </div>
            </motion.aside>

            {/* Static sidebar for desktop */}
            <aside className="hidden lg:flex w-64 flex-shrink-0 bg-zinc-950 flex-col min-h-screen">
                <SidebarContent
                    items={sidebarItems}
                    activeSection={activeSection}
                    onSelect={(s) => setActiveSection(s)}
                />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 text-zinc-600"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <span className="font-extrabold text-zinc-900 text-lg">GoodLunch</span>
                        <span className="ml-2 text-zinc-400 text-sm">Admin</span>
                    </div>
                    {activeSection === 'orders' && (
                        <button
                            onClick={() => fetchOrders()}
                            disabled={isRefreshing}
                            className="px-4 py-2 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md text-sm font-semibold text-zinc-700 transition-all flex items-center gap-2 disabled:opacity-75"
                        >
                            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Оновити
                        </button>
                    )}
                </header>

                {/* Page content */}
                <main className="p-4 md:p-8 flex-1">
                    <AnimatePresence mode="wait">
                        {activeSection === 'orders' ? (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <OrdersSection orders={orders} onDelete={deleteOrder} onUpdateStatus={updateStatus} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <MenuEditorSection />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer { 100% { transform: translateX(100%); } }` }} />
        </div>
    )
}

// ─────────────────── Sidebar Content ───────────────────
function SidebarContent({
    items,
    activeSection,
    onSelect,
    onClose,
}: {
    items: { id: SidebarSection; label: string; icon: string; badge: number | null }[]
    activeSection: SidebarSection
    onSelect: (s: SidebarSection) => void
    onClose?: () => void
}) {
    return (
        <div className="flex flex-col h-full py-4">
            <div className="px-4 mb-8 flex items-center justify-between">
                <div>
                    <div className="text-white font-extrabold text-xl tracking-tight">GoodLunch</div>
                    <div className="text-zinc-500 text-xs mt-0.5">Адмін панель</div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <nav className="flex-1 px-2 space-y-1">
                {items.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${activeSection === item.id
                            ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                            : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge !== null && item.badge > 0 && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeSection === item.id ? 'bg-white/20 text-white' : 'bg-brand-orange/30 text-brand-orange'}`}>
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="px-4 mt-4 border-t border-zinc-800 pt-4">
                <div className="text-zinc-600 text-xs text-center">GoodLunch Admin © 2026</div>
            </div>
        </div>
    )
}

// ─────────────────── Orders Section ───────────────────
function OrdersSection({
    orders,
    onDelete,
    onUpdateStatus
}: {
    orders: any[]
    onDelete: (id: string) => void
    onUpdateStatus: (id: string, status: string) => void
}) {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                        Замовлення <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">GoodLunch</span>
                    </h1>
                    <p className="text-zinc-500 mt-1">Керування запитами клієнтів</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Всього', value: orders.length, color: '' },
                    { label: 'Нові', value: orders.filter(o => o.status === 'New').length, color: 'border-t-4 border-t-blue-500' },
                    { label: 'Оплачено', value: orders.filter(o => o.status === 'Paid').length, color: 'border-t-4 border-t-green-500' },
                    { label: 'В процесі', value: orders.filter(o => o.status === 'In Progress').length, color: 'border-t-4 border-t-orange-500' },
                ].map(s => (
                    <div key={s.label} className={`bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm ${s.color}`}>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="text-4xl font-extrabold text-zinc-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white shadow-xl shadow-zinc-200/40 border border-zinc-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-200 text-sm">
                        <thead className="bg-zinc-50/80">
                            <tr>
                                {['Дата', 'Клієнт', 'Адреса', 'Замовлення', 'Мова', 'Статус', 'Дії'].map(h => (
                                    <th key={h} className="px-5 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-100">
                            {orders.map((order: any, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    key={order.id}
                                    className="hover:bg-zinc-50/80 transition-colors"
                                >
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="font-medium text-zinc-900">{new Date(order.createdAt).toLocaleDateString('uk-UA')}</div>
                                        <div className="text-zinc-400 text-xs">{new Date(order.createdAt).toLocaleTimeString('uk-UA')}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-zinc-900">{order.name || 'Без імені'}</div>
                                        <div className="text-zinc-600 font-medium">{order.phone}</div>
                                        <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-bold capitalize">
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${order.messenger === 'telegram' ? 'bg-blue-400' : order.messenger === 'whatsapp' ? 'bg-green-500' : 'bg-purple-500'}`}></span>
                                            {order.messenger || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="text-zinc-800 font-medium">
                                            <span className="text-zinc-400">Вул:</span> {order.street || '-'} <span className="text-zinc-400">Дім:</span> {order.house || '-'}
                                        </div>
                                        <div className="text-zinc-500 text-xs mt-1">
                                            <span className="text-zinc-400">Кв:</span> {order.apt || '-'}, <span className="text-zinc-400">Пов:</span> {order.floor || '-'}
                                        </div>
                                        <div className="mt-1.5 text-xs font-bold text-brand-orange bg-orange-50 inline-block px-2 py-0.5 rounded">
                                            {order.deliveryDay === 'tomorrow' ? '📅 Завтра' : '📅 Післязавтра'}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="inline-flex gap-1.5 items-center mb-1">
                                            <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-lg text-xs font-bold">
                                                {order.package === 'meals3' ? '3 Страви' : '4 Страви'}
                                            </span>
                                            <span className="text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-lg text-xs font-semibold">
                                                {order.calories} kcal
                                            </span>
                                        </div>
                                        <div className="text-zinc-900 font-extrabold text-base mt-1">
                                            {order.price || '0'} <span className="text-zinc-400 text-sm font-medium">zł</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${LANG_COLORS[order.lang || 'unknown']}`}>
                                            <span>{LANG_FLAGS[order.lang || 'unknown']}</span>
                                            <span className="uppercase">{order.lang || '?'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                                className={`appearance-none block w-full pl-3 pr-8 py-2 text-sm font-bold outline-none ring-1 ring-inset focus:ring-2 focus:ring-brand-orange rounded-xl transition-all cursor-pointer
                                                    ${order.status === 'New' ? 'text-blue-700 bg-blue-50 ring-blue-200' :
                                                    order.status === 'Paid' ? 'text-green-700 bg-green-50 ring-green-200' :
                                                    order.status === 'No Answer' ? 'text-red-700 bg-red-50 ring-red-200' :
                                                    order.status === 'Cancelled' ? 'text-zinc-600 bg-zinc-100 ring-zinc-200' :
                                                    'text-orange-700 bg-orange-50 ring-orange-200'}`}
                                            >
                                                <option value="New">Новий</option>
                                                <option value="In Progress">В процесі</option>
                                                <option value="Paid">Оплачено/Діє</option>
                                                <option value="No Answer">Немає відповіді</option>
                                                <option value="Cancelled">Скасовано</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onDelete(order.id)}
                                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Видалити"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-4">
                                            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <p className="text-zinc-500 font-medium">Наразі немає активних замовлень.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
