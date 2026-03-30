import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Shield, Cpu, Radio, Database, Users, Coins, Eye, CheckCircle, Activity, Award, TrendingUp, Globe, Smartphone, Camera, Zap, Star, Package, Truck, Factory, Store, ChevronRight, Brain, Wifi, MapPin, Languages, X, Info, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

import { smartContractCode, approvedRegions, systemComponents, sampleHerbs, sampleFarmers } from './data';
import SmartContracts from './pages/SmartContracts';
import ApprovedRegions from './pages/ApprovedRegions';
import BlockchainCore from './pages/BlockchainCore';
import AIAuth from './pages/AIAuth';
import RFIDTracking from './pages/RFIDTracking';
import TokensPage from './pages/TokensPage';
import Leaderboard from './pages/Leaderboard';

const AyurvedicBlockchainSystem = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [animatedSection, setAnimatedSection] = useState(0);
  const [showBlockchainInfo, setShowBlockchainInfo] = useState(false);

  const tabs = [
    { id: 'overview', label: t('tabs.overview') },
    { id: 'regions', label: t('tabs.regions') },
    { id: 'blockchain', label: t('tabs.blockchain') },
    { id: 'ai-auth', label: t('tabs.ai_auth') },
    { id: 'tracking', label: t('tabs.tracking') },
    { id: 'supply-chain', label: t('tabs.supply_chain') },
    { id: 'tokens', label: t('tabs.tokens') },
    { id: 'recognition', label: t('tabs.recognition') },
    { id: 'smart-contracts', label: t('tabs.smart_contracts') }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedSection((prev) => (prev + 1) % systemComponents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-300 font-sans relative pb-20 overflow-hidden">
      {/* Background glowing effects */}
      <div className="fixed top-0 left-[-20%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 glass-card border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <Leaf className="w-6 h-6 text-[#0f1115]" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white tracking-wide">
                Herb-<span className="text-emerald-400">Blockchain</span>
              </h1>
              <p className="text-xs text-emerald-400/80 uppercase tracking-widest font-medium">{t('app.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">{t('status.systemActive')}</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-400 tracking-wide uppercase">{t('status.blockchainSecured')}</span>
            </div>
            
            <button 
              onClick={toggleLanguage}
              className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              <span>{i18n.language === 'hi' ? 'EN' : 'हिंदी'}</span>
            </button>

            <SignedOut>
              <Link to="/login" className="px-5 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-sm">
                {t('actions.quickLogin')}
              </Link>
              <Link to="/sign-up" className="px-5 py-2 bg-emerald-500/20 text-emerald-300 font-semibold rounded-lg hover:bg-emerald-500/30 transition-colors text-sm border border-emerald-500/30">
                {t('actions.signupPage')}
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-10 relative z-10">
        
        {/* Sticky Tabs */}
        <div className="sticky top-[80px] z-40 bg-[#0f1115]/80 backdrop-blur-xl py-4 mb-8 -mx-6 px-6 border-b border-white/5 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: t('overview.systemUptime'), value: "99.99%", color: "text-emerald-400" },
                  { label: t('overview.herbsTracked'), value: "15,847", color: "text-blue-400" },
                  { label: t('overview.verifiedFarmers'), value: "2,341", color: "text-purple-400" },
                  { label: t('overview.tokensDistributed'), value: "48.2M", color: "text-amber-400" }
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
                    <span className={`text-4xl font-display font-bold ${stat.color} drop-shadow-md mb-2`}>{stat.value}</span>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider text-center">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemComponents.map((comp, idx) => {
                  const Icon = comp.icon;
                  const isActive = idx === animatedSection;
                  const isHindi = i18n.language === 'hi';
                  return (
                    <motion.div
                      key={comp.id}
                      onClick={() => setActiveTab(comp.tabId)}
                      className={`glass-card p-6 rounded-2xl border transition-all duration-500 cursor-pointer hover:scale-[1.02] ${
                        isActive ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(52,211,153,0.15)] scale-[1.02]' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full font-medium">
                          {t('overview.active')}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-semibold text-white mb-2">{isHindi ? comp.nameHi : comp.name}</h3>
                      <p className="text-sm text-gray-400 mb-6">{isHindi ? comp.descHi : comp.description}</p>
                      <div className="space-y-3">
                        {(isHindi ? comp.featuresHi : comp.features).map((f, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                            <span className="text-gray-300">{f}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* APPROVED REGIONS TAB */}
          {activeTab === 'regions' && (
            <motion.div key="regions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ApprovedRegions />
            </motion.div>
          )}

          {/* BLOCKCHAIN CORE TAB */}
          {activeTab === 'blockchain' && (
            <motion.div key="blockchain" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <BlockchainCore />
            </motion.div>
          )}

          {/* AI AUTH TAB */}
          {activeTab === 'ai-auth' && (
            <motion.div key="ai-auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AIAuth />
            </motion.div>
          )}

          {/* RFID/NFC TRACKING TAB */}
          {activeTab === 'tracking' && (
            <motion.div key="tracking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <RFIDTracking />
            </motion.div>
          )}

          {/* SUPPLY CHAIN TAB */}
          {activeTab === 'supply-chain' && (
            <motion.div 
              key="supply-chain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                     <Package className="w-6 h-6 text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white">{t('supplyChain.liveTracker')}</h2>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-10">
                  {sampleHerbs.map(herb => (
                    <button
                      key={herb.id}
                      onClick={() => setSelectedHerb(herb)}
                      className={`px-6 py-3 rounded-xl border transition-all duration-300 font-medium ${
                        selectedHerb?.id === herb.id 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                          : 'glass-card text-gray-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {herb.name} <span className="opacity-50 ml-2">#{herb.id.split('-').pop()}</span>
                    </button>
                  ))}
                </div>

                {selectedHerb && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="relative pb-10"
                  >
                    <div className="glass-card p-6 rounded-2xl border-blue-500/30 bg-blue-500/5 mb-10 grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{t('supplyChain.origin')}</p>
                        <p className="text-lg font-medium text-white">{selectedHerb.region}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{t('supplyChain.cultivator')}</p>
                        <p className="text-lg font-medium text-white">{selectedHerb.farmer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{t('supplyChain.qualityReward')}</p>
                        <p className="text-lg font-medium text-emerald-400">{selectedHerb.quality} • {selectedHerb.tokenReward} AHT</p>
                      </div>
                    </div>

                    {/* Extra details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">{t('supplyChain.rfidTag')}</p>
                        <p className="text-sm text-green-400 font-mono">{selectedHerb.rfidTag}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">{t('supplyChain.nfcTag')}</p>
                        <p className="text-sm text-blue-400 font-mono">{selectedHerb.nfcTag}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">{t('supplyChain.harvestDate')}</p>
                        <p className="text-sm text-white">{selectedHerb.harvestDate}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">{t('supplyChain.quantity')}</p>
                        <p className="text-sm text-white">{selectedHerb.quantity}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedHerb.certifications.map((cert, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-full border border-emerald-500/20">{cert}</span>
                      ))}
                    </div>

                    <div className="relative">
                      <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-white/10" />
                      <div className="space-y-8 relative">
                        {selectedHerb.supplyChainStages.map((stage, i) => {
                          const isCurrent = stage.completed && (!selectedHerb.supplyChainStages[i+1] || !selectedHerb.supplyChainStages[i+1].completed);
                          return (
                            <motion.div 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              key={i} 
                              className="flex items-start"
                            >
                              <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                                stage.completed 
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
                                  : 'bg-white/5 border-white/10 text-gray-600'
                              }`}>
                                {isCurrent && <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl animate-ping" />}
                                {i === 0 && <Leaf className="w-6 h-6" />}
                                {i === 1 && <Users className="w-6 h-6" />}
                                {i === 2 && <Factory className="w-6 h-6" />}
                                {i === 3 && <Shield className="w-6 h-6" />}
                                {i === 4 && <Truck className="w-6 h-6" />}
                                {i === 5 && <Package className="w-6 h-6" />}
                                {i === 6 && <Store className="w-6 h-6" />}
                              </div>
                              <div className="ml-8 mt-1 glass-card p-5 rounded-2xl w-full flex justify-between items-center group hover:border-white/20 transition-colors">
                                <div>
                                  <h4 className={`text-lg font-medium mb-1 ${stage.completed ? 'text-white' : 'text-gray-500'}`}>{stage.stage}</h4>
                                  <p className="text-sm text-gray-400">{stage.timestamp || t('supplyChain.awaitingNext')}</p>
                                </div>
                                {stage.completed ? (
                                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full font-medium border border-emerald-500/20">
                                    {t('supplyChain.verifiedOnChain')}
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-white/5 text-gray-500 text-xs rounded-full font-medium border border-white/5">
                                    {t('supplyChain.pending')}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* TOKENS TAB */}
          {activeTab === 'tokens' && (
            <motion.div key="tokens" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TokensPage />
            </motion.div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'recognition' && (
            <motion.div key="recognition" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Leaderboard />
            </motion.div>
          )}

          {/* SMART CONTRACTS TAB */}
          {activeTab === 'smart-contracts' && (
            <motion.div key="smart-contracts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <SmartContracts />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Blockchain Info Button */}
      <button
        onClick={() => setShowBlockchainInfo(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-110 transition-transform active:scale-95 group"
        title="Blockchain Core Info"
      >
        <Info className="w-7 h-7 text-white" />
        <span className="absolute right-16 bg-blue-600 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Blockchain Core</span>
      </button>

      {/* Ministry of Ayush & Blockchain Info Modal */}
      <AnimatePresence>
        {showBlockchainInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowBlockchainInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 rounded-3xl border border-emerald-500/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <Shield className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">System Governance & Vision</h2>
                    <p className="text-sm text-emerald-400">Ministry of Ayush Verified</p>
                  </div>
                </div>
                <button onClick={() => setShowBlockchainInfo(false)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <p className="text-gray-400 mb-6">Discover the foundational pillars that make Herb-Blockchain the definitive standard for Ayurvedic traceability in India.</p>
              <div className="space-y-4">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-colors">
                  <h4 className="text-white font-semibold mb-3 flex items-center space-x-2"><Crown className="w-5 h-5 text-amber-500" /> <span>Ministry of Ayush Governance</span></h4>
                  <p className="text-sm text-gray-400">This platform operates under the stringent guidelines established by the <strong className="text-white">Ministry of Ayush, Government of India</strong>. Our smart contracts actively validate that herbs are exclusively cultivated in Ministry-approved agro-climatic zones, ensuring genuine Ayurvedic efficacy down to the roots.</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-colors">
                  <h4 className="text-white font-semibold mb-3 flex items-center space-x-2"><Activity className="w-5 h-5 text-blue-400" /> <span>Why Blockchain Matters in Ayurveda</span></h4>
                  <ul className="text-sm text-gray-400 space-y-3">
                    <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /><span><strong>Combating Adulteration:</strong> In an industry plagued by counterfeit herbs, immutable ledger tech guarantees 100% genuine sourcing.</span></li>
                    <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /><span><strong>Empowering Local Farmers:</strong> Transparent tokenomics eliminate unfair middlemen, directly rewarding cultivators for high-quality, organic yields.</span></li>
                    <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /><span><strong>Consumer Trust:</strong> By scanning a simple code, consumers can trace their medicine back to the exact farmer, soil type, and harvest date.</span></li>
                  </ul>
                </div>

                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h4 className="text-white font-semibold mb-3">Regulatory Impact</h4>
                  <p className="text-sm text-gray-400 mb-4">By merging Web3 decentralized systems with AI-driven botanical authentication, Herb-Blockchain is setting a global benchmark for the export and domestic distribution of traditional Indian medicine.</p>
                  <div className="flex flex-wrap gap-2">
                    {['100% Traceability', 'Anti-Counterfeit', 'Ayush e-Aushadhi Compliant', 'Farmer First'].map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-full border border-emerald-500/20">{tech}</span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowBlockchainInfo(false)}
                  className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:from-emerald-500 hover:to-green-500 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Understood & Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AyurvedicBlockchainSystem;