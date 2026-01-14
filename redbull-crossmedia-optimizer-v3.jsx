import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// ============================================
// DATA CONFIGURATION
// ============================================

// Digital Platform Data
const DIGITAL_DATA = {
  YouTube: {
    Spend: 6509237,
    Impressions: 164310000,
    ATC: 10743,
    Searches: 164310,
    ReachPct: 41,
    Frequency: 3.2,
    CPM: 39.62,
  },
  JioHotstar: {
    Spend: 4365993,
    Impressions: 19832000,
    ATC: 1700,
    Searches: 19832,
    ReachPct: 3,
    Frequency: 2.8,
    CPM: 220.15,
  }
};

// TV Regional Data (aggregated)
const TV_REGIONAL_DATA = {
  AP: { Spend: 4315628, ATC: 916, Channels: 6, ReachPct: 19.4 },
  TN: { Spend: 5241481, ATC: 1114, Channels: 13, ReachPct: 19.8 },
  Kar: { Spend: 4960727, ATC: 1095, Channels: 10, ReachPct: 25.3 },
  Ker: { Spend: 1269724, ATC: 271, Channels: 6, ReachPct: 6.4 },
  WB: { Spend: 621534, ATC: 132, Channels: 2, ReachPct: 3.2 },
  HSM: { Spend: 22568349, ATC: 4784, Channels: 50, ReachPct: 56.8 },
  Sports: { Spend: 1824718, ATC: 389, Channels: 9, ReachPct: 8.6 },
  Others: { Spend: 1075780, ATC: 228, Channels: 12, ReachPct: 3.5 },
};

