import React from 'react';
import { Database, Hash, Clock, Zap, Layers, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { smartContractCode } from '../data';

const latestBlocks = [
  { number: 18247651, hash: '0x8a4f...b2c1', timestamp: '12 sec ago', txCount: 42, gasUsed: '12.4M' },
  { number: 18247650, hash: '0x7c3e...a1d0', timestamp: '24 sec ago', txCount: 38, gasUsed: '11.8M' },
  { number: 18247649, hash: '0x6b2d...90cf', timestamp: '36 sec ago', txCount: 55, gasUsed: '14.2M' },
  { number: 18247648, hash: '0x5a1c...8fbe', timestamp: '48 sec ago', txCount: 29, gasUsed: '9.6M' },
  { number: 18247647, hash: '0x490b...7ead', timestamp: '1 min ago', txCount: 47, gasUsed: '13.1M' },
];

const BlockchainCore = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Database className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-white">{t('blockchain.title')}</h2>
            <p className="text-gray-400">{t('blockchain.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: t('blockchain.totalBlocks'), value: '18.2M', icon: Layers, color: 'text-blue-400' },
          { label: t('blockchain.txPerSec'), value: '1,247', icon: Zap, color: 'text-amber-400' },
          { label: t('blockchain.nodes'), value: '342', icon: Server, color: 'text-emerald-400' },
          { label: t('blockchain.consensus'), value: 'PoS', icon: Hash, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <span className={`text-3xl font-display font-bold ${stat.color} mb-1`}>{stat.value}</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Latest Blocks */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-display font-semibold text-white mb-6 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>{t('blockchain.latestBlocks')}</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Block</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('blockchain.blockHash')}</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('blockchain.timestamp')}</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('blockchain.transactions')}</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('blockchain.gasUsed')}</th>
              </tr>
            </thead>
            <tbody>
              {latestBlocks.map((block, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-blue-400 font-mono font-medium">#{block.number}</td>
                  <td className="py-3 px-4 text-gray-300 font-mono">{block.hash}</td>
                  <td className="py-3 px-4 text-gray-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{block.timestamp}</span>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{block.txCount}</td>
                  <td className="py-3 px-4 text-gray-300">{block.gasUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployed Smart Contract */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-display font-semibold text-white mb-4 flex items-center space-x-2">
          <Hash className="w-5 h-5 text-purple-400" />
          <span>{t('blockchain.smartContract')}</span>
        </h3>
        <div className="bg-[#0d0d14] rounded-xl p-4 overflow-x-auto">
          <pre className="text-sm text-blue-300 font-mono whitespace-pre-wrap">{smartContractCode}</pre>
        </div>
      </div>
    </div>
  );
};

export default BlockchainCore;
