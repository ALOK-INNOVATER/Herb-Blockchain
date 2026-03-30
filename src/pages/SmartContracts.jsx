import React, { useState } from 'react';
import { FileCode2, Copy, CheckCircle, ShieldAlert, Cpu, Radio, Wifi, Clock, Hash, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SmartContracts = () => {
  const { t } = useTranslation();
  const [contractName, setContractName] = useState('HerbTracker');
  const [contractType, setContractType] = useState('SupplyChainTracking');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [expandedTx, setExpandedTx] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('generator');

  const generateHex = (len) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
  const generateHash = () => '0x' + generateHex(64);
  const generateRfid = () => `RFID-${generateHex(4)}-${generateHex(4)}-${generateHex(4)}-${generateHex(4)}`;
  const generateNfc = () => `NFC-${generateHex(4)}-${generateHex(4)}-${generateHex(4)}-${generateHex(4)}`;

  const generateContract = () => {
    let code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ${contractName.replace(/\s+/g, '')} {
    address public owner;
`;

    if (contractType === 'SupplyChainTracking') {
      code += `
    struct Product {
        uint256 id;
        string name;
        string origin;
        address cultivator;
        uint256 timestamp;
        string status;
        bytes32 rfidTag;
        bytes32 nfcTag;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductRegistered(uint256 id, string name, address cultivator);
    event StatusUpdated(uint256 id, string newStatus);
    event TagAssigned(uint256 id, bytes32 rfidTag, bytes32 nfcTag);

    constructor() {
        owner = msg.sender;
    }

    function registerProduct(
        string memory _name,
        string memory _origin,
        bytes32 _rfidTag,
        bytes32 _nfcTag
    ) public {
        productCount++;
        products[productCount] = Product(
            productCount, _name, _origin,
            msg.sender, block.timestamp,
            "Cultivated", _rfidTag, _nfcTag
        );
        emit ProductRegistered(productCount, _name, msg.sender);
        emit TagAssigned(productCount, _rfidTag, _nfcTag);
    }

    function updateStatus(uint256 _id, string memory _newStatus) public {
        require(products[_id].id != 0, "Product does not exist");
        products[_id].status = _newStatus;
        emit StatusUpdated(_id, _newStatus);
    }

    function verifyTag(uint256 _id, bytes32 _rfidTag) public view returns (bool) {
        return products[_id].rfidTag == _rfidTag;
    }
}
`;
    } else {
      code += `
    mapping(address => uint256) public balances;
    uint256 public totalDistributed;

    event RewardIssued(address indexed farmer, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function issueReward(address _farmer, uint256 _amount) public {
        require(msg.sender == owner, "Only owner can issue rewards");
        balances[_farmer] += _amount;
        totalDistributed += _amount;
        emit RewardIssued(_farmer, _amount);
    }

    function burnTokens(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        emit TokensBurned(msg.sender, _amount);
    }
}
`;
    }

    setGeneratedCode(code);

    // Create transaction record with unique RFID/NFC
    const newTx = {
      id: transactions.length + 1,
      contractName: contractName.replace(/\s+/g, ''),
      contractType,
      txHash: generateHash(),
      blockNumber: 18247651 + transactions.length,
      timestamp: new Date().toLocaleString(),
      gasUsed: (Math.random() * 500000 + 100000).toFixed(0),
      rfidTag: generateRfid(),
      nfcTag: generateNfc(),
      status: 'Deployed',
      code: code,
    };
    setTransactions(prev => [newTx, ...prev]);
    setCopied('');
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <FileCode2 className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-1">{t('smartContracts.title')}</h2>
            <p className="text-gray-400">{t('smartContracts.subtitle')}</p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setActiveSubTab('generator')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSubTab === 'generator' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'}`}
          >
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>{t('smartContracts.generateCode')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSubTab === 'transactions' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'}`}
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Transactions ({transactions.length})</span>
            </div>
          </button>
        </div>

        {/* GENERATOR SUB-TAB */}
        {activeSubTab === 'generator' && (
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('smartContracts.contractName')}</label>
                <input
                  type="text"
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('smartContracts.contractType')}</label>
                <div className="space-y-3">
                  <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${contractType === 'SupplyChainTracking' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <input type="radio" value="SupplyChainTracking" checked={contractType === 'SupplyChainTracking'} onChange={(e) => setContractType(e.target.value)} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${contractType === 'SupplyChainTracking' ? 'border-purple-400' : 'border-gray-500'}`}>
                      {contractType === 'SupplyChainTracking' && <div className="w-2 h-2 bg-purple-400 rounded-full" />}
                    </div>
                    <span className={`text-sm font-medium ${contractType === 'SupplyChainTracking' ? 'text-purple-300' : 'text-gray-400'}`}>{t('smartContracts.supplyChainTracking')}</span>
                  </label>

                  <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${contractType === 'TokenReward' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <input type="radio" value="TokenReward" checked={contractType === 'TokenReward'} onChange={(e) => setContractType(e.target.value)} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${contractType === 'TokenReward' ? 'border-purple-400' : 'border-gray-500'}`}>
                      {contractType === 'TokenReward' && <div className="w-2 h-2 bg-purple-400 rounded-full" />}
                    </div>
                    <span className={`text-sm font-medium ${contractType === 'TokenReward' ? 'text-purple-300' : 'text-gray-400'}`}>{t('smartContracts.tokenReward')}</span>
                  </label>
                </div>
              </div>

              <button
                onClick={generateContract}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Cpu className="w-5 h-5" />
                <span>{t('smartContracts.generateCode')}</span>
              </button>

              {/* Show latest contract tags */}
              {transactions.length > 0 && (
                <div className="space-y-3 border-t border-white/10 pt-4">
                  <p className="text-sm font-medium text-gray-400">Latest Contract Tags</p>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400 flex items-center space-x-1"><Radio className="w-3 h-3" /><span>{t('smartContracts.rfidCode')}</span></span>
                      <button onClick={() => copyToClipboard(transactions[0].rfidTag, 'rfid')} className="text-xs text-green-400 hover:text-green-300">
                        {copied === 'rfid' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="text-green-400 font-mono text-sm">{transactions[0].rfidTag}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400 flex items-center space-x-1"><Wifi className="w-3 h-3" /><span>{t('smartContracts.nfcCode')}</span></span>
                      <button onClick={() => copyToClipboard(transactions[0].nfcTag, 'nfc')} className="text-xs text-blue-400 hover:text-blue-300">
                        {copied === 'nfc' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="text-blue-400 font-mono text-sm">{transactions[0].nfcTag}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-8">
              <div className="h-full bg-[#1e1e2d] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                  <span className="text-sm font-mono text-gray-400 flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    <span>{contractName.replace(/\s+/g, '')}.sol</span>
                  </span>
                  {generatedCode && (
                    <button
                      onClick={() => copyToClipboard(generatedCode, 'code')}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      {copied === 'code' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="p-4 flex-1 overflow-y-auto font-mono text-sm text-blue-300 bg-[#0d0d14] relative min-h-[400px]">
                  {!generatedCode ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      {t('smartContracts.generatedContract')}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">{generatedCode}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS SUB-TAB */}
        {activeSubTab === 'transactions' && (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Clock className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">No contracts generated yet</p>
                <p className="text-sm mt-1">Generate a smart contract to see transaction history</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                  {/* Transaction Header */}
                  <div
                    onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <FileCode2 className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="text-white font-semibold">{tx.contractName}.sol</h4>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">{tx.status}</span>
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20">
                            {tx.contractType === 'SupplyChainTracking' ? 'Supply Chain' : 'Token Reward'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">{tx.txHash.slice(0, 20)}...{tx.txHash.slice(-8)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{tx.timestamp}</span>
                      {expandedTx === tx.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedTx === tx.id && (
                    <div className="border-t border-white/5 p-5 bg-white/[0.02] space-y-5">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 p-3 rounded-xl">
                          <p className="text-xs text-gray-400 mb-1">Block #</p>
                          <p className="text-blue-400 font-mono font-medium">#{tx.blockNumber}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl">
                          <p className="text-xs text-gray-400 mb-1">Gas Used</p>
                          <p className="text-white font-mono">{parseInt(tx.gasUsed).toLocaleString()}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl">
                          <p className="text-xs text-gray-400 mb-1">Tx Hash</p>
                          <div className="flex items-center space-x-1">
                            <p className="text-white font-mono text-xs truncate">{tx.txHash.slice(0, 16)}...</p>
                            <button onClick={() => copyToClipboard(tx.txHash, `hash-${tx.id}`)} className="shrink-0">
                              {copied === `hash-${tx.id}` ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl">
                          <p className="text-xs text-gray-400 mb-1">Timestamp</p>
                          <p className="text-white text-sm">{tx.timestamp}</p>
                        </div>
                      </div>

                      {/* RFID/NFC for this contract */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400 flex items-center space-x-2">
                              <Radio className="w-4 h-4 text-green-400" />
                              <span>{t('smartContracts.rfidCode')}</span>
                            </span>
                            <button onClick={() => copyToClipboard(tx.rfidTag, `rfid-${tx.id}`)}>
                              {copied === `rfid-${tx.id}` ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400 hover:text-white" />}
                            </button>
                          </div>
                          <p className="text-green-400 font-mono font-medium">{tx.rfidTag}</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400 flex items-center space-x-2">
                              <Wifi className="w-4 h-4 text-blue-400" />
                              <span>{t('smartContracts.nfcCode')}</span>
                            </span>
                            <button onClick={() => copyToClipboard(tx.nfcTag, `nfc-${tx.id}`)}>
                              {copied === `nfc-${tx.id}` ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400 hover:text-white" />}
                            </button>
                          </div>
                          <p className="text-blue-400 font-mono font-medium">{tx.nfcTag}</p>
                        </div>
                      </div>

                      {/* View Contract Code */}
                      <details className="group">
                        <summary className="flex items-center space-x-2 cursor-pointer text-sm text-purple-400 hover:text-purple-300 transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View Contract Code</span>
                        </summary>
                        <div className="mt-3 bg-[#0d0d14] rounded-xl p-4 overflow-x-auto border border-white/5">
                          <pre className="text-xs text-blue-300 font-mono whitespace-pre-wrap">{tx.code}</pre>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartContracts;
