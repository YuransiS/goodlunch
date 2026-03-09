import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newOrder = {
            id: Date.now().toString(),
            name: body.name || '',
            phone: body.phone || '',
            messenger: body.messenger || '',
            street: body.street || '',
            house: body.house || '',
            floor: body.floor || '',
            apt: body.apt || '',
            intercom: body.intercom || '',
            deliveryDay: body.deliveryDay || '',
            package: body.package || '',
            calories: parseInt(body.calories) || 0,
            price: body.price || '',
            status: 'New',
        };

        const { error } = await supabase
            .from('orders')
            .insert([newOrder]);

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }

        return NextResponse.json({ success: true, orderId: newOrder.id });
    } catch (error) {
        console.error('Error saving order:', error);
        return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
    }
}
