import React, { useState, useCallback, useEffect } from 'react';
import { Coins, ArrowUpRight, ArrowDownRight, TrendingUp, Flame, CircleDollarSign, Wallet, Link2, Unlink, AlertTriangle, LogIn, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const tokenTxs = [
  { from: 'System', to: 'Ravi Kumar', amount: 150, type: 'Quality Bonus', time: '2 min ago' },
  { from: 'System', to: 'Lakshmi Nair', amount: 120, type: 'Harvest Reward', time: '8 min ago' },
  { from: 'Suresh Patel', to: 'Staking Pool', amount: 500, type: 'Staking', time: '15 min ago' },
  { from: 'System', to: 'Anita Sharma', amount: 200, type: 'Organic Bonus', time: '32 min ago' },
  { from: 'Mahesh Yadav', to: 'Marketplace', amount: 80, type: 'Trade', time: '1 hr ago' },
  { from: 'System', to: 'Ravi Kumar', amount: 75, type: 'On-time Delivery', time: '2 hr ago' },
];

const TokensPage = () => {
  const { t } = useTranslation();
  const [walletAddress, setWalletAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('');
  const [ahtBalance] = useState((Math.random() * 5000 + 500).toFixed(2));
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [loginMode, setLoginMode] = useState(''); // '' | 'metamask' | 'manual'

  // Check for MetaMask on mount and after a delay (MetaMask injects slowly)
  useEffect(() => {
    const check = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        setHasMetaMask(true);
      }
    };
    check();
    const timer = setTimeout(check, 1000);
    return () => clearTimeout(timer);
  }, []);

  const connectMetaMask = useCallback(async () => {
    setError('');
    setConnecting(true);

    // Try to get ethereum provider
    let provider = null;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3?.currentProvider) {
      provider = window.web3.currentProvider;
    }

    if (!provider) {
      setError(t('tokens.noWallet'));
      setConnecting(false);
      return;
    }

    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        const addr = accounts[0];
        setWalletAddress(addr);
        setLoginMode('metamask');

        try {
          const balanceHex = await provider.request({ method: 'eth_getBalance', params: [addr, 'latest'] });
          const balanceWei = parseInt(balanceHex, 16);
          const balanceEth = (balanceWei / 1e18).toFixed(4);
          setEthBalance(balanceEth);
        } catch {
          setEthBalance('0.0000');
        }
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError(err.message || 'MetaMask connection failed');
      }
    }
    setConnecting(false);
  }, [t]);

  const connectManual = () => {
    if (manualAddress.length >= 10) {
      setWalletAddress(manualAddress);
      setEthBalance('0.0000');
      setLoginMode('manual');
      setError('');
    } else {
      setError('Please enter a valid wallet address');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setEthBalance('');
    setLoginMode('');
    setError('');
    setManualAddress('');
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Coins className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-white">{t('tokens.title')}</h2>
            <p className="text-gray-400">{t('tokens.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Wallet Login Card */}
      <div className="glass-card p-6 rounded-2xl border border-purple-500/20">
        {!walletAddress ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <LogIn className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{t('tokens.connectWallet')}</h3>
                <p className="text-sm text-gray-400">Connect your Ethereum wallet to view your token balance</p>
              </div>
            </div>

            {/* MetaMask Login Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={connectMetaMask}
                disabled={connecting}
                className="p-6 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-2 border-orange-500/20 rounded-2xl hover:border-orange-500/40 transition-all group text-left"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🦊</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">MetaMask</p>
                    <p className="text-xs text-gray-400">{hasMetaMask ? '✅ Detected' : '❌ Not detected'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  {connecting ? 'Connecting...' : 'Click to connect with MetaMask browser extension'}
                </p>
              </button>

              {/* Manual Wallet Entry */}
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/20 rounded-2xl text-left">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{t('tokens.walletAddress')}</p>
                    <p className="text-xs text-gray-400">Enter manually</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500/50"
                  />
                  <button
                    onClick={connectManual}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>

            {!hasMetaMask && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                <p className="text-amber-400 text-sm font-medium mb-2">🦊 MetaMask not detected?</p>
                <p className="text-gray-400 text-sm mb-3">Make sure MetaMask extension is installed and enabled in your browser. After installing, refresh this page.</p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-colors border border-amber-500/30"
                >
                  Install MetaMask →
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 font-medium">{t('tokens.walletConnected')}</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                  {loginMode === 'metamask' ? '🦊 MetaMask' : '🔑 Manual'}
                </span>
              </div>
              <button onClick={disconnectWallet} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 transition-colors flex items-center space-x-2">
                <Unlink className="w-4 h-4" />
                <span>{t('tokens.disconnectWallet')}</span>
              </button>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 mb-1">{t('tokens.walletAddress')}</p>
              <p className="text-white font-mono text-sm break-all">{walletAddress}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-5 rounded-xl border border-purple-500/20 text-center">
                <p className="text-xs text-gray-400 mb-2">{t('tokens.ethBalance')}</p>
                <p className="text-3xl font-display font-bold text-purple-400">{ethBalance} <span className="text-lg">ETH</span></p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-5 rounded-xl border border-amber-500/20 text-center">
                <p className="text-xs text-gray-400 mb-2">{t('tokens.yourBalance')}</p>
                <p className="text-3xl font-display font-bold text-amber-400">{ahtBalance} <span className="text-lg">AHT</span></p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 p-5 rounded-xl border border-emerald-500/20 text-center">
                <p className="text-xs text-gray-400 mb-2">{t('tokens.yourTokens')}</p>
                <p className="text-3xl font-display font-bold text-emerald-400">${(parseFloat(ahtBalance) * 0.12).toFixed(2)} <span className="text-lg">USD</span></p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4 flex items-center space-x-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: t('tokens.totalSupply'), value: '100M', icon: CircleDollarSign, color: 'text-amber-400' },
          { label: t('tokens.circulatingTokens'), value: '48.2M', icon: Wallet, color: 'text-emerald-400' },
          { label: t('tokens.stakingRewards'), value: '12.5M', icon: TrendingUp, color: 'text-blue-400' },
          { label: t('tokens.burnedTokens'), value: '2.1M', icon: Flame, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <span className={`text-3xl font-display font-bold ${stat.color} mb-1`}>{stat.value}</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-display font-semibold text-white mb-6">{t('tokens.recentTransactions')}</h3>
        <div className="space-y-4">
          {tokenTxs.map((tx, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${tx.type === 'Trade' || tx.type === 'Staking' ? 'bg-orange-500/20' : 'bg-emerald-500/20'}`}>
                  {tx.type === 'Trade' || tx.type === 'Staking' ? <ArrowUpRight className="w-5 h-5 text-orange-400" /> : <ArrowDownRight className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <p className="text-white font-medium">{tx.from} → {tx.to}</p>
                  <p className="text-xs text-gray-400">{tx.type} • {tx.time}</p>
                </div>
              </div>
              <span className={`text-lg font-bold font-mono ${tx.type === 'Trade' || tx.type === 'Staking' ? 'text-orange-400' : 'text-emerald-400'}`}>
                {tx.type === 'Trade' || tx.type === 'Staking' ? '-' : '+'}{tx.amount} AHT
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokensPage;