// TV Channel Data with varied impact scores
const TV_CHANNEL_DATA = [
  // AP Region
  {Channel:"gemini tv",Region:"AP",Genre:"entertainment",Spend:1719861,ReachPct:6.8,ATC:365,ImpactScore:89},
  {Channel:"gemini movies",Region:"AP",Genre:"movies",Spend:963660,ReachPct:4.2,ATC:204,ImpactScore:76},
  {Channel:"star maa",Region:"AP",Genre:"entertainment",Spend:772734,ReachPct:3.9,ATC:164,ImpactScore:82},
  {Channel:"zee cinemalu",Region:"AP",Genre:"movies",Spend:575991,ReachPct:2.8,ATC:122,ImpactScore:71},
  {Channel:"star maa movies",Region:"AP",Genre:"movies",Spend:266431,ReachPct:1.5,ATC:57,ImpactScore:65},
  {Channel:"star maa gold",Region:"AP",Genre:"movies",Spend:16951,ReachPct:0.2,ATC:4,ImpactScore:42},
  
  // TN Region
  {Channel:"jaya tv",Region:"TN",Genre:"entertainment",Spend:1107422,ReachPct:5.2,ATC:235,ImpactScore:85},
  {Channel:"star vijay",Region:"TN",Genre:"entertainment",Spend:1015875,ReachPct:4.8,ATC:216,ImpactScore:91},
  {Channel:"zee tamil",Region:"TN",Genre:"entertainment",Spend:836719,ReachPct:4.1,ATC:178,ImpactScore:78},
  {Channel:"star vijay super",Region:"TN",Genre:"movies",Spend:748625,ReachPct:3.5,ATC:159,ImpactScore:74},
  {Channel:"colors tamil",Region:"TN",Genre:"entertainment",Spend:367376,ReachPct:1.8,ATC:78,ImpactScore:68},
  {Channel:"sun tv",Region:"TN",Genre:"entertainment",Spend:257157,ReachPct:1.4,ATC:55,ImpactScore:72},
  {Channel:"sirippoli",Region:"TN",Genre:"comedy",Spend:303837,ReachPct:1.6,ATC:64,ImpactScore:58},
  {Channel:"kalaignar tv",Region:"TN",Genre:"entertainment",Spend:202997,ReachPct:1.2,ATC:43,ImpactScore:63},
  {Channel:"sun music",Region:"TN",Genre:"music",Spend:92240,ReachPct:0.5,ATC:20,ImpactScore:45},
  
  // Kar Region
  {Channel:"colors kannada cinema",Region:"Kar",Genre:"movies",Spend:1817148,ReachPct:8.5,ATC:386,ImpactScore:94},
  {Channel:"zee kannada",Region:"Kar",Genre:"entertainment",Spend:789272,ReachPct:4.1,ATC:167,ImpactScore:79},
  {Channel:"udaya tv",Region:"Kar",Genre:"entertainment",Spend:719590,ReachPct:3.6,ATC:153,ImpactScore:75},
  {Channel:"star suvarna",Region:"Kar",Genre:"entertainment",Spend:665438,ReachPct:3.2,ATC:141,ImpactScore:81},
  {Channel:"udaya movies",Region:"Kar",Genre:"movies",Spend:359400,ReachPct:1.8,ATC:76,ImpactScore:66},
  {Channel:"colors kannada",Region:"Kar",Genre:"entertainment",Spend:300993,ReachPct:1.5,ATC:64,ImpactScore:70},
  
  // Ker Region
  {Channel:"flowers tv",Region:"Ker",Genre:"entertainment",Spend:411390,ReachPct:2.1,ATC:87,ImpactScore:77},
  {Channel:"asianet",Region:"Ker",Genre:"entertainment",Spend:275891,ReachPct:1.4,ATC:59,ImpactScore:83},
  {Channel:"asianet movies",Region:"Ker",Genre:"movies",Spend:200401,ReachPct:1.0,ATC:43,ImpactScore:69},
  {Channel:"zee keralam",Region:"Ker",Genre:"entertainment",Spend:157509,ReachPct:0.8,ATC:33,ImpactScore:62},
  
  // WB Region
  {Channel:"star jalsha",Region:"WB",Genre:"entertainment",Spend:544467,ReachPct:2.8,ATC:116,ImpactScore:86},
  {Channel:"zee bangla",Region:"WB",Genre:"entertainment",Spend:77067,ReachPct:0.4,ATC:16,ImpactScore:54},
  
  // HSM Region
  {Channel:"sony entertainment television",Region:"HSM",Genre:"entertainment",Spend:2579063,ReachPct:10.2,ATC:547,ImpactScore:95},
  {Channel:"b4u kadak",Region:"HSM",Genre:"movies",Spend:1624836,ReachPct:6.8,ATC:345,ImpactScore:88},
  {Channel:"star plus",Region:"HSM",Genre:"entertainment",Spend:1531254,ReachPct:6.5,ATC:325,ImpactScore:92},
  {Channel:"zee tv",Region:"HSM",Genre:"entertainment",Spend:1452162,ReachPct:6.2,ATC:308,ImpactScore:87},
  {Channel:"star bharat",Region:"HSM",Genre:"entertainment",Spend:1102248,ReachPct:4.8,ATC:234,ImpactScore:79},
  {Channel:"dangal",Region:"HSM",Genre:"entertainment",Spend:1069408,ReachPct:4.6,ATC:227,ImpactScore:84},
  {Channel:"b4u movies",Region:"HSM",Genre:"movies",Spend:951774,ReachPct:4.2,ATC:202,ImpactScore:76},
  {Channel:"star gold",Region:"HSM",Genre:"movies",Spend:754775,ReachPct:3.4,ATC:160,ImpactScore:81},
  {Channel:"9xm",Region:"HSM",Genre:"music",Spend:737196,ReachPct:3.3,ATC:156,ImpactScore:52},
  {Channel:"star gold 2",Region:"HSM",Genre:"movies",Spend:734165,ReachPct:3.2,ATC:156,ImpactScore:73},
  {Channel:"b4u music",Region:"HSM",Genre:"music",Spend:646370,ReachPct:2.9,ATC:137,ImpactScore:48},
  {Channel:"colors",Region:"HSM",Genre:"entertainment",Spend:591065,ReachPct:2.6,ATC:125,ImpactScore:85},
  {Channel:"colors rishtey",Region:"HSM",Genre:"entertainment",Spend:578276,ReachPct:2.5,ATC:123,ImpactScore:67},
  {Channel:"big magic",Region:"HSM",Genre:"entertainment",Spend:561401,ReachPct:2.4,ATC:119,ImpactScore:59},
  {Channel:"colors cineplex",Region:"HSM",Genre:"movies",Spend:556186,ReachPct:2.4,ATC:118,ImpactScore:64},
  {Channel:"sony pal",Region:"HSM",Genre:"entertainment",Spend:489461,ReachPct:2.1,ATC:104,ImpactScore:71},
  {Channel:"mastiii",Region:"HSM",Genre:"music",Spend:487078,ReachPct:2.1,ATC:103,ImpactScore:44},
  {Channel:"zing",Region:"HSM",Genre:"entertainment",Spend:448749,ReachPct:1.9,ATC:95,ImpactScore:56},
  {Channel:"manoranjan tv",Region:"HSM",Genre:"movies",Spend:447560,ReachPct:1.9,ATC:95,ImpactScore:61},
  {Channel:"star utsav",Region:"HSM",Genre:"entertainment",Spend:413334,ReachPct:1.8,ATC:88,ImpactScore:68},
  {Channel:"&tv",Region:"HSM",Genre:"entertainment",Spend:401167,ReachPct:1.7,ATC:85,ImpactScore:66},
  {Channel:"sony sab",Region:"HSM",Genre:"entertainment",Spend:317646,ReachPct:1.4,ATC:67,ImpactScore:74},
  {Channel:"zee cinema",Region:"HSM",Genre:"movies",Spend:301149,ReachPct:1.3,ATC:64,ImpactScore:69},
  {Channel:"goldmines",Region:"HSM",Genre:"movies",Spend:283862,ReachPct:1.2,ATC:60,ImpactScore:57},
  
  // Sports
  {Channel:"star sports 3",Region:"Sports",Genre:"sports",Spend:358050,ReachPct:1.8,ATC:76,ImpactScore:62},
  {Channel:"star sports 2 hd",Region:"Sports",Genre:"sports",Spend:263696,ReachPct:1.4,ATC:56,ImpactScore:58},
  {Channel:"star sports 1 hindi",Region:"Sports",Genre:"sports",Spend:252474,ReachPct:1.3,ATC:54,ImpactScore:65},
  {Channel:"dd sports",Region:"Sports",Genre:"sports",Spend:168748,ReachPct:0.9,ATC:36,ImpactScore:51},
  {Channel:"star sports 1 tamil",Region:"Sports",Genre:"sports",Spend:193565,ReachPct:1.0,ATC:41,ImpactScore:59},
  {Channel:"star sports 1 telugu",Region:"Sports",Genre:"sports",Spend:184438,ReachPct:0.9,ATC:39,ImpactScore:57},
  {Channel:"star sports 1 kannada",Region:"Sports",Genre:"sports",Spend:173565,ReachPct:0.8,ATC:37,ImpactScore:55},
  {Channel:"star sports first",Region:"Sports",Genre:"sports",Spend:135767,ReachPct:0.7,ATC:29,ImpactScore:52},
  {Channel:"star sports 1 hd",Region:"Sports",Genre:"sports",Spend:94385,ReachPct:0.5,ATC:20,ImpactScore:48},
  
  // Others (Marathi, Punjabi, Odisha, NE, etc.)
  {Channel:"zee marathi",Region:"Others",Genre:"entertainment",Spend:214211,ReachPct:1.1,ATC:45,ImpactScore:72},
  {Channel:"star pravah",Region:"Others",Genre:"entertainment",Spend:187162,ReachPct:0.9,ATC:40,ImpactScore:68},
  {Channel:"colors marathi",Region:"Others",Genre:"entertainment",Spend:156890,ReachPct:0.8,ATC:33,ImpactScore:65},
  {Channel:"zee sarthak",Region:"Others",Genre:"entertainment",Spend:139501,ReachPct:0.7,ATC:30,ImpactScore:63},
  {Channel:"tarang tv",Region:"Others",Genre:"entertainment",Spend:98760,ReachPct:0.5,ATC:21,ImpactScore:58},
  {Channel:"colors odia",Region:"Others",Genre:"entertainment",Spend:72340,ReachPct:0.4,ATC:15,ImpactScore:54},
  {Channel:"ptc punjabi",Region:"Others",Genre:"entertainment",Spend:65142,ReachPct:0.3,ATC:14,ImpactScore:56},
  {Channel:"ptc punjabi gold",Region:"Others",Genre:"movies",Spend:52373,ReachPct:0.3,ATC:11,ImpactScore:52},
  {Channel:"zee punjabi",Region:"Others",Genre:"entertainment",Spend:35545,ReachPct:0.2,ATC:8,ImpactScore:49},
  {Channel:"rengoni",Region:"Others",Genre:"entertainment",Spend:27396,ReachPct:0.1,ATC:6,ImpactScore:47},
  {Channel:"rang",Region:"Others",Genre:"entertainment",Spend:18260,ReachPct:0.1,ATC:4,ImpactScore:44},
  {Channel:"ramdhenu",Region:"Others",Genre:"entertainment",Spend:8200,ReachPct:0.05,ATC:2,ImpactScore:38},
];

// Colors
const PIE_COLORS = ['#6366f1', '#10b981', '#f97316', '#06b6d4', '#ec4899', '#8b5cf6', '#eab308', '#f43f5e'];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(value) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
}

function formatNumber(value) {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
}

function formatPct(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

// Impact Score styling
function getImpactScoreStyle(score) {
  if (score >= 85) return { color: 'text-emerald-600', bg: 'bg-emerald-500' };
  if (score >= 70) return { color: 'text-cyan-600', bg: 'bg-cyan-500' };
  if (score >= 55) return { color: 'text-amber-600', bg: 'bg-amber-500' };
  return { color: 'text-rose-600', bg: 'bg-rose-500' };
}

// ============================================
// COMPONENTS
// ============================================

// Labeled Slider Component
function LabeledSlider({ label, value, onChange, min, max, color = 'orange', leftLabel, rightLabel }) {
  const colorClasses = {
    orange: 'accent-orange-500',
    cyan: 'accent-cyan-500',
    indigo: 'accent-indigo-500',
    emerald: 'accent-emerald-500',
    red: 'accent-red-500',
    blue: 'accent-blue-500',
  };
  const textColors = {
    orange: 'text-orange-600',
    cyan: 'text-cyan-600',
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className={`text-sm font-bold ${textColors[color]}`}>{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${colorClasses[color]}`}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400">{leftLabel}</span>
        <span className="text-[10px] text-slate-400">{rightLabel}</span>
      </div>
    </div>
  );
}

// Impact Score Bar
function ImpactScoreBar({ score }) {
  const style = getImpactScoreStyle(score);
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full ${style.bg} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold ${style.color} w-6`}>{score}</span>
    </div>
  );
}

// Mini Metric
function MiniMetric({ label, value, change, small = false }) {
  return (
    <div className={small ? 'text-center' : ''}>
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className={`font-bold text-slate-800 ${small ? 'text-sm' : 'text-lg'}`}>{value}</p>
      {change !== undefined && (
        <p className={`text-[10px] font-semibold ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </p>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function RedBullCrossMediaOptimizer() {
  // State
  const [tvDigitalSplit, setTvDigitalSplit] = useState(79);
  const [ytJhsSplit, setYtJhsSplit] = useState(60);
  const [selectedTVRegion, setSelectedTVRegion] = useState('HSM');
  const [tvIntensity, setTvIntensity] = useState(15);
  const [tvThreshold, setTvThreshold] = useState(70);
  const [hasOptimized, setHasOptimized] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Baseline calculations
  const baselineMetrics = useMemo(() => {
    const tvSpend = Object.values(TV_REGIONAL_DATA).reduce((s, r) => s + r.Spend, 0);
    const tvATC = Object.values(TV_REGIONAL_DATA).reduce((s, r) => s + r.ATC, 0);
    const digitalSpend = DIGITAL_DATA.YouTube.Spend + DIGITAL_DATA.JioHotstar.Spend;
    const digitalATC = DIGITAL_DATA.YouTube.ATC + DIGITAL_DATA.JioHotstar.ATC;
    
    return {
      tv: { spend: tvSpend, atc: tvATC },
      digital: { spend: digitalSpend, atc: digitalATC },
      youtube: DIGITAL_DATA.YouTube,
      jiohotstar: DIGITAL_DATA.JioHotstar,
      total: { spend: tvSpend + digitalSpend, atc: tvATC + digitalATC },
      tvPct: (tvSpend / (tvSpend + digitalSpend)) * 100,
      digitalPct: (digitalSpend / (tvSpend + digitalSpend)) * 100,
      ytPct: (DIGITAL_DATA.YouTube.Spend / digitalSpend) * 100,
    };
  }, []);
  
  // Optimized calculations
  const optimizedMetrics = useMemo(() => {
    if (!hasOptimized) return null;
    
    const totalBudget = baselineMetrics.total.spend;
    const newTVBudget = totalBudget * (tvDigitalSplit / 100);
    const newDigitalBudget = totalBudget * ((100 - tvDigitalSplit) / 100);
    const newYTBudget = newDigitalBudget * (ytJhsSplit / 100);
    const newJHSBudget = newDigitalBudget * ((100 - ytJhsSplit) / 100);
    
    const calcATC = (baseATC, multiplier, saturation = 0.75) => {
      if (multiplier > 1) return Math.round(baseATC * Math.pow(multiplier, saturation));
      return Math.round(baseATC * multiplier);
    };
    
    const ytMultiplier = newYTBudget / baselineMetrics.youtube.Spend;
    const jhsMultiplier = newJHSBudget / baselineMetrics.jiohotstar.Spend;
    const newYTATC = calcATC(baselineMetrics.youtube.ATC, ytMultiplier, 0.78);
    const newJHSATC = calcATC(baselineMetrics.jiohotstar.ATC, jhsMultiplier, 0.72);
    const newDigitalATC = newYTATC + newJHSATC;
    
    // TV Regional - CONSISTENT: Same % change for all regions as overall TV
    const tvMultiplier = newTVBudget / baselineMetrics.tv.spend;
    const intensity = tvIntensity / 100;
    const optimizedRegions = {};
    let totalOptimizedTVATC = 0;
    
    // All regions get the SAME percentage change as overall TV budget
    Object.entries(TV_REGIONAL_DATA).forEach(([region, data]) => {
      const newRegionSpend = data.Spend * tvMultiplier;
      const newRegionATC = calcATC(data.ATC, tvMultiplier, 0.70);
      
      optimizedRegions[region] = {
        ...data,
        newSpend: newRegionSpend,
        newATC: newRegionATC,
        spendChange: ((newRegionSpend - data.Spend) / data.Spend) * 100,
        atcChange: ((newRegionATC - data.ATC) / data.ATC) * 100,
      };
      
      totalOptimizedTVATC += newRegionATC;
    });
    
    // Channel optimization - CONSISTENT with regional change
    // All channels in a region get the base regional % change
    // Then intensity determines how much reallocation happens WITHIN the region
    const optimizedChannels = TV_CHANNEL_DATA.map(channel => {
      const regionOpt = optimizedRegions[channel.Region];
      if (!regionOpt) return { ...channel, newSpend: channel.Spend, newATC: channel.ATC, status: 'MAINTAIN', spendChange: 0, atcChange: 0 };
      
      // Base multiplier = same as region (consistent!)
      const baseMultiplier = regionOpt.newSpend / TV_REGIONAL_DATA[channel.Region].Spend;
      
      // Within-region reallocation based on intensity and impact score
      // High impact gets slight boost, low impact gets slight reduction
      // This is RELATIVE adjustment, the region total stays the same
      const avgImpact = 70; // baseline
      const impactDelta = (channel.ImpactScore - avgImpact) / 100;
      const reallocationFactor = 1 + (intensity * impactDelta * 0.5); // max ±7.5% adjustment at 15% intensity
      
      const channelMultiplier = baseMultiplier * reallocationFactor;
      const newSpend = channel.Spend * channelMultiplier;
      const newATC = calcATC(channel.ATC, channelMultiplier, 0.72);
      const spendChange = ((newSpend - channel.Spend) / channel.Spend) * 100;
      const atcChange = channel.ATC > 0 ? ((newATC - channel.ATC) / channel.ATC) * 100 : 0;
      
      // STATUS IS DETERMINED BY ACTUAL SPEND CHANGE
      let status = 'MAINTAIN';
      if (spendChange > 1) {
        status = 'INCREASE';
      } else if (spendChange < -1) {
        status = 'DECREASE';
      }
      
      // If MAINTAIN (change within ±1%), keep original values exactly
      if (status === 'MAINTAIN') {
        return {
          ...channel,
          newSpend: channel.Spend,
          newATC: channel.ATC,
          spendChange: 0,
          atcChange: 0,
          threshold: channel.ImpactScore >= 70 ? 'High' : 'Low',
          status,
        };
      }
      
      return {
        ...channel,
        newSpend,
        newATC,
        spendChange,
        atcChange,
        threshold: channel.ImpactScore >= 70 ? 'High' : 'Low',
        status,
      };
    });
    
    const newTotalATC = totalOptimizedTVATC + newDigitalATC;
    
    return {
      tv: {
        spend: newTVBudget,
        atc: totalOptimizedTVATC,
        spendChange: ((newTVBudget - baselineMetrics.tv.spend) / baselineMetrics.tv.spend) * 100,
        atcChange: ((totalOptimizedTVATC - baselineMetrics.tv.atc) / baselineMetrics.tv.atc) * 100,
      },
      digital: {
        spend: newDigitalBudget,
        atc: newDigitalATC,
        spendChange: ((newDigitalBudget - baselineMetrics.digital.spend) / baselineMetrics.digital.spend) * 100,
        atcChange: ((newDigitalATC - baselineMetrics.digital.atc) / baselineMetrics.digital.atc) * 100,
      },
      youtube: {
        spend: newYTBudget,
        atc: newYTATC,
        spendChange: ((newYTBudget - baselineMetrics.youtube.Spend) / baselineMetrics.youtube.Spend) * 100,
        atcChange: ((newYTATC - baselineMetrics.youtube.ATC) / baselineMetrics.youtube.ATC) * 100,
      },
      jiohotstar: {
        spend: newJHSBudget,
        atc: newJHSATC,
        spendChange: ((newJHSBudget - baselineMetrics.jiohotstar.Spend) / baselineMetrics.jiohotstar.Spend) * 100,
        atcChange: ((newJHSATC - baselineMetrics.jiohotstar.ATC) / baselineMetrics.jiohotstar.ATC) * 100,
      },
      regions: optimizedRegions,
      channels: optimizedChannels,
      total: {
        spend: totalBudget,
        atc: newTotalATC,
        atcLift: ((newTotalATC - baselineMetrics.total.atc) / baselineMetrics.total.atc) * 100,
        atcGain: newTotalATC - baselineMetrics.total.atc,
      }
    };
  }, [hasOptimized, baselineMetrics, tvDigitalSplit, ytJhsSplit, tvIntensity, tvThreshold]);
  
  const regionChannels = useMemo(() => {
    if (!optimizedMetrics) {
      return TV_CHANNEL_DATA.filter(c => c.Region === selectedTVRegion);
    }
    return optimizedMetrics.channels.filter(c => c.Region === selectedTVRegion);
  }, [selectedTVRegion, optimizedMetrics]);
  
  // Summary pie data
  const summaryPieData = useMemo(() => {
    if (hasOptimized && optimizedMetrics) {
      return [
        { name: 'TV', value: optimizedMetrics.tv.spend, color: '#6366f1' },
        { name: 'YouTube', value: optimizedMetrics.youtube.spend, color: '#ef4444' },
        { name: 'JioHotstar', value: optimizedMetrics.jiohotstar.spend, color: '#3b82f6' },
      ];
    }
    return [
      { name: 'TV', value: baselineMetrics.tv.spend, color: '#6366f1' },
      { name: 'YouTube', value: baselineMetrics.youtube.Spend, color: '#ef4444' },
      { name: 'JioHotstar', value: baselineMetrics.jiohotstar.Spend, color: '#3b82f6' },
    ];
  }, [hasOptimized, optimizedMetrics, baselineMetrics]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Cross-Media Campaign Optimizer</h1>
            <p className="text-slate-400 text-xs">Red Bull • TV + Digital Attribution</p>
          </div>
          <div className="flex items-center gap-4">
            {hasOptimized && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">Optimized</span>
              </div>
            )}
            <div className="text-xs text-slate-400">
              <span>WPP</span> + <span className="text-emerald-400 font-semibold">SYNC</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            {[
              { id: 'summary', label: '📊 Summary' },
              { id: 'digital', label: '🌐 Digital' },
              { id: 'tv', label: '📺 TV' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setHasOptimized(!hasOptimized)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow ${
              hasOptimized
                ? 'bg-slate-600 hover:bg-slate-700'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
            }`}
          >
            {hasOptimized ? '↺ Reset' : '⚡ Run Optimization'}
          </button>
        </div>
        
        {/* ============================================ */}
        {/* TAB: SUMMARY - COMPACT LAYOUT */}
        {/* ============================================ */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            {/* Impact Banner */}
            {hasOptimized && optimizedMetrics && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-xs uppercase">Optimization Impact</p>
                    <p className="text-3xl font-bold">+{optimizedMetrics.total.atcLift.toFixed(1)}% ATC</p>
                    <p className="text-emerald-100 text-sm">+{optimizedMetrics.total.atcGain.toLocaleString()} incremental</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-100 text-xs">Budget Neutral</p>
                    <p className="text-xl font-bold">{formatCurrency(baselineMetrics.total.spend)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main Content - Controls Left, Summary Right */}
            <div className="grid grid-cols-12 gap-4">
              {/* LEFT: Controls */}
              <div className="col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-600 text-xs">⚙</span>
                  Optimization Controls
                </h3>
                
                {/* Platform Split */}
                <div className="mb-5 pb-4 border-b border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase mb-2 font-medium">Platform Budget</p>
                  <LabeledSlider
                    label="TV / Digital Split"
                    value={tvDigitalSplit}
                    onChange={(v) => { setTvDigitalSplit(v); if(hasOptimized) setHasOptimized(false); }}
                    min={50}
                    max={95}
                    color="indigo"
                    leftLabel={`Digital ${100-tvDigitalSplit}%`}
                    rightLabel={`TV ${tvDigitalSplit}%`}
                  />
                </div>
                
                {/* Digital Split */}
                <div className="mb-5 pb-4 border-b border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase mb-2 font-medium">Digital Budget</p>
                  <LabeledSlider
                    label="YouTube / JioHotstar Split"
                    value={ytJhsSplit}
                    onChange={(v) => { setYtJhsSplit(v); if(hasOptimized) setHasOptimized(false); }}
                    min={30}
                    max={90}
                    color="red"
                    leftLabel={`JHS ${100-ytJhsSplit}%`}
                    rightLabel={`YT ${ytJhsSplit}%`}
                  />
                </div>
                
                {/* TV Controls */}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase mb-2 font-medium">TV Channel Optimization</p>
                  <LabeledSlider
                    label="Optimization Intensity"
                    value={tvIntensity}
                    onChange={(v) => { setTvIntensity(v); if(hasOptimized) setHasOptimized(false); }}
                    min={5}
                    max={30}
                    color="orange"
                    leftLabel="Conservative"
                    rightLabel="Aggressive"
                  />
                  <LabeledSlider
                    label="Protection Threshold"
                    value={tvThreshold}
                    onChange={(v) => { setTvThreshold(v); if(hasOptimized) setHasOptimized(false); }}
                    min={50}
                    max={90}
                    color="cyan"
                    leftLabel="Fewer Protected"
                    rightLabel="More Protected"
                  />
                </div>
              </div>
              
              {/* RIGHT: Summary */}
              <div className="col-span-7 space-y-4">
                {/* Platform Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {/* TV */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600">📺</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Television</p>
                        <p className="text-[10px] text-slate-400">108 channels</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <MiniMetric 
                        label="Spend" 
                        value={formatCurrency(hasOptimized ? optimizedMetrics.tv.spend : baselineMetrics.tv.spend)}
                        change={hasOptimized ? optimizedMetrics.tv.spendChange : undefined}
                      />
                      <MiniMetric 
                        label="ATC" 
                        value={formatNumber(hasOptimized ? optimizedMetrics.tv.atc : baselineMetrics.tv.atc)}
                        change={hasOptimized ? optimizedMetrics.tv.atcChange : undefined}
                      />
                    </div>
                  </div>
                  
                  {/* YouTube */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <span className="text-red-600">▶</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">YouTube</p>
                        <p className="text-[10px] text-slate-400">Digital</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <MiniMetric 
                        label="Spend" 
                        value={formatCurrency(hasOptimized ? optimizedMetrics.youtube.spend : baselineMetrics.youtube.Spend)}
                        change={hasOptimized ? optimizedMetrics.youtube.spendChange : undefined}
                      />
                      <MiniMetric 
                        label="ATC" 
                        value={formatNumber(hasOptimized ? optimizedMetrics.youtube.atc : baselineMetrics.youtube.ATC)}
                        change={hasOptimized ? optimizedMetrics.youtube.atcChange : undefined}
                      />
                    </div>
                  </div>
                  
                  {/* JioHotstar */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600">⭐</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">JioHotstar</p>
                        <p className="text-[10px] text-slate-400">Digital</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <MiniMetric 
                        label="Spend" 
                        value={formatCurrency(hasOptimized ? optimizedMetrics.jiohotstar.spend : baselineMetrics.jiohotstar.Spend)}
                        change={hasOptimized ? optimizedMetrics.jiohotstar.spendChange : undefined}
                      />
                      <MiniMetric 
                        label="ATC" 
                        value={formatNumber(hasOptimized ? optimizedMetrics.jiohotstar.atc : baselineMetrics.jiohotstar.ATC)}
                        change={hasOptimized ? optimizedMetrics.jiohotstar.atcChange : undefined}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Budget Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="text-xs font-semibold text-slate-700 mb-3">Budget Distribution</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={summaryPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={50}
                            dataKey="value"
                          >
                            {summaryPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      {summaryPieData.map((item, i) => {
                        const total = summaryPieData.reduce((s, d) => s + d.value, 0);
                        const pct = ((item.value / total) * 100).toFixed(1);
                        return (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                              <span className="text-xs text-slate-600">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold text-slate-800">{formatCurrency(item.value)}</span>
                              <span className="text-[10px] text-slate-400 ml-2">({pct}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Totals */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800 rounded-xl p-3 text-white text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Total Spend</p>
                    <p className="text-lg font-bold">{formatCurrency(baselineMetrics.total.spend)}</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-3 text-white text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Baseline ATC</p>
                    <p className="text-lg font-bold">{formatNumber(baselineMetrics.total.atc)}</p>
                  </div>
                  <div className={`rounded-xl p-3 text-white text-center ${hasOptimized ? 'bg-emerald-600' : 'bg-slate-600'}`}>
                    <p className="text-[10px] text-emerald-200 uppercase">Optimized ATC</p>
                    <p className="text-lg font-bold">
                      {hasOptimized ? formatNumber(optimizedMetrics.total.atc) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ============================================ */}
        {/* TAB: DIGITAL - Simplified */}
        {/* ============================================ */}
        {activeTab === 'digital' && (
          <div className="space-y-4">
            {!hasOptimized && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                <span className="text-amber-500">⚠️</span>
                <p className="text-amber-800 text-xs">Run optimization from Summary tab to see changes.</p>
              </div>
            )}
            
            {/* Digital Summary */}
            <div className="grid grid-cols-2 gap-4">
              {/* YouTube */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">▶️</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">YouTube</h3>
                      <p className="text-red-200 text-[10px]">High efficiency platform</p>
                    </div>
                  </div>
                  {hasOptimized && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      optimizedMetrics.youtube.spendChange >= 0 ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {optimizedMetrics.youtube.spendChange >= 0 ? '↑' : '↓'} {Math.abs(optimizedMetrics.youtube.spendChange).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Spend</p>
                      <p className="text-xl font-bold text-slate-800">
                        {formatCurrency(hasOptimized ? optimizedMetrics.youtube.spend : baselineMetrics.youtube.Spend)}
                      </p>
                      {hasOptimized && (
                        <p className="text-[10px] text-slate-400">was {formatCurrency(baselineMetrics.youtube.Spend)}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">ATC</p>
                      <p className="text-xl font-bold text-slate-800">
                        {formatNumber(hasOptimized ? optimizedMetrics.youtube.atc : baselineMetrics.youtube.ATC)}
                      </p>
                      {hasOptimized && (
                        <p className={`text-[10px] font-medium ${optimizedMetrics.youtube.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {optimizedMetrics.youtube.atcChange >= 0 ? '+' : ''}{optimizedMetrics.youtube.atcChange.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* JioHotstar */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">JioHotstar</h3>
                      <p className="text-blue-200 text-[10px]">Premium content</p>
                    </div>
                  </div>
                  {hasOptimized && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      optimizedMetrics.jiohotstar.spendChange >= 0 ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {optimizedMetrics.jiohotstar.spendChange >= 0 ? '↑' : '↓'} {Math.abs(optimizedMetrics.jiohotstar.spendChange).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Spend</p>
                      <p className="text-xl font-bold text-slate-800">
                        {formatCurrency(hasOptimized ? optimizedMetrics.jiohotstar.spend : baselineMetrics.jiohotstar.Spend)}
                      </p>
                      {hasOptimized && (
                        <p className="text-[10px] text-slate-400">was {formatCurrency(baselineMetrics.jiohotstar.Spend)}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">ATC</p>
                      <p className="text-xl font-bold text-slate-800">
                        {formatNumber(hasOptimized ? optimizedMetrics.jiohotstar.atc : baselineMetrics.jiohotstar.ATC)}
                      </p>
                      {hasOptimized && (
                        <p className={`text-[10px] font-medium ${optimizedMetrics.jiohotstar.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {optimizedMetrics.jiohotstar.atcChange >= 0 ? '+' : ''}{optimizedMetrics.jiohotstar.atcChange.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comparison Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800">Platform Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr className="text-slate-500 uppercase">
                      <th className="text-left py-2 px-4">Platform</th>
                      <th className="text-right py-2 px-4">Current Spend</th>
                      <th className="text-right py-2 px-4">Optimized</th>
                      <th className="text-right py-2 px-4">Δ Spend</th>
                      <th className="text-right py-2 px-4">Current ATC</th>
                      <th className="text-right py-2 px-4">Optimized</th>
                      <th className="text-right py-2 px-4">Δ ATC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-4 font-medium text-red-600">▶️ YouTube</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(baselineMetrics.youtube.Spend)}</td>
                      <td className="py-2 px-4 text-right font-medium">{hasOptimized ? formatCurrency(optimizedMetrics.youtube.spend) : '-'}</td>
                      <td className={`py-2 px-4 text-right font-semibold ${hasOptimized && optimizedMetrics.youtube.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {hasOptimized ? `${optimizedMetrics.youtube.spendChange >= 0 ? '+' : ''}${optimizedMetrics.youtube.spendChange.toFixed(1)}%` : '-'}
                      </td>
                      <td className="py-2 px-4 text-right">{formatNumber(baselineMetrics.youtube.ATC)}</td>
                      <td className="py-2 px-4 text-right font-medium">{hasOptimized ? formatNumber(optimizedMetrics.youtube.atc) : '-'}</td>
                      <td className={`py-2 px-4 text-right font-semibold ${hasOptimized && optimizedMetrics.youtube.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {hasOptimized ? `${optimizedMetrics.youtube.atcChange >= 0 ? '+' : ''}${optimizedMetrics.youtube.atcChange.toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-4 font-medium text-blue-600">⭐ JioHotstar</td>
                      <td className="py-2 px-4 text-right">{formatCurrency(baselineMetrics.jiohotstar.Spend)}</td>
                      <td className="py-2 px-4 text-right font-medium">{hasOptimized ? formatCurrency(optimizedMetrics.jiohotstar.spend) : '-'}</td>
                      <td className={`py-2 px-4 text-right font-semibold ${hasOptimized && optimizedMetrics.jiohotstar.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {hasOptimized ? `${optimizedMetrics.jiohotstar.spendChange >= 0 ? '+' : ''}${optimizedMetrics.jiohotstar.spendChange.toFixed(1)}%` : '-'}
                      </td>
                      <td className="py-2 px-4 text-right">{formatNumber(baselineMetrics.jiohotstar.ATC)}</td>
                      <td className="py-2 px-4 text-right font-medium">{hasOptimized ? formatNumber(optimizedMetrics.jiohotstar.atc) : '-'}</td>
                      <td className={`py-2 px-4 text-right font-semibold ${hasOptimized && optimizedMetrics.jiohotstar.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {hasOptimized ? `${optimizedMetrics.jiohotstar.atcChange >= 0 ? '+' : ''}${optimizedMetrics.jiohotstar.atcChange.toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Insight */}
            <div className="bg-slate-800 rounded-xl p-4 text-white">
              <h4 className="text-xs font-semibold mb-2">💡 Efficiency Insight</h4>
              <p className="text-slate-300 text-xs">
                YouTube delivers <span className="text-emerald-400 font-semibold">4.2x better efficiency</span> than JioHotstar 
                for ATC conversions. Optimal split balances efficiency with incremental reach.
              </p>
            </div>
          </div>
        )}
        
        {/* ============================================ */}
        {/* TAB: TV - Simplified */}
        {/* ============================================ */}
        {activeTab === 'tv' && (
          <div className="space-y-4">
            {!hasOptimized && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                <span className="text-amber-500">⚠️</span>
                <p className="text-amber-800 text-xs">Run optimization from Summary tab to see changes.</p>
              </div>
            )}
            
            {/* Region Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">TV Regional Performance</h3>
                <div className="flex gap-1">
                  {['HSM', 'AP', 'TN', 'Kar', 'Ker', 'WB', 'Sports', 'Others'].map(region => (
                    <button
                      key={region}
                      onClick={() => setSelectedTVRegion(region)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                        selectedTVRegion === region
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Region KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-slate-500">Channels</p>
                  <p className="text-lg font-bold text-indigo-600">{regionChannels.length}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-slate-500">Spend</p>
                  <p className="text-sm font-bold text-slate-800">
                    {formatCurrency(hasOptimized && optimizedMetrics.regions[selectedTVRegion] 
                      ? optimizedMetrics.regions[selectedTVRegion].newSpend 
                      : TV_REGIONAL_DATA[selectedTVRegion]?.Spend || 0)}
                  </p>
                  {hasOptimized && optimizedMetrics.regions[selectedTVRegion] && (
                    <p className={`text-[10px] font-medium ${optimizedMetrics.regions[selectedTVRegion].spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {optimizedMetrics.regions[selectedTVRegion].spendChange >= 0 ? '+' : ''}{optimizedMetrics.regions[selectedTVRegion].spendChange.toFixed(1)}%
                    </p>
                  )}
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-slate-500">ATC</p>
                  <p className="text-sm font-bold text-emerald-600">
                    {formatNumber(hasOptimized && optimizedMetrics.regions[selectedTVRegion] 
                      ? optimizedMetrics.regions[selectedTVRegion].newATC 
                      : TV_REGIONAL_DATA[selectedTVRegion]?.ATC || 0)}
                  </p>
                  {hasOptimized && optimizedMetrics.regions[selectedTVRegion] && (
                    <p className={`text-[10px] font-medium ${optimizedMetrics.regions[selectedTVRegion].atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {optimizedMetrics.regions[selectedTVRegion].atcChange >= 0 ? '+' : ''}{optimizedMetrics.regions[selectedTVRegion].atcChange.toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* All Regions Table - Simplified (no efficiency) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800">All Regions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr className="text-slate-500 uppercase">
                      <th className="text-left py-2 px-4">Region</th>
                      <th className="text-right py-2 px-4">Channels</th>
                      <th className="text-right py-2 px-4">Current Spend</th>
                      <th className="text-right py-2 px-4">Optimized</th>
                      <th className="text-right py-2 px-4">Δ Spend</th>
                      <th className="text-right py-2 px-4">Δ ATC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(TV_REGIONAL_DATA).map(([region, data]) => {
                      const opt = hasOptimized ? optimizedMetrics.regions[region] : null;
                      return (
                        <tr 
                          key={region} 
                          className={`border-b border-slate-100 cursor-pointer ${
                            selectedTVRegion === region ? 'bg-indigo-50' : 'hover:bg-slate-50'
                          }`}
                          onClick={() => setSelectedTVRegion(region)}
                        >
                          <td className="py-2 px-4 font-medium">{region}</td>
                          <td className="py-2 px-4 text-right">{data.Channels}</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(data.Spend)}</td>
                          <td className="py-2 px-4 text-right font-medium">{opt ? formatCurrency(opt.newSpend) : '-'}</td>
                          <td className={`py-2 px-4 text-right font-semibold ${opt && opt.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {opt ? `${opt.spendChange >= 0 ? '+' : ''}${opt.spendChange.toFixed(1)}%` : '-'}
                          </td>
                          <td className={`py-2 px-4 text-right font-semibold ${opt && opt.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {opt ? `${opt.atcChange >= 0 ? '+' : ''}${opt.atcChange.toFixed(1)}%` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Channel Table - Fixed MAINTAIN logic */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">{selectedTVRegion} Channels</h3>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr className="text-slate-500 uppercase">
                      <th className="text-left py-2 px-3">Channel</th>
                      {hasOptimized && <th className="text-left py-2 px-3">Status</th>}
                      <th className="text-left py-2 px-3">Genre</th>
                      <th className="text-center py-2 px-3">Impact</th>
                      <th className="text-right py-2 px-3">Current Spend</th>
                      <th className="text-right py-2 px-3">{hasOptimized ? 'Optimized' : 'ATC'}</th>
                      {hasOptimized && <th className="text-right py-2 px-3">Δ</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {regionChannels.map((c, i) => {
                      // For MAINTAIN: show same values, no change column highlight
                      const showChange = hasOptimized && c.status !== 'MAINTAIN';
                      
                      return (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium capitalize text-slate-800">{c.Channel}</td>
                          {hasOptimized && (
                            <td className="py-2 px-3">
                              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                c.status === 'INCREASE' ? 'bg-emerald-100 text-emerald-700' :
                                c.status === 'DECREASE' ? 'bg-rose-100 text-rose-700' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {c.status === 'INCREASE' && '↑'}
                                {c.status === 'DECREASE' && '↓'}
                                {c.status === 'MAINTAIN' && '—'}
                                {c.status}
                              </span>
                            </td>
                          )}
                          <td className="py-2 px-3 text-slate-500 capitalize">{c.Genre}</td>
                          <td className="py-2 px-3">
                            <ImpactScoreBar score={c.ImpactScore} />
                          </td>
                          <td className="py-2 px-3 text-right text-slate-600">{formatCurrency(c.Spend)}</td>
                          <td className="py-2 px-3 text-right font-medium">
                            {hasOptimized 
                              ? formatCurrency(c.newSpend)
                              : c.ATC
                            }
                          </td>
                          {hasOptimized && (
                            <td className={`py-2 px-3 text-right font-semibold ${
                              showChange 
                                ? (c.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500')
                                : 'text-slate-400'
                            }`}>
                              {showChange 
                                ? `${c.spendChange >= 0 ? '+' : ''}${c.spendChange.toFixed(1)}%`
                                : '—'
                              }
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <footer className="text-center text-slate-400 text-[10px] py-4 mt-4">
          SYNC Cross-Media Attribution • Red Bull Campaign Optimizer v3.0 • January 2026
        </footer>
      </main>
    </div>
  );
}
