import type { DigitalData, TVRegionalData, TVChannel } from '@/types'

export const DIGITAL_DATA: DigitalData = {
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
}

// SYNC Media Performance Data (from attribution study)
// Budget comes from TV reduction, shown in Digital section
export const SYNC_SCENARIOS = [
  { spend: 14000000, atc: 35700, costPerATC: 365, ytATC: 14900, jhsATC: 2400 }, // ₹1.40 Cr
  { spend: 12000000, atc: 26500, costPerATC: 686, ytATC: 14400, jhsATC: 2300 }, // ₹1.20 Cr
  { spend: 10000000, atc: 18700, costPerATC: 714, ytATC: 13800, jhsATC: 2200 }, // ₹1.00 Cr
  { spend: 8000000, atc: 12200, costPerATC: 748, ytATC: 13200, jhsATC: 2100 },  // ₹80 L
  { spend: 6000000, atc: 7100, costPerATC: 790, ytATC: 12400, jhsATC: 2000 },   // ₹60 L
  { spend: 4000000, atc: 3300, costPerATC: 838, ytATC: 11700, jhsATC: 1900 },   // ₹40 L
  { spend: 2000000, atc: 970, costPerATC: 885, ytATC: 11100, jhsATC: 1800 },    // ₹20 L
]

// Interpolate SYNC metrics based on budget
export function getSyncMetrics(syncSpend: number) {
  if (syncSpend <= 0) return { atc: 0, costPerATC: 0, ytATC: DIGITAL_DATA.YouTube.ATC, jhsATC: DIGITAL_DATA.JioHotstar.ATC }
  
  // Find the two scenarios to interpolate between
  const sorted = [...SYNC_SCENARIOS].sort((a, b) => a.spend - b.spend)
  
  if (syncSpend <= sorted[0].spend) return sorted[0]
  if (syncSpend >= sorted[sorted.length - 1].spend) return sorted[sorted.length - 1]
  
  for (let i = 0; i < sorted.length - 1; i++) {
    if (syncSpend >= sorted[i].spend && syncSpend <= sorted[i + 1].spend) {
      const ratio = (syncSpend - sorted[i].spend) / (sorted[i + 1].spend - sorted[i].spend)
      return {
        spend: syncSpend,
        atc: Math.round(sorted[i].atc + ratio * (sorted[i + 1].atc - sorted[i].atc)),
        costPerATC: Math.round(sorted[i].costPerATC + ratio * (sorted[i + 1].costPerATC - sorted[i].costPerATC)),
        ytATC: Math.round(sorted[i].ytATC + ratio * (sorted[i + 1].ytATC - sorted[i].ytATC)),
        jhsATC: Math.round(sorted[i].jhsATC + ratio * (sorted[i + 1].jhsATC - sorted[i].jhsATC)),
      }
    }
  }
  return sorted[sorted.length - 1]
}

export const TV_REGIONAL_DATA: Record<string, TVRegionalData> = {
  AP: { Spend: 4315628, ATC: 916, Channels: 6, ReachPct: 19.4 },
  TN: { Spend: 5241481, ATC: 1114, Channels: 13, ReachPct: 19.8 },
  Kar: { Spend: 4960727, ATC: 1095, Channels: 10, ReachPct: 25.3 },
  Ker: { Spend: 1269724, ATC: 271, Channels: 6, ReachPct: 6.4 },
  WB: { Spend: 621534, ATC: 132, Channels: 2, ReachPct: 3.2 },
  HSM: { Spend: 22568349, ATC: 4784, Channels: 50, ReachPct: 56.8 },
  Sports: { Spend: 1824718, ATC: 389, Channels: 9, ReachPct: 8.6 },
  Others: { Spend: 1075780, ATC: 228, Channels: 12, ReachPct: 3.5 },
}

export const TV_CHANNEL_DATA: TVChannel[] = [
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
]

export const PIE_COLORS = ['#6366f1', '#10b981', '#f97316', '#06b6d4', '#ec4899', '#8b5cf6', '#eab308', '#f43f5e']
