import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
    private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
    private readonly chatId = process.env.TELEGRAM_CHAT_ID;
    private readonly apiUrl = 'https://api.telegram.org';

    async sendMessage(text: string): Promise<boolean> {
        if (!this.botToken || !this.chatId) {
            console.warn('Telegram credentials not configured');
            return false;
        }

        try {
            const response = await fetch(
                `${this.apiUrl}/bot${this.botToken}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: this.chatId,
                        text,
                        parse_mode: 'HTML',
                    }),
                }
            );

            const data = await response.json();
            return data.ok;
        } catch (error) {
            console.error('Telegram xabar yuborishda xato:', error);
            return false;
        }
    }

    formatBlogNotification(blog: any): string {
        return `📝 <b>Yangi Blog Qo'shildi!</b>

<b>Sarlavha:</b> ${blog.title}
<b>Mazmun:</b> ${blog.content.substring(0, 100)}...
<b>Yaratilgan:</b> ${new Date(blog.createdAt).toLocaleString('uz-UZ')}`;
    }

    formatEmployeeNotification(employee: any): string {
        return `👤 <b>Yangi Xodim Qo'shildi!</b>

<b>Ism:</b> ${employee.fullName}
<b>Lavozim:</b> ${employee.position}
<b>Yaratilgan:</b> ${new Date(employee.createdAt).toLocaleString('uz-UZ')}`;
    }
}
