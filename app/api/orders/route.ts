import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Make sure data dir exists
        const dataDir = path.dirname(dataFilePath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Read existing orders
        let orders = [];
        if (fs.existsSync(dataFilePath)) {
            const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
            if (fileContent) {
                orders = JSON.parse(fileContent);
            }
        }

        const newOrder = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: 'New',
            ...body
        };

        orders.push(newOrder);

        fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));

        return NextResponse.json({ success: true, orderId: newOrder.id });
    } catch (error) {
        console.error('Error saving order:', error);
        return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
    }
}
