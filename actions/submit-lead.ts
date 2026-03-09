'use server'

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function submitLead(formData: FormData) {
  // 1. Собираем данные
  const payload = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    messenger: formData.get('messenger') as string,
    calories: formData.get('calories') as string,
    lang: formData.get('lang') as string || 'pl',
    date: new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
  };

  // 2. Валидация
  if (!payload.name || !payload.phone) {
    return { success: false, message: 'Missing fields' }
  }

  if (!WEBHOOK_URL) {
    console.error('WEBHOOK_URL is not defined');
    return { success: false, message: 'Server config error' }
  }

  try {
    // 3. Отправляем на твой Webhook (Make/Zapier)
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Webhook Error: ${res.status}`);
    }

    return { success: true }
    
  } catch (error) {
    console.error('Submission Error:', error)
    return { success: false, message: 'Failed to send' }
  }
}