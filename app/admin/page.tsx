'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [authHeader, setAuthHeader] = useState('')
    const [orders, setOrders] = useState<any[]>([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Clear error on input change
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
                // Precompute the Basic Auth header for subsequent requests
                const token = btoa(`${login}:${password}`);
                const headerValue = `Basic ${token}`;
                setAuthHeader(headerValue);
                setIsAuthenticated(true);
                fetchOrders(headerValue);
            } else {
                setError('Невірний логін або пароль');
            }
        } catch (e) {
            setError('Помилка сервера. Спробуйте ще раз.');
        } finally {
            setIsLoading(false)
        }
    }

    const fetchOrders = async (header = authHeader) => {
        try {
            const res = await fetch('/api/admin/orders', {
                headers: { 'Authorization': header }
            })
            if (res.ok) {
                setOrders(await res.json())
            } else {
                if (res.status === 401) {
                    setIsAuthenticated(false);
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': authHeader
                 },
                body: JSON.stringify({ id, status })
            })
            // Optimistic update
            setOrders(orders.map((o: any) => o.id === id ? { ...o, status } : o))
        } catch (e) {
            console.error(e)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 bg-[url('/noise.png')] relative overflow-hidden px-4">
                
                {/* Decorative glowing orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-orange/30 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                        <div className="text-center mb-8">
                            <motion.div 
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
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
                                    type="text"
                                    required
                                    className="appearance-none bg-black/40 border border-white/10 rounded-xl block w-full px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-transparent transition-all"
                                    placeholder="admin_username"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Пароль</label>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none bg-black/40 border border-white/10 rounded-xl block w-full px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-transparent transition-all"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        // Hide trailing spaces issue by trimming password
                                    }}
                                />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-400 text-sm text-center font-medium"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative flex justify-center py-4 px-4 font-bold rounded-xl text-white bg-brand-orange hover:bg-orange-500 hover:shadow-lg hover:shadow-brand-orange/25 active:scale-[0.98] transition-all disabled:opacity-75 overflow-hidden group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Увійти"
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-zinc-50 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Панель замовлень <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">GoodLunch</span></h1>
                        <p className="text-zinc-500 mt-1">Керування запитами клієнтів</p>
                    </div>
                    <button
                        onClick={() => fetchOrders()}
                        className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 text-sm font-semibold text-zinc-700 transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Оновити дані
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Всього</p>
                        <p className="text-4xl font-extrabold text-zinc-900">{orders.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative overflow-hidden group border-t-4 border-t-blue-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Нові</p>
                        <p className="text-4xl font-extrabold text-zinc-900">{orders.filter((o: any) => o.status === 'New').length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative overflow-hidden group border-t-4 border-t-green-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Оплачено</p>
                        <p className="text-4xl font-extrabold text-zinc-900">{orders.filter((o: any) => o.status === 'Paid').length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative overflow-hidden group border-t-4 border-t-orange-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">В процесі</p>
                        <p className="text-4xl font-extrabold text-zinc-900">{orders.filter((o: any) => o.status === 'In Progress').length}</p>
                    </div>
                </div>

                {/* Orders Table Container */}
                <div className="bg-white shadow-xl shadow-zinc-200/40 border border-zinc-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 text-sm">
                            <thead className="bg-zinc-50/80">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">Дата</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">Клієнт</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">Адреса</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">Замовлення</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">Статус</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-zinc-100">
                                {orders.map((order: any, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={order.id} 
                                        className="hover:bg-zinc-50/80 transition-colors group"
                                    >
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-zinc-900 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                                            </div>
                                            <div className="text-zinc-500 text-xs mt-0.5">
                                                {new Date(order.createdAt).toLocaleTimeString('uk-UA')}
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-zinc-900 text-base">{order.name || 'Без імені'}</div>
                                            <div className="text-zinc-600 font-medium mt-1">{order.phone}</div>
                                            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-bold capitalize">
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${order.messenger === 'telegram' ? 'bg-blue-400' : order.messenger === 'whatsapp' ? 'bg-green-500' : 'bg-purple-500'}`}></span>
                                                {order.messenger || 'N/A'}
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="text-zinc-800 font-medium pb-1">
                                                <span className="text-zinc-400">Вул:</span> {order.street || '-'} <span className="text-zinc-400 ml-1">Дім:</span> {order.house || '-'}
                                            </div>
                                            <div className="text-zinc-600 text-xs">
                                                <span className="text-zinc-400">Кв:</span> {order.apt || '-'}, <span className="text-zinc-400 ml-1">Пов:</span> {order.floor || '-'}, <span className="text-zinc-400 ml-1">Домофон:</span> {order.intercom || '-'}
                                            </div>
                                            <div className="mt-2 text-xs font-bold text-brand-orange bg-orange-50 inline-block px-2 py-1 rounded">
                                                {order.deliveryDay === 'tomorrow' ? 'Доставка на завтра' : 'Післязавтра'}
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="inline-flex gap-2 items-center mb-1.5">
                                                <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                    {order.package === 'meals3' ? '3 Страви' : '4 Страви'}
                                                </span>
                                                <span className="text-zinc-600 font-semibold bg-zinc-100 px-2.5 py-1 rounded-lg text-xs">
                                                    {order.calories} kcal
                                                </span>
                                            </div>
                                            <div className="text-zinc-900 font-extrabold text-base mt-1.5">
                                                {order.price || '0'} <span className="text-zinc-400 text-sm font-medium">zł</span>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-5 whitespace-nowrap align-middle">
                                            <div className="relative">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className={`appearance-none block w-full pl-4 pr-10 py-2.5 text-sm font-bold outline-none ring-1 ring-inset focus:ring-2 focus:ring-brand-orange sm:text-sm rounded-xl transition-all cursor-pointer shadow-sm
                                                        ${order.status === 'New' ? 'text-blue-700 bg-blue-50 ring-blue-200' :
                                                        order.status === 'Paid' ? 'text-green-700 bg-green-50 ring-green-200' :
                                                        order.status === 'No Answer' ? 'text-red-700 bg-red-50 ring-red-200' :
                                                        order.status === 'Cancelled' ? 'text-zinc-600 bg-zinc-100 ring-zinc-200' :
                                                        'text-orange-700 bg-orange-50 ring-orange-200'
                                                    }`}
                                                >
                                                    <option value="New">Новий</option>
                                                    <option value="In Progress">В процесі</option>
                                                    <option value="Paid">Оплачено/Діє</option>
                                                    <option value="No Answer">Немає відповіді</option>
                                                    <option value="Cancelled">Скасовано</option>
                                                </select>
                                                {/* Custom Chevron since we hid appearance */}
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-4">
                                                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
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
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}} />
        </div>
    )
}
