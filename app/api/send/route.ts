import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { firstName, email, paymentAmount } = await req.json();

        const { data, error } = await resend.emails.send({
            from: 'CEMI <kids@cemi-antwerp.be>',
            to: [email],
            cc: [],
            subject: 'Bevestiging van je inschrijving',
            react: EmailTemplate({ firstName, paymentAmount }),
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
