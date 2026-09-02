const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
const cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ============ MONGOOSE SETUP ============
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://mhamadnasridine_db_user:9tvbzy8P0Jj7t9jV@cluster0.ooxqak8.mongodb.net/aipont?retryWrites=true&w=majority';
mongoose.connect(mongoUri).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB Error:', err));

// ============ SCHEMA & MODELS ============
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  isRestricted: { type: Boolean, default: false },
  companyName: String,
  companyAddress: String,
  companyEmail: String,
  companyPhone: String,
  companyLogo: String,
});

const User = mongoose.model('User', userSchema);

const projectSchema = new mongoose.Schema({
  projectNumber: String,
  projectTitle: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientName: String,
  clientEmail: String,
  clientRequirements: String,
  status: { type: String, default: 'requirements_submitted' },
  solutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Solution' },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);

const solutionSchema = new mongoose.Schema({
  overview: String,
  platformRecommendation: { platform: String, reasoning: String },
  totalEstimatedCost: Number,
  timeline: String,
  features: [String],
  createdAt: { type: Date, default: Date.now },
});

const Solution = mongoose.model('Solution', solutionSchema);

const proposalSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  totalCost: Number,
  paymentTerms: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Proposal = mongoose.model('Proposal', proposalSchema);

const invoiceSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  totalAmount: Number,
  dueDate: Date,
  paymentLink: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// ============ MIDDLEWARE ============
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret-key-change-in-production');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ AUTH ENDPOINTS ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'client'
    });
    await user.save();
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'test-secret-key-change-in-production');
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'test-secret-key-change-in-production');
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ PROJECT ENDPOINTS ============
app.post('/api/projects/create-from-requirements', async (req, res) => {
  try {
    const { projectTitle, requirements, clientName, clientEmail } = req.body;
    const projectNumber = 'PROJ-' + Date.now();
    const project = new Project({
      projectNumber,
      projectTitle,
      clientName: clientName || 'Anonymous',
      clientEmail: clientEmail || 'noemail@appont.dev',
      clientRequirements: requirements,
      status: 'requirements_submitted'
    });
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find().populate('solutionId').populate('proposalId').populate('invoiceId');
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('solutionId').populate('proposalId').populate('invoiceId');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/projects/:projectId/conversation', verifyToken, async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/projects/:projectId/chat', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }]
    });
    
    res.json({ message: response.content[0].text });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/projects/:projectId/generate-solution', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Based on these requirements: ${project.clientRequirements}\n\nProvide a solution with: overview, platform recommendation, estimated cost (number), and timeline.`
      }]
    });
    
    const solution = new Solution({
      overview: response.content[0].text,
      platformRecommendation: { platform: 'Custom', reasoning: 'Based on requirements' },
      totalEstimatedCost: 15000,
      timeline: '8-12 weeks'
    });
    
    await solution.save();
    project.solutionId = solution._id;
    project.status = 'solution_generated';
    await project.save();
    
    await project.populate('solutionId');
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/projects/:projectId/approve-solution', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    project.status = 'solution_approved';
    await project.save();
    await project.populate(['solutionId', 'proposalId', 'invoiceId']);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/projects/:projectId/generate-proposal', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const proposal = new Proposal({
      projectId: project._id,
      totalCost: 15000,
      paymentTerms: '50% upfront, 50% on completion',
      content: 'Professional proposal for ' + project.projectTitle
    });
    
    await proposal.save();
    project.proposalId = proposal._id;
    project.status = 'proposal_generated';
    await project.save();
    
    await project.populate(['solutionId', 'proposalId', 'invoiceId']);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/projects/:projectId/approve-proposal', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    project.status = 'proposal_approved';
    await project.save();
    await project.populate(['solutionId', 'proposalId', 'invoiceId']);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/proposals/:id/send-to-client', verifyToken, async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/proposals/:id/approve', verifyToken, async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/proposals/:proposalId/generate-invoice', verifyToken, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    
    const invoice = new Invoice({
      projectId: proposal.projectId,
      proposalId: proposal._id,
      totalAmount: proposal.totalCost,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'pending'
    });
    
    await invoice.save();
    const project = await Project.findById(proposal.projectId);
    project.invoiceId = invoice._id;
    project.status = 'invoice_generated';
    await project.save();
    
    await project.populate(['solutionId', 'proposalId', 'invoiceId']);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/invoices/:id', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/invoices/:id/approve-and-send', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    
    invoice.status = 'paid';
    await invoice.save();
    
    const project = await Project.findById(invoice.projectId);
    project.status = 'paid';
    await project.save();
    
    await project.populate(['solutionId', 'proposalId', 'invoiceId']);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/invoices/:id/record-payment', verifyToken, async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/projects/:id/start-development', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    project.status = 'in_development';
    await project.save();
    await project.populate(['solutionId', 'proposalId', 'invoiceId']);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
