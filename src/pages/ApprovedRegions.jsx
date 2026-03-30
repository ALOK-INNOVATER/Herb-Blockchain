import React, { useState } from 'react';
import { MapPin, Search, Leaf, Award, Thermometer, Mountain } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { approvedRegions } from '../data';

const ApprovedRegions = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);

  const filtered = approvedRegions.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.state.toLowerCase().includes(search.toLowerCase()) ||
    r.approvedHerbs.some(h => h.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <MapPin className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">{t('regions.title')}</h2>
            <p className="text-gray-400 text-sm">{t('regions.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('regions.searchPlaceholder')}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map(region => (
          <div
            key={region.id}
            onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}
            className={`glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedRegion?.id === region.id ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(52,211,153,0.15)]' : 'border-white/5 hover:border-white/20'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-display font-semibold text-white mb-1">{region.name}</h3>
                <p className="text-sm text-gray-400">{region.state} • {region.district}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium border ${region.certificationLevel.includes('Premium') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                {region.certificationLevel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <Mountain className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">{t('regions.soilType')}</p>
                <p className="text-sm text-white font-medium">{region.soilType}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <Thermometer className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">{t('regions.climate')}</p>
                <p className="text-sm text-white font-medium">{region.climate}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <MapPin className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">{t('regions.totalArea')}</p>
                <p className="text-sm text-white font-medium">{region.totalArea}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">{t('regions.approvedHerbs')}</p>
              <div className="flex flex-wrap gap-2">
                {region.approvedHerbs.map((herb, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-full border border-emerald-500/20 flex items-center space-x-1">
                    <Leaf className="w-3 h-3" />
                    <span>{herb}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedRegions;
