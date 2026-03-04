import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json');

export async function GET() {
    try {
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json([]);
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        const orders = fileContent ? JSON.parse(fileContent) : [];

        // Sort newest first
        orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error reading orders:', error);
        return NextResponse.json({ error: 'Failed to read orders' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, status } = await request.json();

        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({ error: 'No orders found' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        let orders = fileContent ? JSON.parse(fileContent) : [];

        const orderIndex = orders.findIndex((o: any) => o.id === id);
        if (orderIndex === -1) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        orders[orderIndex].status = status;

        fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
