import nodemailer from 'nodemailer'

// تم تعديل الدالة لتصبح أكثر عمومية وتستقبل البيانات من الكنترولر
export const sendEmail = async (emailOptions) => {
    const myEmail = "ykhalaf081@gmail.com"
    // lightweight log to verify nodemailer path and trigger redeploy
    console.log("[email] Initializing nodemailer transporter")
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: myEmail,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // لم يعد يتم إنشاء التوكن هنا
    const info = await transporter.sendMail({
        from: `"Hacker 😆" <${myEmail}>`,
        to: emailOptions.email, // يتم تمرير الإيميل من الـ object
        subject: emailOptions.subject, // يتم تمرير الموضوع من الـ object
        html: emailOptions.html // يتم تمرير محتوى الرسالة من الـ object
    })
    console.log("Message sent: %s", info.messageId)
}