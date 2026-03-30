import { Database, Brain, Radio, Globe, Eye, Coins } from 'lucide-react';

export const smartContractCode = `// SPDX-License-Identifier: MIT
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

// ─── Generate 1000+ Approved Regions from Indian states & AYUSH cultivation data ───

const stateData = [
  { state: 'Kerala', districts: ['Alappuzha','Kottayam','Idukki','Wayanad','Palakkad','Thrissur','Ernakulam','Kollam','Pathanamthitta','Malappuram','Kozhikode','Kannur','Kasaragod','Thiruvananthapuram'], herbs: ['Brahmi','Ashwagandha','Turmeric','Shatavari','Tulsi','Amla'], soil: 'Alluvial', climate: 'Tropical' },
  { state: 'Uttarakhand', districts: ['Chamoli','Pithoragarh','Uttarkashi','Rudraprayag','Tehri Garhwal','Dehradun','Nainital','Almora','Bageshwar','Champawat','Pauri Garhwal','Haridwar','Udham Singh Nagar'], herbs: ['Jatamansi','Kutki','Shankhpushpi','Brahmi','Chirayata','Atis'], soil: 'Mountain', climate: 'Temperate' },
  { state: 'Karnataka', districts: ['Kodagu','Chikkamagaluru','Hassan','Shimoga','Dakshina Kannada','Udupi','Uttara Kannada','Mysuru','Mandya','Chamarajanagar','Belgaum','Dharwad','Raichur','Bellary','Haveri','Davangere','Chitradurga','Tumkur','Kolar','Bangalore Rural'], herbs: ['Ashwagandha','Shatavari','Turmeric','Brahmi','Guggulu','Neem'], soil: 'Red laterite', climate: 'Monsoon' },
  { state: 'Madhya Pradesh', districts: ['Betul','Chhindwara','Dindori','Mandla','Balaghat','Shahdol','Umaria','Anuppur','Katni','Jabalpur','Seoni','Hoshangabad','Narmadapuram','Sagar','Damoh','Panna','Tikamgarh','Chhatarpur','Rewa','Satna','Sidhi','Singrauli'], herbs: ['Safed Musli','Kalmegh','Giloy','Ashwagandha','Shatavari','Guduchi'], soil: 'Black cotton', climate: 'Dry deciduous' },
  { state: 'Himachal Pradesh', districts: ['Kullu','Shimla','Mandi','Kangra','Chamba','Kinnaur','Lahaul Spiti','Solan','Sirmaur','Una','Hamirpur','Bilaspur'], herbs: ['Jatamansi','Brahmi','Kutki','Chirayata','Kuth','Atish'], soil: 'Alpine', climate: 'Alpine temperate' },
  { state: 'Tamil Nadu', districts: ['Nilgiris','Coimbatore','Dindigul','Theni','Tirunelveli','Kanyakumari','Madurai','Salem','Erode','Namakkal','Dharmapuri','Krishnagiri','Tiruvannamalai','Villupuram','Cuddalore','Thanjavur','Tiruchirappalli','Perambalur','Karur','Virudhunagar','Ramanathapuram','Sivaganga','Pudukkottai','Nagapattinam'], herbs: ['Tulsi','Lemongrass','Ashwagandha','Senna','Coleus','Aloe Vera'], soil: 'Hill soil', climate: 'Tropical highland' },
  { state: 'Rajasthan', districts: ['Udaipur','Mount Abu','Jaipur','Jodhpur','Bikaner','Ajmer','Kota','Bundi','Chittorgarh','Pratapgarh','Banswara','Dungarpur','Bhilwara','Pali','Sirohi','Barmer','Jaisalmer','Nagaur','Sikar','Jhunjhunu','Alwar','Bharatpur','Tonk','Sawai Madhopur','Baran','Jhalawar'], herbs: ['Safed Musli','Shatavari','Isabgol','Mehendi','Guggulu','Ashwagandha'], soil: 'Sandy loam', climate: 'Semi-arid' },
  { state: 'Odisha', districts: ['Ganjam','Khurda','Kandhamal','Koraput','Malkangiri','Rayagada','Gajapati','Kalahandi','Nuapada','Bolangir','Sonepur','Boudh','Nayagarh','Angul','Dhenkanal','Keonjhar','Mayurbhanj','Sundargarh','Jharsuguda','Sambalpur','Bargarh','Balasore','Bhadrak','Jajpur','Kendrapara','Jagatsinghpur','Puri','Cuttack'], herbs: ['Kalmegh','Punarnava','Guduchi','Tulsi','Ashwagandha','Shatavari'], soil: 'Alluvium', climate: 'Tropical' },
  { state: 'Assam', districts: ['Kamrup','Nagaon','Sonitpur','Jorhat','Golaghat','Sivasagar','Dibrugarh','Tinsukia','Lakhimpur','Dhemaji','Darrang','Nalbari','Barpeta','Bongaigaon','Kokrajhar','Dhubri','Goalpara','Cachar','Karimganj','Hailakandi'], herbs: ['Brahmi','Tulsi','Pipali','Neem','Amla','Chirayata'], soil: 'Alluvial', climate: 'Subtropical humid' },
  { state: 'Gujarat', districts: ['Banaskantha','Sabarkantha','Panchmahal','Dahod','Narmada','Bharuch','Valsad','Navsari','Surat','Tapi','Dang','Junagadh','Amreli','Bhavnagar','Rajkot','Jamnagar','Kutch','Mehsana','Patan','Anand','Kheda','Vadodara','Gandhinagar','Ahmedabad'], herbs: ['Isabgol','Ashwagandha','Safed Musli','Guggulu','Aloe Vera','Senna'], soil: 'Black soil', climate: 'Arid to semi-arid' },
  { state: 'Maharashtra', districts: ['Pune','Satara','Kolhapur','Sangli','Ratnagiri','Sindhudurg','Nashik','Ahmednagar','Aurangabad','Jalgaon','Dhule','Nandurbar','Amravati','Yavatmal','Wardha','Nagpur','Chandrapur','Gadchiroli','Bhandara','Gondia','Buldhana','Akola','Washim','Hingoli','Parbhani','Latur','Osmanabad','Nanded','Beed','Jalna','Solapur','Thane','Raigad'], herbs: ['Ashwagandha','Shatavari','Tulsi','Guduchi','Hirda','Behda'], soil: 'Black basalt', climate: 'Semi-arid monsoon' },
  { state: 'Chhattisgarh', districts: ['Bastar','Dantewada','Bijapur','Sukma','Kondagaon','Narayanpur','Kanker','Jagdalpur','Korba','Bilaspur','Raigarh','Jashpur','Surguja','Koriya','Dhamtari','Mahasamund','Raipur','Durg','Rajnandgaon','Kawardha','Mungeli','Balod','Bemetara','Baloda Bazar','Gariaband'], herbs: ['Safed Musli','Kalmegh','Ashwagandha','Giloy','Haldi','Shatavari'], soil: 'Red and yellow', climate: 'Tropical humid' },
  { state: 'Jharkhand', districts: ['Ranchi','Lohardaga','Gumla','Simdega','Khunti','West Singhbhum','Seraikela','East Singhbhum','Dumka','Godda','Sahebganj','Pakur','Jamtara','Deoghar','Giridih','Bokaro','Dhanbad','Hazaribagh','Ramgarh','Koderma','Chatra','Palamu','Latehar','Garhwa'], herbs: ['Ashwagandha','Kalmegh','Punarnava','Giloy','Safed Musli','Amla'], soil: 'Red soil', climate: 'Tropical wet-dry' },
  { state: 'West Bengal', districts: ['Darjeeling','Kalimpong','Jalpaiguri','Alipurduar','Cooch Behar','North Dinajpur','South Dinajpur','Malda','Murshidabad','Birbhum','Bankura','Purulia','West Midnapore','East Midnapore','Howrah','Hooghly','Nadia','North 24 Parganas','South 24 Parganas','Burdwan'], herbs: ['Brahmi','Tulsi','Neem','Kalmegh','Ashwagandha','Shatavari'], soil: 'Alluvial', climate: 'Tropical wet' },
  { state: 'Andhra Pradesh', districts: ['Visakhapatnam','Srikakulam','Vizianagaram','East Godavari','West Godavari','Krishna','Guntur','Prakasam','Nellore','Chittoor','Kadapa','Anantapur','Kurnool'], herbs: ['Ashwagandha','Senna','Coleus','Aloe Vera','Turmeric','Tulsi'], soil: 'Red sandy', climate: 'Tropical' },
  { state: 'Telangana', districts: ['Adilabad','Nirmal','Mancherial','Kumuram Bheem','Nizamabad','Kamareddy','Jagtial','Peddapalli','Karimnagar','Rajanna Sircilla','Warangal Urban','Warangal Rural','Mahabubabad','Khammam','Bhadradri','Suryapet','Nalgonda','Yadadri','Medchal','Rangareddy','Hyderabad','Sangareddy','Medak','Siddipet','Jangaon','Mahbubnagar','Nagarkurnool','Wanaparthy','Gadwal','Narayanpet','Vikarabad'], herbs: ['Ashwagandha','Tulsi','Shatavari','Guduchi','Amla','Neem'], soil: 'Red and black', climate: 'Semi-arid' },
  { state: 'Punjab', districts: ['Amritsar','Gurdaspur','Pathankot','Tarn Taran','Jalandhar','Kapurthala','Hoshiarpur','Nawanshahr','Ludhiana','Moga','Firozpur','Fazilka','Bathinda','Mansa','Sangrur','Barnala','Patiala','Fatehgarh Sahib','Rupnagar','SAS Nagar','Muktsar'], herbs: ['Ashwagandha','Shatavari','Tulsi','Brahmi','Amla','Safed Musli'], soil: 'Alluvial', climate: 'Semi-arid' },
  { state: 'Haryana', districts: ['Ambala','Yamunanagar','Kurukshetra','Kaithal','Karnal','Panipat','Sonepat','Rohtak','Jhajjar','Gurugram','Faridabad','Palwal','Nuh','Rewari','Mahendragarh','Bhiwani','Charkhi Dadri','Hisar','Fatehabad','Sirsa','Jind','Panchkula'], herbs: ['Ashwagandha','Shatavari','Tulsi','Brahmi','Amla','Aloe Vera'], soil: 'Alluvial', climate: 'Semi-arid continental' },
  { state: 'Uttar Pradesh', districts: ['Lucknow','Kanpur','Varanasi','Allahabad','Agra','Meerut','Bareilly','Moradabad','Gorakhpur','Faizabad','Sultanpur','Jaunpur','Azamgarh','Deoria','Basti','Gonda','Bahraich','Shravasti','Balrampur','Siddharthnagar','Maharajganj','Kushinagar','Mirzapur','Sonbhadra','Chandauli','Ghazipur','Ballia','Mau','Bhadohi','Jhansi','Lalitpur','Hamirpur','Banda','Chitrakoot','Mahoba','Pratapgarh','Amethi','Raebareli','Unnao','Hardoi','Sitapur','Lakhimpur Kheri','Shahjahanpur','Pilibhit','Budaun','Rampur','Amroha','Bijnor','Muzaffarnagar','Saharanpur','Shamli','Baghpat','Ghaziabad','Gautam Buddha Nagar','Bulandshahr','Aligarh','Hathras','Mathura','Etah','Kasganj','Mainpuri','Firozabad','Etawah','Auraiya','Farrukhabad','Kannauj','Fatehpur','Kaushambi'], herbs: ['Ashwagandha','Brahmi','Tulsi','Shatavari','Giloy','Amla','Safed Musli','Kalmegh'], soil: 'Alluvial', climate: 'Subtropical' },
  { state: 'Bihar', districts: ['Patna','Gaya','Nawada','Aurangabad','Jehanabad','Arwal','Nalanda','Sheikhpura','Lakhisarai','Jamui','Munger','Bhagalpur','Banka','Begusarai','Khagaria','Samastipur','Darbhanga','Madhubani','Sitamarhi','Sheohar','Muzaffarpur','Vaishali','Saran','Siwan','Gopalganj','East Champaran','West Champaran','Katihar','Purnia','Kishanganj','Araria','Supaul','Madhepura','Saharsa','Bhojpur','Buxar','Kaimur','Rohtas'], herbs: ['Brahmi','Tulsi','Ashwagandha','Shatavari','Kalmegh','Amla'], soil: 'Alluvial', climate: 'Subtropical humid' },
  { state: 'Meghalaya', districts: ['East Khasi Hills','West Khasi Hills','South West Khasi Hills','Ri Bhoi','East Jaintia Hills','West Jaintia Hills','East Garo Hills','West Garo Hills','South Garo Hills','North Garo Hills','South West Garo Hills'], herbs: ['Brahmi','Chirayata','Pipali','Tulsi','Bay Leaf','Cinnamon'], soil: 'Laterite', climate: 'Subtropical highland' },
  { state: 'Manipur', districts: ['Imphal East','Imphal West','Thoubal','Bishnupur','Churachandpur','Chandel','Ukhrul','Senapati','Tamenglong','Jiribam','Noney','Pherzawl','Tengnoupal','Kamjong','Kakching','Kangpokpi'], herbs: ['Brahmi','Tulsi','Neem','Pipali','Chirayata','Shatavari'], soil: 'Red hill soil', climate: 'Subtropical monsoon' },
  { state: 'Mizoram', districts: ['Aizawl','Lunglei','Champhai','Serchhip','Kolasib','Lawngtlai','Saiha','Mamit','Khawzawl','Hnahthial','Saitual'], herbs: ['Tulsi','Brahmi','Lemongrass','Aloe Vera','Pipali','Chirayata'], soil: 'Laterite', climate: 'Tropical monsoon' },
  { state: 'Nagaland', districts: ['Kohima','Dimapur','Mokokchung','Tuensang','Wokha','Zunheboto','Phek','Mon','Longleng','Kiphire','Peren','Noklak','Tseminyu','Niuland','Chumukedima','Shamator'], herbs: ['Chirayata','Brahmi','Tulsi','Neem','Aloe Vera','Pipali'], soil: 'Laterite', climate: 'Subtropical highland' },
  { state: 'Tripura', districts: ['West Tripura','South Tripura','North Tripura','Dhalai','Khowai','Sepahijala','Gomati','Unakoti'], herbs: ['Brahmi','Tulsi','Neem','Kalmegh','Pipali','Shatavari'], soil: 'Alluvial', climate: 'Tropical monsoon' },
  { state: 'Arunachal Pradesh', districts: ['Tawang','West Kameng','East Kameng','Papum Pare','Kurung Kumey','Lower Subansiri','Upper Subansiri','West Siang','East Siang','Upper Siang','Changlang','Tirap','Longding','Namsai','Lohit','Anjaw','Dibang Valley','Lower Dibang Valley','Kamle','Kra Daadi','Pakke Kessang','Lepa Rada','Shi Yomi','Siang'], herbs: ['Chirayata','Kutki','Pipali','Brahmi','Mishmi Teeta','Atis'], soil: 'Forest soil', climate: 'Alpine to subtropical' },
  { state: 'Sikkim', districts: ['East Sikkim','West Sikkim','North Sikkim','South Sikkim','Pakyong','Soreng'], herbs: ['Chirayata','Kutki','Jatamansi','Atis','Brahmi','Pipali'], soil: 'Mountain', climate: 'Temperate to alpine' },
  { state: 'Goa', districts: ['North Goa','South Goa'], herbs: ['Tulsi','Brahmi','Ashwagandha','Aloe Vera','Neem','Shatavari'], soil: 'Laterite', climate: 'Tropical monsoon' },
  { state: 'Jammu & Kashmir', districts: ['Srinagar','Budgam','Ganderbal','Bandipora','Baramulla','Kupwara','Anantnag','Kulgam','Pulwama','Shopian','Jammu','Samba','Kathua','Udhampur','Reasi','Rajouri','Poonch','Doda','Kishtwar','Ramban'], herbs: ['Kesar (Saffron)','Kutki','Jatamansi','Brahmi','Chirayata','Aconite'], soil: 'Mountain alluvial', climate: 'Temperate to alpine' },
  { state: 'Ladakh', districts: ['Leh','Kargil'], herbs: ['Sea Buckthorn','Arjun','Kutki','Ephedra','Rhodiola'], soil: 'Cold desert', climate: 'Cold arid' },
];

const certLevels = ['Grade A+', 'Grade A', 'Premium', 'Premium+', 'Grade B+', 'Grade A'];
const zoneNames = ['Northern Zone', 'Southern Zone', 'Eastern Block', 'Western Block', 'Central Area', 'Hill Range', 'Valley Region', 'Forest Reserve', 'Coastal Belt', 'Plateau Region', 'River Basin', 'Highland Area'];

function generateRegions() {
  const regions = [];
  let id = 1;
  for (const st of stateData) {
    for (const dist of st.districts) {
      const zoneCount = Math.min(3, Math.max(1, Math.ceil(Math.random() * 2)));
      for (let z = 0; z < zoneCount; z++) {
        const zone = zoneNames[Math.floor(Math.random() * zoneNames.length)];
        const herbCount = 2 + Math.floor(Math.random() * 3);
        const selectedHerbs = [];
        const herbPool = [...st.herbs];
        for (let h = 0; h < herbCount && herbPool.length > 0; h++) {
          const idx = Math.floor(Math.random() * herbPool.length);
          selectedHerbs.push(herbPool.splice(idx, 1)[0]);
        }
        regions.push({
          id: id++,
          name: `${dist} ${zone}`,
          state: st.state,
          district: dist,
          coordinates: [20 + Math.random() * 15, 70 + Math.random() * 20],
          approvedHerbs: selectedHerbs,
          certificationLevel: certLevels[Math.floor(Math.random() * certLevels.length)],
          soilType: st.soil,
          climate: st.climate,
          totalArea: `${(500 + Math.floor(Math.random() * 4500)).toLocaleString()} ha`
        });
      }
    }
  }
  return regions;
}

export const approvedRegions = generateRegions();

export const systemComponents = [
  { id: 'blockchain', tabId: 'blockchain', name: 'Blockchain Core', nameHi: 'ब्लॉकचेन कोर', icon: Database, color: 'blue', description: 'Immutable ledger for herb traceability', descHi: 'जड़ी-बूटी ट्रेसेबिलिटी के लिए अपरिवर्तनीय बहीखाता', features: ['Smart Contracts', 'Transaction History', 'Consensus Mechanism'], featuresHi: ['स्मार्ट कॉन्ट्रैक्ट', 'लेनदेन इतिहास', 'सहमति तंत्र'], status: 'Active' },
  { id: 'ai-auth', tabId: 'ai-auth', name: 'AI Authentication', nameHi: 'एआई प्रमाणीकरण', icon: Brain, color: 'purple', description: 'Machine learning powered herb verification', descHi: 'मशीन लर्निंग संचालित जड़ी-बूटी सत्यापन', features: ['Image Recognition', 'Chemical Analysis', 'Fraud Detection'], featuresHi: ['छवि पहचान', 'रासायनिक विश्लेषण', 'धोखाधड़ी का पता'], status: 'Active' },
  { id: 'rfid-nfc', tabId: 'tracking', name: 'RFID/NFC Tracking', nameHi: 'आरएफआईडी/एनएफसी ट्रैकिंग', icon: Radio, color: 'green', description: 'Physical tagging and real-time tracking', descHi: 'भौतिक टैगिंग और वास्तविक समय ट्रैकिंग', features: ['RFID Tags', 'NFC Integration', 'GPS Tracking'], featuresHi: ['आरएफआईडी टैग', 'एनएफसी एकीकरण', 'जीपीएस ट्रैकिंग'], status: 'Active' },
  { id: 'storage', tabId: 'supply-chain', name: 'Decentralized Storage', nameHi: 'विकेंद्रीकृत भंडारण', icon: Globe, color: 'orange', description: 'Distributed data storage across nodes', descHi: 'नोड्स पर वितरित डेटा भंडारण', features: ['IPFS Integration', 'Data Redundancy', 'Encrypted Storage'], featuresHi: ['आईपीएफएस एकीकरण', 'डेटा रिडंडेंसी', 'एन्क्रिप्टेड स्टोरेज'], status: 'Active' },
  { id: 'transparency', tabId: 'tokens', name: 'Consumer Transparency', nameHi: 'उपभोक्ता पारदर्शिता', icon: Eye, color: 'teal', description: 'Real-time supply chain visibility', descHi: 'वास्तविक समय आपूर्ति श्रृंखला दृश्यता', features: ['QR Code Scanning', 'Mobile App', 'Alert System'], featuresHi: ['क्यूआर कोड स्कैनिंग', 'मोबाइल ऐप', 'अलर्ट सिस्टम'], status: 'Active' },
  { id: 'tokens', tabId: 'recognition', name: 'Token Incentives', nameHi: 'टोकन प्रोत्साहन', icon: Coins, color: 'yellow', description: 'Blockchain-based reward system', descHi: 'ब्लॉकचेन-आधारित इनाम प्रणाली', features: ['Farmer Rewards', 'Quality Bonuses', 'Staking Mechanism'], featuresHi: ['किसान इनाम', 'गुणवत्ता बोनस', 'स्टेकिंग तंत्र'], status: 'Active' }
];

export const sampleHerbs = [
  {
    id: "ASH-KAR-001", name: "Ashwagandha", scientificName: "Withania somnifera", region: "Karnataka Western Ghats", farmer: "Ravi Kumar",
    farmerAddress: "0x742d...E02b", harvestDate: "2024-08-15", rfidTag: "RFID-A3F2-9B1C-4E7D-8A0F", nfcTag: "NFC-7C2E-3D4A-8F1B-6E9C", quality: "Premium A+",
    quantity: "500 kg", aiAuthenticated: true, tokenReward: 150, certifications: ["Organic", "GAP Certified", "AYUSH Approved"],
    supplyChainStages: [
      { stage: "Cultivation", completed: true, timestamp: "2024-07-01" },
      { stage: "Harvesting", completed: true, timestamp: "2024-08-15" },
      { stage: "Processing", completed: true, timestamp: "2024-08-20" },
      { stage: "Quality Testing", completed: true, timestamp: "2024-08-25" },
      { stage: "Transportation", completed: true, timestamp: "2024-08-28" },
      { stage: "Manufacturing", completed: true, timestamp: "2024-09-02" },
      { stage: "Distribution", completed: false, timestamp: null }
    ]
  },
  {
    id: "BRA-KER-002", name: "Brahmi", scientificName: "Bacopa monnieri", region: "Kerala Backwaters", farmer: "Lakshmi Nair",
    farmerAddress: "0x8e2f...E0a3", harvestDate: "2024-08-20", rfidTag: "RFID-B4E1-7A3F-2C8D-9B0E", nfcTag: "NFC-8D3F-4E5B-9A2C-7F0D", quality: "Premium",
    quantity: "300 kg", aiAuthenticated: true, tokenReward: 120, certifications: ["Organic", "Fair Trade"],
    supplyChainStages: [
      { stage: "Cultivation", completed: true, timestamp: "2024-06-15" },
      { stage: "Harvesting", completed: true, timestamp: "2024-08-20" },
      { stage: "Processing", completed: true, timestamp: "2024-08-22" },
      { stage: "Quality Testing", completed: false, timestamp: null },
      { stage: "Transportation", completed: false, timestamp: null }
    ]
  },
  {
    id: "TUL-TN-003", name: "Tulsi", scientificName: "Ocimum tenuiflorum", region: "Tamil Nadu Nilgiris", farmer: "Murugan Selvam",
    farmerAddress: "0x3c5a...B7d1", harvestDate: "2024-09-01", rfidTag: "RFID-C5D0-6B2E-1D9C-0A1F", nfcTag: "NFC-9E4A-5F6C-0B3D-8A1E", quality: "Grade A+",
    quantity: "200 kg", aiAuthenticated: true, tokenReward: 100, certifications: ["AYUSH Approved", "Organic"],
    supplyChainStages: [
      { stage: "Cultivation", completed: true, timestamp: "2024-07-15" },
      { stage: "Harvesting", completed: true, timestamp: "2024-09-01" },
      { stage: "Processing", completed: true, timestamp: "2024-09-04" },
      { stage: "Quality Testing", completed: true, timestamp: "2024-09-08" },
      { stage: "Transportation", completed: true, timestamp: "2024-09-12" },
      { stage: "Manufacturing", completed: false, timestamp: null },
      { stage: "Distribution", completed: false, timestamp: null }
    ]
  },
  {
    id: "TUR-MP-004", name: "Turmeric", scientificName: "Curcuma longa", region: "Madhya Pradesh Forests", farmer: "Anil Verma",
    farmerAddress: "0x9f4b...C2e8", harvestDate: "2024-07-10", rfidTag: "RFID-D6C1-5A3D-0E8B-2F9A", nfcTag: "NFC-0F5B-6A7D-1C4E-9B2F", quality: "Premium A+",
    quantity: "800 kg", aiAuthenticated: true, tokenReward: 220, certifications: ["Organic", "GAP Certified", "AYUSH Approved", "ISO 22000"],
    supplyChainStages: [
      { stage: "Cultivation", completed: true, timestamp: "2024-04-01" },
      { stage: "Harvesting", completed: true, timestamp: "2024-07-10" },
      { stage: "Processing", completed: true, timestamp: "2024-07-15" },
      { stage: "Quality Testing", completed: true, timestamp: "2024-07-20" },
      { stage: "Transportation", completed: true, timestamp: "2024-07-25" },
      { stage: "Manufacturing", completed: true, timestamp: "2024-08-01" },
      { stage: "Distribution", completed: true, timestamp: "2024-08-10" }
    ]
  },
  {
    id: "JAT-HP-005", name: "Jatamansi", scientificName: "Nardostachys jatamansi", region: "Himachal Pradesh Hills", farmer: "Deepak Thakur",
    farmerAddress: "0x1a7c...D5f3", harvestDate: "2024-09-15", rfidTag: "RFID-E7B0-4C2F-9D1A-3E8C", nfcTag: "NFC-1A6C-7B8E-2D5F-0C3A", quality: "Premium+",
    quantity: "150 kg", aiAuthenticated: true, tokenReward: 180, certifications: ["Premium+", "Wild Harvested", "AYUSH Approved"],
    supplyChainStages: [
      { stage: "Cultivation", completed: true, timestamp: "2024-05-01" },
      { stage: "Harvesting", completed: true, timestamp: "2024-09-15" },
      { stage: "Processing", completed: false, timestamp: null },
      { stage: "Quality Testing", completed: false, timestamp: null },
      { stage: "Transportation", completed: false, timestamp: null }
    ]
  },
  {
    id: "GIL-CG-006", name: "Giloy", scientificName: "Tinospora cordifolia", region: "Chhattisgarh Bastar", farmer: "Sunita Patel",
    farmerAddress: "0x4d8e...A1b6", harvestDate: "2024-08-05", rfidTag: "RFID-F8A1-3D5E-8C0B-4F7D", nfcTag: "NFC-2B7D-8C9F-3E6A-1D4B", quality: "Grade A",
    quantity: "400 kg", aiAuthenticated: true, tokenReward: 130, certifications: ["Organic", "Forest Certified"],
    supplyChainStages: [
      { stage: "Cultivation", completed: true, timestamp: "2024-05-20" },
      { stage: "Harvesting", completed: true, timestamp: "2024-08-05" },
      { stage: "Processing", completed: true, timestamp: "2024-08-10" },
      { stage: "Quality Testing", completed: true, timestamp: "2024-08-15" },
      { stage: "Transportation", completed: false, timestamp: null },
      { stage: "Manufacturing", completed: false, timestamp: null },
      { stage: "Distribution", completed: false, timestamp: null }
    ]
  }
];

export const sampleFarmers = [
  { id: 'F-001', name: 'Ravi Kumar', region: 'Karnataka Western Ghats', wallet: '0x742d...E02b', points: 1580, totalTokens: 1120, badges: ['Premium+ Quality', 'Organic Certified', 'On-time Delivery'], isCurrentUser: false },
  { id: 'F-002', name: 'Alok', region: 'Uttar Pradesh Lucknow', wallet: '0x6a3b...F9c2', points: 1520, totalTokens: 1080, badges: ['Blockchain Pioneer', 'AYUSH Certified', 'Top Contributor', 'Quality Champion'], isCurrentUser: true },
  { id: 'F-003', name: 'Lakshmi Nair', region: 'Kerala Backwaters', wallet: '0x8e2f...E0a3', points: 1460, totalTokens: 980, badges: ['Fair Trade', 'AYUSH Approved'], isCurrentUser: false },
  { id: 'F-004', name: 'Anil Verma', region: 'Madhya Pradesh Forests', wallet: '0x9f4b...C2e8', points: 1550, totalTokens: 1050, badges: ['Top Producer', 'ISO Certified', 'Organic Pioneer'], isCurrentUser: false },
  { id: 'F-005', name: 'Deepak Thakur', region: 'Himachal Pradesh Hills', wallet: '0x1a7c...D5f3', points: 1420, totalTokens: 920, badges: ['Premium+ Quality', 'Wild Harvested', 'Mountain Expert'], isCurrentUser: false },
  { id: 'F-006', name: 'Priya Devi', region: 'Uttarakhand Himalayas', wallet: '0x5e6f...G3h4', points: 1380, totalTokens: 890, badges: ['Women Farmer Leader', 'Quality Champion'], isCurrentUser: false },
  { id: 'F-007', name: 'Anita Sharma', region: 'Himachal Pradesh Hills', wallet: '0xA1b2...Ef12', points: 1325, totalTokens: 840, badges: ['Premium Quality', 'Cold Chain Maintainer'], isCurrentUser: false },
  { id: 'F-008', name: 'Suresh Patel', region: 'Madhya Pradesh Forests', wallet: '0x9c1e...B4c5', points: 1210, totalTokens: 760, badges: ['Sustainable Farming', 'Innovation Bonus'], isCurrentUser: false },
  { id: 'F-009', name: 'Murugan Selvam', region: 'Tamil Nadu Nilgiris', wallet: '0x3c5a...B7d1', points: 1150, totalTokens: 720, badges: ['AYUSH Certified', 'Hill Farming Expert'], isCurrentUser: false },
  { id: 'F-010', name: 'Sunita Patel', region: 'Chhattisgarh Bastar', wallet: '0x4d8e...A1b6', points: 1080, totalTokens: 650, badges: ['Forest Certified', 'Tribal Heritage'], isCurrentUser: false },
  { id: 'F-011', name: 'Mahesh Yadav', region: 'Rajasthan Aravalli', wallet: '0xB2c3...1a2B', points: 990, totalTokens: 540, badges: ['Community Mentor'], isCurrentUser: false }
];
