import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── MongoDB Connection ───
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/herb-blockchain';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected:', MONGO_URI))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ─── Schemas ───
const herbSchema = new mongoose.Schema({
  herbId: String,
  name: String,
  scientificName: String,
  region: String,
  farmer: String,
  farmerAddress: String,
  harvestDate: String,
  rfidTag: String,
  nfcTag: String,
  quality: String,
  quantity: String,
  aiAuthenticated: Boolean,
  tokenReward: Number,
  certifications: [String],
  createdAt: { type: Date, default: Date.now }
});

const smartContractSchema = new mongoose.Schema({
  contractName: String,
  contractType: String,
  txHash: String,
  blockNumber: Number,
  gasUsed: String,
  rfidTag: String,
  nfcTag: String,
  code: String,
  status: { type: String, default: 'Deployed' },
  createdAt: { type: Date, default: Date.now }
});

const aiAnalysisSchema = new mongoose.Schema({
  species: String,
  scientificName: String,
  confidence: Number,
  quality: String,
  authentic: Boolean,
  description: String,
  medicinalUses: [String],
  activeCompounds: [String],
  timestamp: { type: Date, default: Date.now }
});

const walletSchema = new mongoose.Schema({
  address: String,
  ahtBalance: Number,
  ethBalance: String,
  farmerName: String,
  lastLogin: { type: Date, default: Date.now }
});

const Herb = mongoose.model('Herb', herbSchema);
const SmartContract = mongoose.model('SmartContract', smartContractSchema);
const AIAnalysis = mongoose.model('AIAnalysis', aiAnalysisSchema);
const Wallet = mongoose.model('Wallet', walletSchema);

// ─── AI Herb Analysis Endpoint ───
const herbKnowledge = [
  { name: 'Ashwagandha', scientific: 'Withania somnifera', quality: 'Premium A+', medicinalUses: ['Stress relief', 'Immunity booster', 'Anti-inflammatory', 'Energy enhancer'], activeCompounds: ['Withanolides', 'Withaferin A', 'Withanone'], description: 'Ashwagandha is a powerful adaptogen used in Ayurveda for over 3000 years. It helps reduce cortisol levels and supports the immune system.' },
  { name: 'Brahmi', scientific: 'Bacopa monnieri', quality: 'Grade A', medicinalUses: ['Memory enhancement', 'Anxiety reduction', 'Neuroprotective', 'Antioxidant'], activeCompounds: ['Bacosides A & B', 'Bacopasaponins', 'Brahmine'], description: 'Brahmi is celebrated in Ayurveda as a brain tonic. It enhances cognitive function and helps manage anxiety disorders.' },
  { name: 'Tulsi', scientific: 'Ocimum tenuiflorum', quality: 'Premium', medicinalUses: ['Respiratory health', 'Stress reduction', 'Anti-microbial', 'Blood sugar regulation'], activeCompounds: ['Eugenol', 'Ursolic acid', 'Rosmarinic acid', 'Linalool'], description: 'Tulsi (Holy Basil) is revered as the "Queen of Herbs" in Ayurveda. It has potent antimicrobial and adaptogenic properties.' },
  { name: 'Turmeric', scientific: 'Curcuma longa', quality: 'Grade A+', medicinalUses: ['Anti-inflammatory', 'Antioxidant', 'Joint health', 'Digestive aid'], activeCompounds: ['Curcumin', 'Demethoxycurcumin', 'Turmerone', 'Ar-turmerone'], description: 'Turmeric contains curcumin, one of the most powerful anti-inflammatory compounds found in nature. Used in Ayurveda for millennia.' },
  { name: 'Shatavari', scientific: 'Asparagus racemosus', quality: 'Premium', medicinalUses: ['Hormonal balance', 'Digestive health', 'Immunity booster', 'Galactagogue'], activeCompounds: ['Saponins (Shatavarins)', 'Isoflavones', 'Asparagamine'], description: 'Shatavari is the primary Ayurvedic herb for female reproductive health. It nourishes and tonifies the reproductive organs.' },
  { name: 'Giloy', scientific: 'Tinospora cordifolia', quality: 'Grade A', medicinalUses: ['Immunity booster', 'Fever management', 'Detoxification', 'Anti-diabetic'], activeCompounds: ['Berberine', 'Tinosporin', 'Columbin', 'Giloin'], description: 'Giloy (Guduchi) is known as "Amrita" - the root of immortality in Ayurveda. It is a potent immunomodulator and detoxifier.' },
  { name: 'Neem', scientific: 'Azadirachta indica', quality: 'Grade A', medicinalUses: ['Skin health', 'Blood purification', 'Anti-bacterial', 'Dental health'], activeCompounds: ['Azadirachtin', 'Nimbin', 'Nimbidin', 'Quercetin'], description: 'Neem is called the "Village Pharmacy" in India. Every part of the neem tree has medicinal value in Ayurvedic tradition.' },
  { name: 'Amla', scientific: 'Phyllanthus emblica', quality: 'Premium+', medicinalUses: ['Vitamin C source', 'Hair health', 'Digestive aid', 'Anti-aging'], activeCompounds: ['Gallic acid', 'Ellagic acid', 'Vitamin C', 'Emblicanin A & B'], description: 'Amla (Indian Gooseberry) is one of the richest natural sources of Vitamin C. It is a key ingredient in the Ayurvedic preparation Triphala.' },
];

app.post('/api/ai/analyze', async (req, res) => {
  try {
    // Simulate AI analysis with detailed response
    const herb = herbKnowledge[Math.floor(Math.random() * herbKnowledge.length)];
    const isAuthentic = Math.random() > 0.12;
    const confidence = isAuthentic ? (88 + Math.random() * 11).toFixed(1) : (30 + Math.random() * 25).toFixed(1);

    const analysis = {
      species: herb.name,
      scientificName: herb.scientific,
      confidence: parseFloat(confidence),
      quality: herb.quality,
      authentic: isAuthentic,
      description: herb.description,
      medicinalUses: herb.medicinalUses,
      activeCompounds: herb.activeCompounds,
      analysisModel: 'HerbNet AI v3.2 (Claude Vision Compatible)',
      timestamp: new Date().toISOString(),
    };

    // Save to MongoDB
    await AIAnalysis.create(analysis);

    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Smart Contracts CRUD ───
app.post('/api/contracts', async (req, res) => {
  try {
    const contract = await SmartContract.create(req.body);
    res.json({ success: true, contract });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/contracts', async (req, res) => {
  try {
    const contracts = await SmartContract.find().sort({ createdAt: -1 });
    res.json({ success: true, contracts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Herbs CRUD ───
app.post('/api/herbs', async (req, res) => {
  try {
    const herb = await Herb.create(req.body);
    res.json({ success: true, herb });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/herbs', async (req, res) => {
  try {
    const herbs = await Herb.find().sort({ createdAt: -1 });
    res.json({ success: true, herbs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Wallet ───
app.post('/api/wallet/login', async (req, res) => {
  try {
    const { address } = req.body;
    let wallet = await Wallet.findOne({ address });
    if (!wallet) {
      wallet = await Wallet.create({ address, ahtBalance: (Math.random() * 5000 + 500).toFixed(2), ethBalance: '0.0000' });
    }
    wallet.lastLogin = new Date();
    await wallet.save();
    res.json({ success: true, wallet });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── AI Analysis History ───
app.get('/api/ai/history', async (req, res) => {
  try {
    const history = await AIAnalysis.find().sort({ timestamp: -1 }).limit(20);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Herb-Blockchain API Server running on http://localhost:${PORT}`);
    console.log(`📦 MongoDB URI: ${MONGO_URI}`);
  });
}

export default app;
