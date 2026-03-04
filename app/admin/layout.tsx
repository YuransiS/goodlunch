import { Metadata } from 'next'
import '../[lang]/globals.css'

export const metadata: Metadata = {
    title: 'Admin - GoodLunch',
    robots: 'noindex, nofollow'
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-gray-50 text-gray-900">
                {children}
            </body>
        </html>
    )
}
