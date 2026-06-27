const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, email, phone, message } = req.body;

  // Validate basic fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create transporter
  // IMPORTANT: For Gmail, use an "App Password" (GMAIL_APP_PASSWORD)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'rrlabsolutions@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER || 'rrlabsolutions@gmail.com',
    to: 'rrlabsolutions@gmail.com',
    subject: `New Inquiry from ${name} (${company || 'N/A'})`,
    text: `
      You have received a new inquiry from RR Lab Solutions website:

      Name: ${name}
      Company: ${company || 'N/A'}
      Email: ${email}
      Phone: ${phone || 'N/A'}

      Message:
      ${message}
    `,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}
