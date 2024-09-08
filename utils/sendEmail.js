import { Resend } from "resend";
const sendEmail = async (subject, content, to) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [to],
    subject: subject,
    html: `<p>${content}</p>`,
  });
};
export { sendEmail };
