import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.email,
        pass: process.env.passwordForEmail,
    },
});
export async function main(receiverEmail, confirmationToken) {
   try {
     const info = await transporter.sendMail({
         from: `WebX <${process.env.email}>`,
         to: receiverEmail,
         subject: "WebX-Confirm Email ✔",
         html: `
             <p>Hello,</p>
             <p>Thank you for signing up with WebX. Please click the button below to confirm your email:</p>
             <p><a href="http://localhost:3000/api/v1/user/confirm-email?token=${confirmationToken}" style="background-color: #008CBA; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px;">Confirm Email</a></p>
             <p>If the button doesn't work, you can copy and paste the following link into your browser's address bar:</p>
             <p>http://localhost:3000/api/v1/user/confirm-email?token=${confirmationToken}</p>
             <p>Best regards,<br/>WebX Team</p>
         `,
     });
     console.log(`Email sent: ${info.response}`);
   } catch (error) {
       console.error(`Error sending email: ${error.message}`);

   }

}
export async function forgetEmail(receiverEmail, otpCode, otpExpire) {
    try {
        const info = await transporter.sendMail({
            from: `WebX <${process.env.EMAIL}>`,
            to: receiverEmail,
            subject: "WebX - Password Reset ✔",
            html: `
        <p>Hello,</p>
        <p>Here is your OTP code: <strong>${otpCode}</strong></p>
        <p>This OTP code will expire after: <strong>${otpExpire}</strong></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,<br/>WebX Team</p>
      `,
        });
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
}