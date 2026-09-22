const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: String,
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  created: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  status: { type: String, enum: ['planning', 'in-progress', 'completed', 'paused'], default: 'planning' },
  cost: Number,
  timeline: String,
  team: [String],
  created: { type: Date, default: Date.now }
});

const invoiceSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  amount: Number,
  issue_date: Date,
  due_date: Date,
  paid_date: Date,
  status: { type: String, enum: ['pending', 'sent', 'paid', 'overdue'], default: 'pending' },
  created: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = { User, Project, Invoice };
