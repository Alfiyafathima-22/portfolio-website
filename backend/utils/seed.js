// utils/seed.js — Run once to create admin and sample data
// Usage: node utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');
const Project  = require('../models/Project');
const Certification = require('../models/Certification');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([User.deleteMany(), Project.deleteMany(), Certification.deleteMany()]);

  // Create admin user (change password before deploying!)
  await User.create({
    name:     'Admin',
    email:    'admin@portfolio.com',
    password: 'Admin@1234',
    role:     'admin'
  });
  console.log('✅ Admin created: admin@portfolio.com / Admin@1234');

  // Sample projects
  await Project.insertMany([
    {
      title:        'E-Commerce Platform',
      description:  'Full-stack e-commerce app with React, Node.js, and MongoDB. Features cart, payments, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
      githubLink:   'https://github.com/yourusername/ecommerce',
      liveLink:     'https://ecommerce-demo.vercel.app',
      category:     'web',
      featured:     true
    },
    {
      title:        'AI Chat Application',
      description:  'Real-time chat app with OpenAI integration, socket.io, and JWT authentication.',
      technologies: ['React', 'Node.js', 'Socket.io', 'OpenAI API'],
      githubLink:   'https://github.com/yourusername/ai-chat',
      liveLink:     '',
      category:     'web',
      featured:     true
    },
    {
      title:        'Data Visualization Dashboard',
      description:  'Interactive analytics dashboard using Python Flask, Chart.js and pandas for data processing.',
      technologies: ['Python', 'Flask', 'Chart.js', 'pandas'],
      githubLink:   'https://github.com/yourusername/dashboard',
      liveLink:     '',
      category:     'ml',
      featured:     false
    }
  ]);
  console.log('✅ Sample projects created');

  // Sample certifications
  await Certification.insertMany([
    {
      title:        'AWS Cloud Practitioner',
      organization: 'Amazon Web Services',
      date:         new Date('2024-01-15')
    },
    {
      title:        'Meta Front-End Developer',
      organization: 'Meta / Coursera',
      date:         new Date('2023-09-01')
    }
  ]);
  console.log('✅ Sample certifications created');

  await mongoose.disconnect();
  console.log('✅ Seed complete!');
}

seed().catch(err => { console.error(err); process.exit(1); });
