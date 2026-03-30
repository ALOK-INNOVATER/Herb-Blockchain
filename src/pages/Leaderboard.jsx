import React, { useState } from 'react';
import { Award, Trophy, Star, Medal, Crown, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sampleFarmers } from '../data';

const Leaderboard = () => {
  const { t } = useTranslation();
  const sorted = [...sampleFarmers].sort((a, b) => b.points - a.points);
  const [showMyPosition, setShowMyPosition] = useState(false);

  // Always find Alok (the current user) by the isCurrentUser flag
  const userIndex = sorted.findIndex(f => f.isCurrentUser);
  const currentUser = userIndex >= 0 ? sorted[userIndex] : null;

  const getRankBadge = (i) => {
    if (i === 0) return { label: t('leaderboard.gold'), color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (i === 1) return { label: t('leaderboard.silver'), color: 'bg-gray-400/20 text-gray-300 border-gray-400/30' };
    if (i === 2) return { label: t('leaderboard.bronze'), color: 'bg-orange-700/20 text-orange-400 border-orange-700/30' };
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-white">{t('leaderboard.title')}</h2>
              <p className="text-gray-400">{t('leaderboard.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setShowMyPosition(!showMyPosition)}
            className={`px-6 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-95 flex items-center space-x-2 ${
              showMyPosition
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>{t('leaderboard.yourPosition')}</span>
          </button>
        </div>
      </div>

      {/* Alok's Position Highlight Card */}
      {showMyPosition && currentUser && (
        <div className="glass-card p-6 rounded-2xl border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] bg-amber-500/5">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-display font-semibold text-amber-400">
              {currentUser.name} — {t('leaderboard.yourPosition')}: #{userIndex + 1}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">{t('leaderboard.farmer')}</p>
              <p className="text-lg text-white font-semibold">{currentUser.name}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">{t('leaderboard.region')}</p>
              <p className="text-white">{currentUser.region}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">{t('leaderboard.ranking')}</p>
              <p className="text-2xl text-blue-400 font-bold">#{userIndex + 1} / {sorted.length}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">{t('leaderboard.points')}</p>
              <p className="text-2xl text-emerald-400 font-bold">{currentUser.points.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">{t('leaderboard.tokensEarned')}</p>
              <p className="text-2xl text-amber-400 font-bold">{currentUser.totalTokens} AHT</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {currentUser.badges.map((badge, j) => (
              <span key={j} className="px-3 py-1 bg-amber-500/10 text-amber-300 text-xs rounded-full border border-amber-500/20 flex items-center space-x-1">
                <Star className="w-3 h-3 text-amber-400" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 font-mono">
            Wallet: {currentUser.wallet}
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="space-y-4">
        {sorted.map((farmer, i) => {
          const isUser = farmer.isCurrentUser;
          const rankBadge = getRankBadge(i);
          return (
            <div
              key={farmer.id}
              className={`glass-card p-6 rounded-2xl border-2 transition-all ${
                isUser
                  ? 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] bg-amber-500/5'
                  : i === 0
                  ? 'border-amber-500/30'
                  : i === 1
                  ? 'border-gray-400/20'
                  : i === 2
                  ? 'border-orange-800/20'
                  : 'border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                      i === 0
                        ? 'bg-amber-500/20 text-amber-400'
                        : i === 1
                        ? 'bg-gray-400/20 text-gray-300'
                        : i === 2
                        ? 'bg-orange-800/20 text-orange-400'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {i === 0 ? <Crown className="w-7 h-7" /> : i === 1 ? <Medal className="w-7 h-7" /> : i === 2 ? <Award className="w-7 h-7" /> : `#${i + 1}`}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className={`text-lg font-semibold ${isUser ? 'text-amber-300' : 'text-white'}`}>{farmer.name}</h3>
                      {isUser && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30 font-bold animate-pulse">
                          {t('tokens.youAre')} ★
                        </span>
                      )}
                      {rankBadge && (
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${rankBadge.color}`}>
                          {rankBadge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{farmer.region}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400 font-display">{farmer.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{t('leaderboard.points')}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-lg font-bold text-amber-400 font-mono">{farmer.totalTokens} AHT</p>
                    <p className="text-xs text-gray-400">{t('leaderboard.tokensEarned')}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {farmer.badges.map((badge, j) => (
                  <span key={j} className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10 flex items-center space-x-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
              {isUser && (
                <div className="mt-3 text-amber-400 text-sm font-medium animate-pulse flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{t('leaderboard.youAreHere')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
