// controllers/contactController.js
const Contact      = require('../models/Contact');
const nodemailer   = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// POST /api/contact  (public)
exports.send = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to database
    const contact = await Contact.create({ name, email, subject, message });

    // Send email notification to admin
    try {
      await transporter.sendMail({
        from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to:      process.env.ADMIN_EMAIL,
        subject: `New message: ${subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      });

      // Auto-reply to sender
      await transporter.sendMail({
        from:    `"Your Name" <${process.env.EMAIL_USER}>`,
        to:      email,
        subject: `Thanks for reaching out, ${name}!`,
        html: `
          <h2>Hi ${name},</h2>
          <p>Thanks for your message. I'll get back to you as soon as possible!</p>
          <p><strong>Your message:</strong> ${subject}</p>
          <br><p>Best regards,<br>Your Name</p>
        `
      });
    } catch (emailErr) {
      console.warn('Email send failed (contact saved):', emailErr.message);
    }

    res.status(201).json({ message: 'Message sent successfully!', contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/contact  (admin)
exports.getAll = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// PATCH /api/contact/:id/read  (admin)
exports.markRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id, { read: true }, { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Message not found' });
    res.json({ contact });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// DELETE /api/contact/:id  (admin)
exports.remove = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
