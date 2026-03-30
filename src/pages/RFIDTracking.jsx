import React from 'react';
import { Radio, Wifi, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sampleHerbs } from '../data';

const RFIDTracking = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Radio className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-white">{t('tabs.tracking')}</h2>
            <p className="text-gray-400">Physical tagging and real-time GPS tracking of herbs</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
          <Radio className="w-10 h-10 text-green-400 mb-3" />
          <span className="text-3xl font-display font-bold text-green-400 mb-1">15,847</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">RFID Tags Active</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
          <Wifi className="w-10 h-10 text-blue-400 mb-3" />
          <span className="text-3xl font-display font-bold text-blue-400 mb-1">8,230</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">NFC Tags Scanned</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
          <MapPin className="w-10 h-10 text-purple-400 mb-3" />
          <span className="text-3xl font-display font-bold text-purple-400 mb-1">342</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">GPS Checkpoints</span>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-display font-semibold text-white mb-6">Active Tag Registry</h3>
        <div className="space-y-4">
          {sampleHerbs.map((herb) => (
            <div key={herb.id} className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-white">{herb.name}</h4>
                  <p className="text-sm text-gray-400 italic">{herb.scientificName}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20 font-medium">
                  {herb.aiAuthenticated ? 'AI Verified' : 'Pending'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">{t('supplyChain.rfidTag')}</p>
                  <p className="text-sm text-green-400 font-mono">{herb.rfidTag}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">{t('supplyChain.nfcTag')}</p>
                  <p className="text-sm text-blue-400 font-mono">{herb.nfcTag}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">{t('supplyChain.harvestDate')}</p>
                  <p className="text-sm text-white">{herb.harvestDate}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">{t('supplyChain.quantity')}</p>
                  <p className="text-sm text-white">{herb.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RFIDTracking;
