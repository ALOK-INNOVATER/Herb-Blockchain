import React, { useState, useEffect } from 'react';
import { 
  Leaf, Shield, Cpu, Radio, Database, Users, Coins, MapPin, 
  QrCode, Eye, CheckCircle, AlertTriangle, Clock, Award,
  TrendingUp, Globe, Smartphone, Camera, Zap, Star, Activity,
  Package, Truck, Factory, Store, ChevronRight, Brain, Wifi
} from 'lucide-react';

const AyurvedicBlockchainSystem = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [animatedSection, setAnimatedSection] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ role: 'farmer', name: '', wallet: '' });
  const [customFarmers, setCustomFarmers] = useState([]);
  const [farmerForm, setFarmerForm] = useState({ id: '', name: '', region: '', wallet: '', points: 0, totalTokens: 0, badges: '' });

  // Smart Contract Components
  const smartContractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AyurvedicHerbTraceability {
    struct Herb {
        string herbId;
        string name;
        string scientificName;
        string cultivationRegion;
        address farmer;
        uint256 harvestTimestamp;
        string qualityGrade;
        uint256 quantity;
        bool isAuthenticated;
        string[] certifications;
    }
    
    struct SupplyChainEvent {
        uint256 timestamp;
        address actor;
        string stage;
        string location;
        string description;
        bytes32 rfidTag;
    }
    
    mapping(string => Herb) public herbs;
    mapping(string => SupplyChainEvent[]) public supplyChain;
    mapping(address => uint256) public farmerTokens;
    mapping(string => bool) public approvedRegions;
    
    event HerbRegistered(string indexed herbId, address indexed farmer);
    event SupplyChainUpdated(string indexed herbId, string stage);
    event TokensAwarded(address indexed farmer, uint256 amount);
    event QualityVerified(string indexed herbId, bool authentic);
}`;

  // Ministry of AYUSH Approved Regions
  const approvedRegions = [
    {
      id: 1,
      name: "Kerala Backwaters",
      state: "Kerala",
      district: "Alappuzha, Kottayam",
      coordinates: [9.4981, 76.3388],
      approvedHerbs: ["Brahmi", "Ashwagandha", "Turmeric", "Cardamom", "Black Pepper"],
      certificationLevel: "Grade A+",
      soilType: "Alluvial",
      climate: "Tropical",
      totalArea: "2,500 hectares"
    },
    {
      id: 2,
      name: "Uttarakhand Himalayas",
      state: "Uttarakhand",
      district: "Chamoli, Pithoragarh",
      coordinates: [30.0668, 79.0193],
      approvedHerbs: ["Brahmi", "Jatamansi", "Kutki", "Shankhpushpi", "Giloy"],
      certificationLevel: "Premium",
      soilType: "Mountain soil",
      climate: "Temperate",
      totalArea: "3,200 hectares"
    },
    {
      id: 3,
      name: "Karnataka Western Ghats",
      state: "Karnataka",
      district: "Kodagu, Chikkamagaluru",
      coordinates: [12.9716, 77.5946],
      approvedHerbs: ["Ashwagandha", "Shatavari", "Turmeric", "Bala", "Vidari"],
      certificationLevel: "Grade A",
      soilType: "Red laterite",
      climate: "Tropical monsoon",
      totalArea: "1,800 hectares"
    },
    {
      id: 4,
      name: "Madhya Pradesh Forests",
      state: "Madhya Pradesh", 
      district: "Betul, Chhindwara",
      coordinates: [22.9734, 78.6569],
      approvedHerbs: ["Safed Musli", "Kalmegh", "Giloy", "Ashwagandha", "Arjun"],
      certificationLevel: "Grade A",
      soilType: "Black cotton",
      climate: "Dry deciduous",
      totalArea: "4,100 hectares"
    },
    {
      id: 5,
      name: "Himachal Pradesh Hills",
      state: "Himachal Pradesh",
      district: "Kullu, Shimla",
      coordinates: [31.1048, 77.1734],
      approvedHerbs: ["Jatamansi", "Kutki", "Brahmi", "Shankhpushpi", "Saraswatarishta"],
      certificationLevel: "Premium+",
      soilType: "Alpine",
      climate: "Alpine temperate",
      totalArea: "2,900 hectares"
    },
    {
      id: 6,
      name: "Tamil Nadu Nilgiris",
      state: "Tamil Nadu",
      district: "Nilgiris, Coimbatore",
      coordinates: [11.4064, 76.6932],
      approvedHerbs: ["Brahmi", "Mandukaparni", "Tulsi", "Lemongrass", "Patchouli"],
      certificationLevel: "Grade A",
      soilType: "Hill soil",
      climate: "Tropical highland",
      totalArea: "1,600 hectares"
    },
    {
      id: 7,
      name: "Rajasthan Aravalli",
      state: "Rajasthan",
      district: "Udaipur, Mount Abu",
      coordinates: [24.5854, 73.7125],
      approvedHerbs: ["Safed Musli", "Chitrak", "Shatavari", "Guggul", "Commiphora"],
      certificationLevel: "Grade A",
      soilType: "Sandy loam",
      climate: "Semi-arid",
      totalArea: "2,200 hectares"
    },
    {
      id: 8,
      name: "Odisha Coastal Plains",
      state: "Odisha",
      district: "Ganjam, Khurda",
      coordinates: [20.9517, 85.0985],
      approvedHerbs: ["Kalmegh", "Bhringaraj", "Punarnava", "Guduchi", "Nimba"],
      certificationLevel: "Grade A",
      soilType: "Coastal alluvium",
      climate: "Tropical coastal",
      totalArea: "1,900 hectares"
    }
  ];

  // Core System Components
  const systemComponents = [
    {
      id: 'blockchain',
      name: 'Blockchain Core',
      icon: Database,
      color: 'blue',
      description: 'Immutable ledger for herb traceability',
      features: ['Smart Contracts', 'Transaction History', 'Consensus Mechanism', 'Data Integrity'],
      status: 'Active'
    },
    {
      id: 'ai-auth',
      name: 'AI Authentication',
      icon: Brain,
      color: 'purple',
      description: 'Machine learning powered herb verification',
      features: ['Image Recognition', 'Chemical Analysis', 'Fraud Detection', 'Quality Assessment'],
      status: 'Active'
    },
    {
      id: 'rfid-nfc',
      name: 'RFID/NFC Tracking',
      icon: Radio,
      color: 'green',
      description: 'Physical tagging and real-time tracking',
      features: ['RFID Tags', 'NFC Integration', 'GPS Tracking', 'Temperature Monitoring'],
      status: 'Active'
    },
    {
      id: 'storage',
      name: 'Decentralized Storage',
      icon: Globe,
      color: 'orange',
      description: 'Distributed data storage across nodes',
      features: ['IPFS Integration', 'Data Redundancy', 'Encrypted Storage', 'Access Control'],
      status: 'Active'
    },
    {
      id: 'transparency',
      name: 'Consumer Transparency',
      icon: Eye,
      color: 'teal',
      description: 'Real-time supply chain visibility',
      features: ['QR Code Scanning', 'Mobile App', 'Web Portal', 'Alert System'],
      status: 'Active'
    },
    {
      id: 'tokens',
      name: 'Token Incentives',
      icon: Coins,
      color: 'yellow',
      description: 'Blockchain-based reward system',
      features: ['Farmer Rewards', 'Quality Bonuses', 'Staking Mechanism', 'Fair Trade Premium'],
      status: 'Active'
    }
  ];

  // Sample herb data with enhanced details
  const sampleHerbs = [
    {
      id: "ASH-KAR-001",
      name: "Ashwagandha",
      scientificName: "Withania somnifera",
      region: "Karnataka Western Ghats",
      farmer: "Ravi Kumar",
      farmerAddress: "0x742d35Cc6634C0532925a3b8D4C7C5E5E02b",
      harvestDate: "2024-08-15",
      rfidTag: "RFID-ASH-001",
      nfcTag: "NFC-ASH-001",
      quality: "Premium A+",
      quantity: "500 kg",
      aiAuthenticated: true,
      blockchainHash: "0x7f9a2b4c8e1d3f2a5b7c9d0e4f6a8b1c3d5e7f9a",
      tokenReward: 150,
      certifications: ["Organic", "GAP Certified", "AYUSH Approved"],
      supplyChainStages: [
        { stage: "Cultivation", completed: true, timestamp: "2024-07-01" },
        { stage: "Harvesting", completed: true, timestamp: "2024-08-15" },
        { stage: "Processing", completed: true, timestamp: "2024-08-20" },
        { stage: "Quality Testing", completed: true, timestamp: "2024-08-25" },
        { stage: "Transportation", completed: false, timestamp: null },
        { stage: "Manufacturing", completed: false, timestamp: null },
        { stage: "Distribution", completed: false, timestamp: null }
      ]
    },
    {
      id: "BRA-KER-002",
      name: "Brahmi",
      scientificName: "Bacopa monnieri",
      region: "Kerala Backwaters",
      farmer: "Lakshmi Nair",
      farmerAddress: "0x8e2f46B9d3a5C7f1E8b4A6c9D2e5F8b1C4d7E0a3",
      harvestDate: "2024-08-20",
      rfidTag: "RFID-BRA-002",
      nfcTag: "NFC-BRA-002",
      quality: "Premium",
      quantity: "300 kg",
      aiAuthenticated: true,
      blockchainHash: "0x3a7c5b9e2f1d8a4b6c0e7f2a5b8c1d4e7f0a3b6c",
      tokenReward: 120,
      certifications: ["Organic", "Fair Trade", "AYUSH Approved"],
      supplyChainStages: [
        { stage: "Cultivation", completed: true, timestamp: "2024-06-15" },
        { stage: "Harvesting", completed: true, timestamp: "2024-08-20" },
        { stage: "Processing", completed: true, timestamp: "2024-08-22" },
        { stage: "Quality Testing", completed: false, timestamp: null },
        { stage: "Transportation", completed: false, timestamp: null },
        { stage: "Manufacturing", completed: false, timestamp: null },
        { stage: "Distribution", completed: false, timestamp: null }
      ]
    }
  ];

  // Sample farmers for recognition/leaderboard
  const sampleFarmers = [
    {
      id: 'F-001',
      name: 'Ravi Kumar',
      region: 'Karnataka Western Ghats',
      wallet: '0x742d35Cc6634C0532925a3b8D4C7C5E5E02b',
      points: 1580,
      totalTokens: 1120,
      badges: ['Premium+ Quality', 'Organic Certified', 'On-time Delivery']
    },
    {
      id: 'F-002',
      name: 'Lakshmi Nair',
      region: 'Kerala Backwaters',
      wallet: '0x8e2f46B9d3a5C7f1E8b4A6c9D2e5F8b1C4d7E0a3',
      points: 1460,
      totalTokens: 980,
      badges: ['Fair Trade', 'AYUSH Approved']
    },
    {
      id: 'F-003',
      name: 'Suresh Patel',
      region: 'Madhya Pradesh Forests',
      wallet: '0x9c1e7A11a2b4cC3dD4e5F6a7B8c9D0e1F2a3B4c5',
      points: 1210,
      totalTokens: 760,
      badges: ['Sustainable Farming', 'Innovation Bonus']
    },
    {
      id: 'F-004',
      name: 'Anita Sharma',
      region: 'Himachal Pradesh Hills',
      wallet: '0xA1b2C3d4E5f67890aBcDeF1234567890aBCdEf12',
      points: 1325,
      totalTokens: 840,
      badges: ['Premium Quality', 'Cold Chain Maintainer']
    },
    {
      id: 'F-005',
      name: 'Mahesh Yadav',
      region: 'Rajasthan Aravalli',
      wallet: '0xB2c3D4e5F6a7b8C9d0E1F2a3B4c5D6e7F8091a2B',
      points: 990,
      totalTokens: 540,
      badges: ['Community Mentor']
    }
  ];

  const findFarmer = (user) => {
    if (!user) return null;
    return (
      combinedFarmers().find((f) => (f.wallet || '').toLowerCase() === (user.wallet || '').toLowerCase()) ||
      combinedFarmers().find((f) => (f.name || '').toLowerCase() === (user.name || '').toLowerCase()) ||
      null
    );
  };

  const myBadges = (user) => {
    const f = findFarmer(user);
    return f ? f.badges : [];
  };

  const myPoints = (user) => {
    const f = findFarmer(user);
    return f ? f.points : 0;
  };

  const myTokens = (user) => {
    const f = findFarmer(user);
    return f ? f.totalTokens : 0;
  };

  const combinedFarmers = () => {
    const map = new Map();
    [...sampleFarmers, ...customFarmers].forEach((f) => {
      const key = ((f.wallet && f.wallet.toLowerCase()) || (f.id && f.id.toLowerCase()) || (f.name && f.name.toLowerCase()));
      if (key) map.set(key, f);
    });
    return Array.from(map.values());
  };

  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    const normalized = {
      id: farmerForm.id || `CF-${Date.now()}`,
      name: (farmerForm.name || '').trim(),
      region: (farmerForm.region || '').trim() || 'Unknown Region',
      wallet: (farmerForm.wallet || '').trim(),
      points: Number(farmerForm.points) || 0,
      totalTokens: Number(farmerForm.totalTokens) || 0,
      badges: (farmerForm.badges || '').split(',').map((b) => b.trim()).filter(Boolean)
    };
    if (!normalized.name || !normalized.wallet) return;

    setCustomFarmers((prev) => {
      const next = [...prev];
      const idx = next.findIndex((f) => (f.wallet || '').toLowerCase() === normalized.wallet.toLowerCase());
      if (idx >= 0) {
        next[idx] = { ...next[idx], ...normalized };
      } else {
        next.push(normalized);
      }
      try {
        localStorage.setItem('ayush_custom_farmers', JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    setFarmerForm({ id: '', name: '', region: '', wallet: '', points: 0, totalTokens: 0, badges: '' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedSection((prev) => (prev + 1) % systemComponents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ayush_current_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
      const storedFarmers = localStorage.getItem('ayush_custom_farmers');
      if (storedFarmers) {
        setCustomFarmers(JSON.parse(storedFarmers));
      }
    } catch (_) {
      // ignore
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.name || !loginForm.wallet) return;
    const user = { ...loginForm };
    setCurrentUser(user);
    try {
      localStorage.setItem('ayush_current_user', JSON.stringify(user));
    } catch (_) {
      // ignore
    }
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('ayush_current_user');
    } catch (_) {
      // ignore
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-500 border-blue-500',
      purple: 'bg-purple-500 text-purple-500 border-purple-500',
      green: 'bg-green-500 text-green-500 border-green-500',
      orange: 'bg-orange-500 text-orange-500 border-orange-500',
      teal: 'bg-teal-500 text-teal-500 border-teal-500',
      yellow: 'bg-yellow-500 text-yellow-500 border-yellow-500'
    };
    return colors[color] || colors.blue;
  };

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg transform scale-105' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Ayurvedic Herb Blockchain System
                </h1>
                <p className="text-gray-600">Complete Traceability Solution with AI & Blockchain</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
                <Activity className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-600">System Active</span>
              </div>
              <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600">Blockchain Secured</span>
              </div>
              {!currentUser ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow hover:opacity-90"
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">{currentUser.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton id="overview" label="System Overview" active={activeTab === 'overview'} onClick={setActiveTab} />
          <TabButton id="regions" label="Approved Regions" active={activeTab === 'regions'} onClick={setActiveTab} />
          <TabButton id="blockchain" label="Blockchain Core" active={activeTab === 'blockchain'} onClick={setActiveTab} />
          <TabButton id="ai-auth" label="AI Authentication" active={activeTab === 'ai-auth'} onClick={setActiveTab} />
          <TabButton id="tracking" label="RFID/NFC Tracking" active={activeTab === 'tracking'} onClick={setActiveTab} />
          <TabButton id="supply-chain" label="Supply Chain" active={activeTab === 'supply-chain'} onClick={setActiveTab} />
          <TabButton id="tokens" label="Token System" active={activeTab === 'tokens'} onClick={setActiveTab} />
          <TabButton id="recognition" label="Farmer Recognition" active={activeTab === 'recognition'} onClick={setActiveTab} />
        </div>

        {/* System Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Core Components Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemComponents.map((component, index) => {
                const Icon = component.icon;
                const colorClasses = getColorClasses(component.color);
                const isActive = index === animatedSection;
                
                return (
                  <div
                    key={component.id}
                    className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-500 ${
                      isActive ? 'transform scale-105 border-blue-500 shadow-2xl' : 'border-transparent hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${colorClasses.split(' ')[0]} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 ${colorClasses.split(' ')[1]}`} />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        component.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {component.status}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{component.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{component.description}</p>
                    <div className="space-y-2">
                      {component.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* System Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">System Performance Metrics</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-gray-600">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">15,847</div>
                  <div className="text-gray-600">Herbs Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2,341</div>
                  <div className="text-gray-600">Verified Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">48.2M</div>
                  <div className="text-gray-600">Tokens Distributed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approved Regions Tab */}
        {activeTab === 'regions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-yellow-600" />
                Ministry of AYUSH Approved Cultivation Regions
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {approvedRegions.map((region) => (
                  <div key={region.id} className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-blue-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{region.name}</h3>
                        <p className="text-gray-600">{region.state} - {region.district}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        region.certificationLevel === 'Premium+' ? 'bg-purple-100 text-purple-700' :
                        region.certificationLevel === 'Premium' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {region.certificationLevel}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Soil Type:</span>
                        <p className="text-gray-600">{region.soilType}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Climate:</span>
                        <p className="text-gray-600">{region.climate}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total Area:</span>
                        <p className="text-gray-600">{region.totalArea}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Coordinates:</span>
                        <p className="text-gray-600">{region.coordinates[0]}, {region.coordinates[1]}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700 mb-2 block">Approved Herbs:</span>
                      <div className="flex flex-wrap gap-2">
                        {region.approvedHerbs.map((herb, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {herb}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Core Tab */}
        {activeTab === 'blockchain' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Database className="w-6 h-6 mr-3 text-blue-600" />
                Smart Contract Implementation
              </h2>
              
              <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{smartContractCode}</code>
                </pre>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Blockchain Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-gray-700">Immutable Transaction Records</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-gray-700">Smart Contract Automation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-gray-700">Decentralized Consensus</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-gray-700">Multi-signature Security</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Network Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Block Height:</span>
                    <span className="font-medium">#1,247,583</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transactions/Day:</span>
                    <span className="font-medium">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network Nodes:</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gas Price:</span>
                    <span className="font-medium">0.02 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Authentication Tab */}
        {activeTab === 'ai-auth' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-purple-600" />
                AI-Powered Herb Authentication System
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Computer Vision Analysis
                    </h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Leaf morphology identification</li>
                      <li>• Color and texture analysis</li>
                      <li>• Size and shape verification</li>
                      <li>• Damage assessment</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Spectral Analysis
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Chemical composition verification</li>
                      <li>• Active compound detection</li>
                      <li>• Purity assessment</li>
                      <li>• Adulterant identification</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Authentication Results</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Accuracy Rate:</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '97%'}}></div>
                        </div>
                        <span className="text-sm font-medium">97%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Processing Speed:</span>
                      <span className="font-medium text-blue-600">2.3s avg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Fraud Detection:</span>
                      <span className="font-medium text-green-600">99.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RFID/NFC Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Radio className="w-6 h-6 mr-3 text-green-600" />
                RFID/NFC Tracking System
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Radio className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800">RFID Tags</h3>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Long-range identification</li>
                    <li>• Batch-level tracking</li>
                    <li>• Environmental sensors</li>
                    <li>• Tamper-proof design</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Smartphone className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800">NFC Integration</h3>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Mobile app compatibility</li>
                    <li>• Consumer verification</li>
                    <li>• Instant data access</li>
                    <li>• Secure encryption</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Wifi className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-purple-800">IoT Sensors</h3>
                  </div>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Temperature monitoring</li>
                    <li>• Humidity tracking</li>
                    <li>• Location updates</li>
                    <li>• Real-time alerts</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Sample RFID/NFC Data</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {sampleHerbs.map((herb) => (
                    <div key={herb.id} className="bg-white rounded-lg p-4 shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-800">{herb.name}</h4>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {herb.rfidTag}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {herb.nfcTag}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Region:</span> {herb.region}</p>
                        <p><span className="font-medium">Quality:</span> {herb.quality}</p>
                        <p><span className="font-medium">Quantity:</span> {herb.quantity}</p>
                        <div className="flex items-center mt-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-700 text-xs">AI Authenticated</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supply Chain Tab */}
        {activeTab === 'supply-chain' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Package className="w-6 h-6 mr-3 text-orange-600" />
                Complete Supply Chain Tracking
              </h2>
              
              {/* Herb Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Herb for Tracking:</label>
                <div className="flex flex-wrap gap-3">
                  {sampleHerbs.map((herb) => (
                    <button
                      key={herb.id}
                      onClick={() => setSelectedHerb(herb)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedHerb?.id === herb.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {herb.name} ({herb.id})
                    </button>
                  ))}
                </div>
              </div>

              {/* Supply Chain Visualization */}
              {selectedHerb && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Tracking: {selectedHerb.name}</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><span className="font-medium">Batch ID:</span> {selectedHerb.id}</p>
                        <p><span className="font-medium">Farmer:</span> {selectedHerb.farmer}</p>
                        <p><span className="font-medium">Region:</span> {selectedHerb.region}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Harvest Date:</span> {selectedHerb.harvestDate}</p>
                        <p><span className="font-medium">Quality:</span> {selectedHerb.quality}</p>
                        <p><span className="font-medium">Tokens Earned:</span> {selectedHerb.tokenReward} AHT</p>
                      </div>
                    </div>
                  </div>

                  {selectedHerb.supplyChainStages.map((stage, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        stage.completed
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${
                            stage.completed ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {stage.stage === 'Cultivation' && <Leaf className="w-4 h-4 text-white" />}
                            {stage.stage === 'Harvesting' && <Users className="w-4 h-4 text-white" />}
                            {stage.stage === 'Processing' && <Factory className="w-4 h-4 text-white" />}
                            {stage.stage === 'Quality Testing' && <Shield className="w-4 h-4 text-white" />}
                            {stage.stage === 'Transportation' && <Truck className="w-4 h-4 text-white" />}
                            {stage.stage === 'Manufacturing' && <Package className="w-4 h-4 text-white" />}
                            {stage.stage === 'Distribution' && <Store className="w-4 h-4 text-white" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{stage.stage}</h4>
                            {stage.timestamp && (
                              <p className="text-sm text-gray-600">{stage.timestamp}</p>
                            )}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          stage.completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {stage.completed ? 'Completed' : 'Pending'}
                        </div>
                      </div>
                      {index < selectedHerb.supplyChainStages.length - 1 && (
                        <div className="flex justify-center mt-3">
                          <ChevronRight className={`w-5 h-5 ${
                            stage.completed ? 'text-green-500' : 'text-gray-400'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Token System Tab */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Coins className="w-6 h-6 mr-3 text-yellow-600" />
                Ayurvedic Herb Token (AHT) System
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-4 text-center">
                  <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Total Supply</h3>
                  <p className="text-2xl font-bold text-yellow-600">100M AHT</p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-lg p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Distributed</h3>
                  <p className="text-2xl font-bold text-green-600">48.2M AHT</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Active Farmers</h3>
                  <p className="text-2xl font-bold text-blue-600">2,341</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Avg. Reward</h3>
                  <p className="text-2xl font-bold text-purple-600">125 AHT</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Token Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-700">Quality Farming (60%)</span>
                      <span className="font-medium text-green-600">60M AHT</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700">Sustainable Practices (20%)</span>
                      <span className="font-medium text-blue-600">20M AHT</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-700">Innovation Bonus (10%)</span>
                      <span className="font-medium text-purple-600">10M AHT</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-700">Development Fund (10%)</span>
                      <span className="font-medium text-orange-600">10M AHT</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Reward Mechanisms</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">Base Farming Reward</h4>
                      <p className="text-gray-600">50-100 AHT per kg of certified herbs</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">Quality Bonus</h4>
                      <p className="text-gray-600">+25% for Premium grade, +50% for Premium+</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">Sustainability Bonus</h4>
                      <p className="text-gray-600">+20% for organic certification</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">Early Adopter Bonus</h4>
                      <p className="text-gray-600">+15% for first 1000 farmers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Token Transactions */}
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Token Transactions</h3>
                <div className="space-y-2 text-sm">
                  {sampleHerbs.map((herb) => (
                    <div key={herb.id} className="flex justify-between items-center p-3 bg-white rounded border">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium">{herb.farmer}</span>
                        <span className="text-gray-500 ml-2">({herb.name})</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">+{herb.tokenReward} AHT</div>
                        <div className="text-xs text-gray-500">{herb.harvestDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farmer Recognition Tab */}
        {activeTab === 'recognition' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-yellow-600" />
                Farmer Recognition & Leaderboard
              </h2>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Top Farmers</h3>
                  <div className="space-y-3">
                    {combinedFarmers().sort((a, b) => (b.points||0) - (a.points||0)).slice(0, 5).map((farmer, idx) => (
                      <div key={farmer.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{farmer.name}</div>
                            <div className="text-xs text-gray-500">{farmer.region}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-sm text-gray-700">
                            {farmer.badges.map((b, i) => (
                              <span key={i} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                                {b}
                              </span>
                            ))}
                          </div>
                          <div className="text-right">
                            <div className="text-green-700 font-semibold">{farmer.points} pts</div>
                            <div className="text-xs text-gray-500">{farmer.totalTokens} AHT</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">My Profile</h3>
                  {!currentUser ? (
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600 mb-3">Login as a farmer to view your profile and badges.</p>
                      <button onClick={() => setShowLogin(true)} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Login</button>
                    </div>
                  ) : (
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-blue-50">
                      <div className="mb-2">
                        <div className="font-medium text-gray-800">{currentUser.name}</div>
                        <div className="text-xs text-gray-500 break-all">{currentUser.wallet}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-white rounded border">
                          <div className="text-gray-500">Role</div>
                          <div className="font-medium capitalize">{currentUser.role}</div>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <div className="text-gray-500">Badges</div>
                          <div className="font-medium">{myBadges(currentUser).length}</div>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <div className="text-gray-500">Points</div>
                          <div className="font-medium">{myPoints(currentUser)}</div>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <div className="text-gray-500">Total AHT</div>
                          <div className="font-medium">{myTokens(currentUser)} AHT</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        {myBadges(currentUser).map((b, i) => (
                          <span key={i} className="inline-block mr-2 mb-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <h4 className="font-medium text-gray-800 mb-2">Add / Update Farmer</h4>
                    <form onSubmit={handleFarmerSubmit} className="space-y-2 text-sm">
                      <input className="w-full border rounded px-3 py-2" placeholder="Name" value={farmerForm.name} onChange={(e)=>setFarmerForm({...farmerForm, name:e.target.value})} />
                      <input className="w-full border rounded px-3 py-2" placeholder="Region" value={farmerForm.region} onChange={(e)=>setFarmerForm({...farmerForm, region:e.target.value})} />
                      <input className="w-full border rounded px-3 py-2" placeholder="Wallet (0x...)" value={farmerForm.wallet} onChange={(e)=>setFarmerForm({...farmerForm, wallet:e.target.value})} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="w-full border rounded px-3 py-2" placeholder="Points" type="number" value={farmerForm.points} onChange={(e)=>setFarmerForm({...farmerForm, points:e.target.value})} />
                        <input className="w-full border rounded px-3 py-2" placeholder="Total Tokens (AHT)" type="number" value={farmerForm.totalTokens} onChange={(e)=>setFarmerForm({...farmerForm, totalTokens:e.target.value})} />
                      </div>
                      <input className="w-full border rounded px-3 py-2" placeholder="Badges (comma separated)" value={farmerForm.badges} onChange={(e)=>setFarmerForm({...farmerForm, badges:e.target.value})} />
                      <button onClick={handleFarmerSubmit} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Login</h3>
              <button onClick={() => setShowLogin(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={loginForm.role}
                  onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="farmer">Farmer</option>
                  <option value="processor">Processor</option>
                  <option value="buyer">Buyer</option>
                  <option value="auditor">Auditor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                  placeholder="e.g., Ravi Kumar"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
                <input
                  type="text"
                  value={loginForm.wallet}
                  onChange={(e) => setLoginForm({ ...loginForm, wallet: e.target.value })}
                  placeholder="0x..."
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg">
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">Ayurvedic Herb Blockchain System</span>
          </div>
          <p className="text-gray-300 mb-2">
            Powered by Ministry of AYUSH & All India Institute of Ayurveda (AIIA)
          </p>
          <p className="text-sm text-gray-400">
            Smart India Hackathon 2025 - Problem Statement 25027
          </p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-400">
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Blockchain Secured
            </span>
            <span className="flex items-center">
              <Brain className="w-4 h-4 mr-1" />
              AI Powered
            </span>
            <span className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              Globally Accessible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyurvedicBlockchainSystem;