'use client'
import { useState, useEffect } from 'react'

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [orders, setOrders] = useState<any[]>([])
    const [error, setError] = useState('')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'admin123') { // Simple hardcoded password for MVP
            setIsAuthenticated(true)
            fetchOrders()
        } else {
            setError('Invalid password')
        }
    }

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders')
            if (res.ok) {
                setOrders(await res.json())
            }
        } catch (e) {
            console.error(e)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Вхід для адміністратора</h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-orange hover:bg-orange-600 focus:outline-none"
                            >
                                Увійти
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Панель замовлень GoodLunch</h1>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium"
                    >
                        Оновити дані
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Всього замовлень</p>
                        <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
                        <p className="text-sm font-medium text-gray-500">Нові</p>
                        <p className="text-3xl font-bold text-gray-900">{orders.filter((o: any) => o.status === 'New').length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
                        <p className="text-sm font-medium text-gray-500">Оплачено / Виконано</p>
                        <p className="text-3xl font-bold text-gray-900">{orders.filter((o: any) => o.status === 'Paid').length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-orange-500">
                        <p className="text-sm font-medium text-gray-500">В процесі</p>
                        <p className="text-3xl font-bold text-gray-900">{orders.filter((o: any) => o.status === 'In Progress').length}</p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Клієнт</th>
                                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Пакет</th>
                                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Контакт</th>
                                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{order.name}</div>
                                        <div className="text-gray-500">{order.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 flex gap-2 items-center">
                                            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs">{order.package === 'meals3' ? '3 Страви' : '4 Страви'}</span>
                                            <span>{order.calories} kcal</span>
                                        </div>
                                        <div className="text-gray-500 text-xs mt-1">{order.price} zł</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize text-xs font-medium">
                                            {order.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`block w-full pl-3 pr-10 py-2 text-base outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm rounded-md border-gray-300 font-bold ${order.status === 'New' ? 'text-blue-600 bg-blue-50' :
                                                order.status === 'Paid' ? 'text-green-600 bg-green-50' :
                                                    order.status === 'No Answer' ? 'text-red-600 bg-red-50' :
                                                        'text-orange-600 bg-orange-50'
                                                }`}
                                        >
                                            <option value="New">Новий</option>
                                            <option value="In Progress">В процесі</option>
                                            <option value="Paid">Оплачено</option>
                                            <option value="No Answer">Немає відповіді</option>
                                            <option value="Cancelled">Скасовано</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Наразі немає замовлень.
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
