import type { TVChannel } from '@/types'

/**
 * New Client Plan - Optimized TV channel allocation
 * This plan focuses on high-performing channels and reduces spend on low performers
 * Total TV spend is reduced, but ATC is improved through better allocation
 */
export const NEW_PLAN_CHANNELS: TVChannel[] = [
  // HSM Region - Focused on top performers
  {Channel:"sony entertainment television",Region:"HSM",Genre:"entertainment",Spend:2800000,ReachPct:10.2,ATC:595,ImpactScore:95},
  {Channel:"star plus",Region:"HSM",Genre:"entertainment",Spend:1650000,ReachPct:6.5,ATC:355,ImpactScore:92},
  {Channel:"zee tv",Region:"HSM",Genre:"entertainment",Spend:1580000,ReachPct:6.2,ATC:335,ImpactScore:87},
  {Channel:"b4u kadak",Region:"HSM",Genre:"movies",Spend:1750000,ReachPct:6.8,ATC:375,ImpactScore:88},
  {Channel:"colors",Region:"HSM",Genre:"entertainment",Spend:640000,ReachPct:2.6,ATC:135,ImpactScore:85},
  {Channel:"star bharat",Region:"HSM",Genre:"entertainment",Spend:1200000,ReachPct:4.8,ATC:255,ImpactScore:79},
  {Channel:"dangal",Region:"HSM",Genre:"entertainment",Spend:1150000,ReachPct:4.6,ATC:245,ImpactScore:84},
  {Channel:"star gold",Region:"HSM",Genre:"movies",Spend:820000,ReachPct:3.4,ATC:175,ImpactScore:81},
  {Channel:"b4u movies",Region:"HSM",Genre:"movies",Spend:1030000,ReachPct:4.2,ATC:220,ImpactScore:76},
  {Channel:"sony sab",Region:"HSM",Genre:"entertainment",Spend:345000,ReachPct:1.4,ATC:73,ImpactScore:74},
  {Channel:"zee cinema",Region:"HSM",Genre:"movies",Spend:325000,ReachPct:1.3,ATC:69,ImpactScore:69},
  
  // AP Region - Optimized selection
  {Channel:"gemini tv",Region:"AP",Genre:"entertainment",Spend:1850000,ReachPct:6.8,ATC:395,ImpactScore:89},
  {Channel:"star maa",Region:"AP",Genre:"entertainment",Spend:830000,ReachPct:3.9,ATC:177,ImpactScore:82},
  {Channel:"gemini movies",Region:"AP",Genre:"movies",Spend:1040000,ReachPct:4.2,ATC:220,ImpactScore:76},
  {Channel:"zee cinemalu",Region:"AP",Genre:"movies",Spend:620000,ReachPct:2.8,ATC:132,ImpactScore:71},
  
  // TN Region - Focused allocation
  {Channel:"star vijay",Region:"TN",Genre:"entertainment",Spend:1100000,ReachPct:4.8,ATC:235,ImpactScore:91},
  {Channel:"jaya tv",Region:"TN",Genre:"entertainment",Spend:1190000,ReachPct:5.2,ATC:255,ImpactScore:85},
  {Channel:"zee tamil",Region:"TN",Genre:"entertainment",Spend:900000,ReachPct:4.1,ATC:193,ImpactScore:78},
  {Channel:"star vijay super",Region:"TN",Genre:"movies",Spend:810000,ReachPct:3.5,ATC:172,ImpactScore:74},
  {Channel:"colors tamil",Region:"TN",Genre:"entertainment",Spend:395000,ReachPct:1.8,ATC:84,ImpactScore:68},
  
  // Kar Region - Top performers
  {Channel:"colors kannada cinema",Region:"Kar",Genre:"movies",Spend:1950000,ReachPct:8.5,ATC:415,ImpactScore:94},
  {Channel:"zee kannada",Region:"Kar",Genre:"entertainment",Spend:850000,ReachPct:4.1,ATC:180,ImpactScore:79},
  {Channel:"star suvarna",Region:"Kar",Genre:"entertainment",Spend:720000,ReachPct:3.2,ATC:153,ImpactScore:81},
  {Channel:"udaya tv",Region:"Kar",Genre:"entertainment",Spend:775000,ReachPct:3.6,ATC:165,ImpactScore:75},
  
  // Ker Region
  {Channel:"asianet",Region:"Ker",Genre:"entertainment",Spend:295000,ReachPct:1.4,ATC:63,ImpactScore:83},
  {Channel:"flowers tv",Region:"Ker",Genre:"entertainment",Spend:445000,ReachPct:2.1,ATC:95,ImpactScore:77},
  {Channel:"asianet movies",Region:"Ker",Genre:"movies",Spend:215000,ReachPct:1.0,ATC:46,ImpactScore:69},
  
  // WB Region
  {Channel:"star jalsha",Region:"WB",Genre:"entertainment",Spend:590000,ReachPct:2.8,ATC:126,ImpactScore:86},
  
  // Sports - Focused selection
  {Channel:"star sports 1 hindi",Region:"Sports",Genre:"sports",Spend:275000,ReachPct:1.3,ATC:59,ImpactScore:65},
  {Channel:"star sports 3",Region:"Sports",Genre:"sports",Spend:390000,ReachPct:1.8,ATC:83,ImpactScore:62},
  
  // Others - Key channels only
  {Channel:"zee marathi",Region:"Others",Genre:"entertainment",Spend:230000,ReachPct:1.1,ATC:49,ImpactScore:72},
  {Channel:"star pravah",Region:"Others",Genre:"entertainment",Spend:200000,ReachPct:0.9,ATC:43,ImpactScore:68},
]

/**
 * Calculate total spend and ATC for new plan
 */
export function getNewPlanTotals() {
  const totalSpend = NEW_PLAN_CHANNELS.reduce((sum, c) => sum + c.Spend, 0)
  const totalATC = NEW_PLAN_CHANNELS.reduce((sum, c) => sum + c.ATC, 0)
  return { spend: totalSpend, atc: totalATC }
}
