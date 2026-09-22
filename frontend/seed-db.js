require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Project, Invoice } = require('./netlify/functions/lib/models');

const MONGODB_URI = process.env.REACT_APP_MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Invoice.deleteMany({});

    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('Admin@123!Test', 10);
    const admin = await User.create({
      email: 'admin@appont.dev',
      password: adminPassword,
      company: 'Appont',
      role: 'admin'
    });

    console.log('👤 Creating client user...');
    const clientPassword = await bcrypt.hash('Client@123!Test', 10);
    const client = await User.create({
      email: 'client@example.com',
      password: clientPassword,
      company: 'Sample Corp',
      role: 'client'
    });

    console.log('📦 Creating sample project...');
    const project = await Project.create({
      user_id: client._id,
      name: 'E-Commerce Website',
      description: 'Full-stack e-commerce platform rebuild',
      status: 'in-progress',
      cost: 5000,
      timeline: '3 months',
      team: ['John Smith', 'Sarah Johnson']
    });

    console.log('💰 Creating sample invoice...');
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    await Invoice.create({
      project_id: project._id,
      amount: 2500,
      issue_date: new Date(),
      due_date: dueDate,
      status: 'pending'
    });

    console.log('✅ Seed complete!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin:  admin@appont.dev / Admin@123!Test');
    console.log('Client: client@example.com / Client@123!Test');
    
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
