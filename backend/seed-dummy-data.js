require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mhamadnasridine_db_user:9tvbzy8P0Jj7t9jV@cluster0.ooxqak8.mongodb.net/aipont?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: Boolean,
  phone: String,
  company: String,
  companyLogo: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const dummyUsers = [
  {
    name: 'Admin User',
    email: 'admin@appont.dev',
    password: 'admin123',
    isAdmin: true,
    phone: '+1-555-0001',
    company: 'appont'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@techstart.com',
    password: 'password123',
    isAdmin: false,
    phone: '+1-555-0101',
    company: 'TechStart'
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus@cloudflow.io',
    password: 'password123',
    isAdmin: false,
    phone: '+1-555-0102',
    company: 'CloudFlow'
  },
  {
    name: 'Elena Rodriguez',
    email: 'elena@buildco.com',
    password: 'password123',
    isAdmin: false,
    phone: '+1-555-0103',
    company: 'BuildCo'
  }
];

async function seedDatabase() {
  try {
    console.log('\n🌱 Starting Database Seed...\n');

    const hashedUsers = await Promise.all(
      dummyUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    const savedUsers = await User.insertMany(hashedUsers, { ordered: false });
    console.log(`✅ Created ${savedUsers.length} users:`);
    savedUsers.forEach(user => {
      console.log(`   - ${user.email} ${user.isAdmin ? '(ADMIN)' : '(CLIENT)'}`);
    });

    console.log('\n🔐 LOGIN CREDENTIALS\n');
    console.log('ADMIN USER:');
    console.log(`  Email: admin@appont.dev`);
    console.log(`  Password: admin123`);
    console.log(`  Check "I'm a Developer" when logging in\n`);

    console.log('TEST CLIENTS:');
    dummyUsers.slice(1).forEach(user => {
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Company: ${user.company}\n`);
    });

    console.log('✨ Database seed completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    if (error.code === 11000) {
      console.log('\n⚠️  Some users already exist.');
    }
    mongoose.connection.close();
    process.exit(1);
  }
}

seedDatabase();
