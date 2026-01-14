import type { TVChannel } from '@/types'
import { TV_CHANNEL_DATA } from './constants'

/**
 * Client Plan Data from Plan.csv
 * Maps channel names to regions and spends
 */
export interface ClientPlanChannel {
  channel: string
  region: string
  spend: number
  genre: string
}

// Parse the client plan CSV data
export const CLIENT_PLAN_RAW = [
  {channel:"star plus",region:"HSM",spend:902730,genre:"entertainment"},
  {channel:"sony sab",region:"HSM",spend:673178,genre:"entertainment"},
  {channel:"colors",region:"HSM",spend:581176,genre:"entertainment"},
  {channel:"zee tv",region:"HSM",spend:500706,genre:"entertainment"},
  {channel:"sony entertainment television",region:"HSM",spend:841145,genre:"entertainment"},
  {channel:"star utsav",region:"HSM",spend:843796,genre:"entertainment"},
  {channel:"dangal",region:"HSM",spend:253158,genre:"entertainment"},
  {channel:"sony pal",region:"HSM",spend:1279111,genre:"entertainment"},
  {channel:"colors rishtey",region:"HSM",spend:167012,genre:"entertainment"},
  {channel:"star bharat",region:"HSM",spend:141676,genre:"entertainment"},
  {channel:"&tv",region:"HSM",spend:235187,genre:"entertainment"},
  {channel:"star gold",region:"HSM",spend:582353,genre:"movies"},
  {channel:"goldmines",region:"HSM",spend:717464,genre:"movies"},
  {channel:"sony max",region:"HSM",spend:564706,genre:"movies"},
  {channel:"star gold 2",region:"HSM",spend:658000,genre:"movies"},
  {channel:"colors cineplex",region:"HSM",spend:484706,genre:"movies"},
  {channel:"manoranjan tv",region:"HSM",spend:170471,genre:"movies"},
  {channel:"b4u kadak",region:"HSM",spend:473647,genre:"movies"},
  {channel:"b4u music",region:"HSM",spend:0,genre:"music"},
  {channel:"9xm",region:"HSM",spend:294706,genre:"music"},
  {channel:"zing",region:"HSM",spend:85271,genre:"music"},
  {channel:"star maa",region:"AP",spend:337016,genre:"entertainment"},
  {channel:"gemini tv",region:"AP",spend:225757,genre:"entertainment"},
  {channel:"star maa movies",region:"AP",spend:112000,genre:"movies"},
  {channel:"zee cinemalu",region:"AP",spend:120588,genre:"movies"},
  {channel:"star maa gold",region:"AP",spend:112412,genre:"movies"},
  {channel:"sun tv",region:"TN",spend:567871,genre:"entertainment"},
  {channel:"star vijay",region:"TN",spend:490000,genre:"entertainment"},
  {channel:"zee tamil",region:"TN",spend:177439,genre:"entertainment"},
  {channel:"kalaignar tv",region:"TN",spend:175000,genre:"entertainment"},
  {channel:"colors tamil",region:"TN",spend:99647,genre:"entertainment"},
  {channel:"jaya tv",region:"TN",spend:57882,genre:"entertainment"},
  {channel:"star vijay super",region:"TN",spend:176431,genre:"movies"},
  {channel:"sun music",region:"TN",spend:105882,genre:"music"},
  {channel:"sirippoli",region:"TN",spend:56941,genre:"comedy"},
  {channel:"zee kannada",region:"Kar",spend:261778,genre:"entertainment"},
  {channel:"colors kannada",region:"Kar",spend:222668,genre:"entertainment"},
  {channel:"star suvarna",region:"Kar",spend:239952,genre:"entertainment"},
  {channel:"udaya tv",region:"Kar",spend:194388,genre:"entertainment"},
  {channel:"udaya movies",region:"Kar",spend:158334,genre:"movies"},
  {channel:"colors kannada cinema",region:"Kar",spend:122647,genre:"movies"},
  {channel:"asianet",region:"Ker",spend:376945,genre:"entertainment"},
  {channel:"flowers tv",region:"Ker",spend:71333,genre:"entertainment"},
  {channel:"asianet movies",region:"Ker",spend:66165,genre:"movies"},
  {channel:"star jalsha",region:"WB",spend:363331,genre:"entertainment"},
]

/**
 * Channel name aliases/mappings for better matching
 */
const CHANNEL_ALIASES: Record<string, string> = {
  'zee telugu': 'gemini tv', // Map Zee Telugu to Gemini TV for AP region
  '9x m': '9xm',
  '&tv': '&tv',
  '&pictures': 'zee cinema', // Approximate mapping
  'z cinema': 'zee cinema',
  'zee anmol cinema': 'zee cinema', // Approximate
  'zee anmol cinema 2': 'zee cinema', // Approximate
  'sony max 2': 'sony max',
  'star gold romance': 'star gold',
  'star gold thrills': 'star gold',
  'colors cineplex bollywood': 'colors cineplex',
  'colors cineplex superhits': 'colors cineplex',
  'goldmines bollywood': 'goldmines',
  'goldmines movies': 'goldmines',
  'zee classic': 'zee cinema',
  'star utsav movies': 'star utsav',
  'sony wah': 'sony max',
  'zee action': 'zee cinema',
  'dangal 2': 'dangal',
  'manoranjan grand': 'manoranjan tv',
  'sun neo': 'sun tv',
  'shemaroo tv': 'colors', // Approximate
  'star vijay hd': 'star vijay',
  'sun tv hd': 'sun tv',
  'colors tamil sd': 'colors tamil',
  'zee thirai': 'zee tamil', // Approximate
  'isaiaruvi': 'sun music', // Approximate
  'suvarna plus': 'star suvarna', // Approximate
  'surya tv': 'asianet', // Approximate for Ker
  'kairali tv': 'asianet', // Approximate
  'mazhavil manorama': 'asianet', // Approximate
  'amrita tv': 'asianet', // Approximate
  'we tv': 'asianet', // Approximate
  'sony aath': 'star jalsha', // Approximate for WB
  'sun bangla': 'zee bangla', // Approximate
  'gemini life': 'gemini tv', // Approximate
  'etv plus': 'gemini tv', // Approximate
  'etv cinema': 'gemini movies', // Approximate
  'etv telugu': 'gemini tv', // Approximate
}

/**
 * Normalize channel names for matching (lowercase, remove extra spaces)
 */
function normalizeChannelName(name: string): string {
  const normalized = name.toLowerCase().trim().replace(/\s+/g, ' ')
  // Check if there's an alias
  return CHANNEL_ALIASES[normalized] || normalized
}

/**
 * Map client plan to our channel structure with ATC calculations
 * Uses baseline efficiency to calculate ATC for client plan channels
 */
export function getClientPlanChannels(): TVChannel[] {
  const clientChannels: TVChannel[] = []
  
  // Create a lookup map of baseline channels by normalized name
  const baselineMap = new Map<string, typeof TV_CHANNEL_DATA[0]>()
  TV_CHANNEL_DATA.forEach(ch => {
    const normalized = normalizeChannelName(ch.Channel)
    baselineMap.set(normalized, ch)
  })
  
  CLIENT_PLAN_RAW.forEach(clientChannel => {
    if (clientChannel.spend <= 0) return // Skip zero spend channels
    
    const normalizedName = normalizeChannelName(clientChannel.channel)
    const baselineChannel = baselineMap.get(normalizedName)
    
    if (baselineChannel) {
      // Channel exists in baseline - use baseline efficiency to calculate ATC
      const baselineEfficiency = baselineChannel.ATC / baselineChannel.Spend
      const clientATC = Math.round(clientChannel.spend * baselineEfficiency)
      
      // Calculate reach percentage (proportional to spend)
      const reachMultiplier = clientChannel.spend / baselineChannel.Spend
      const clientReachPct = baselineChannel.ReachPct * reachMultiplier
      
      clientChannels.push({
        Channel: baselineChannel.Channel, // Use baseline name for consistency
        Region: clientChannel.region === 'KAR' ? 'Kar' : 
               clientChannel.region === 'AP' ? 'AP' :
               clientChannel.region === 'TN' ? 'TN' :
               clientChannel.region === 'KER' ? 'Ker' :
               clientChannel.region === 'WB' ? 'WB' :
               clientChannel.region === 'Bihar' ? 'Others' :
               clientChannel.region,
        Genre: clientChannel.genre,
        Spend: clientChannel.spend,
        ReachPct: Math.min(clientReachPct, baselineChannel.ReachPct * 1.2), // Cap at 20% increase
        ATC: clientATC,
        ImpactScore: baselineChannel.ImpactScore, // Use baseline impact score
      })
    } else {
      // New channel not in baseline - estimate ATC based on genre average efficiency
      const genreChannels = TV_CHANNEL_DATA.filter(c => 
        c.Genre === clientChannel.genre && 
        c.Region === (clientChannel.region === 'KAR' ? 'Kar' : clientChannel.region)
      )
      
      if (genreChannels.length > 0) {
        const avgEfficiency = genreChannels.reduce((sum, c) => sum + (c.ATC / c.Spend), 0) / genreChannels.length
        const estimatedATC = Math.round(clientChannel.spend * avgEfficiency)
        const avgImpactScore = Math.round(genreChannels.reduce((sum, c) => sum + c.ImpactScore, 0) / genreChannels.length)
        
        clientChannels.push({
          Channel: clientChannel.channel,
          Region: clientChannel.region === 'KAR' ? 'Kar' : 
                 clientChannel.region === 'AP' ? 'AP' :
                 clientChannel.region === 'TN' ? 'TN' :
                 clientChannel.region === 'KER' ? 'Ker' :
                 clientChannel.region === 'WB' ? 'WB' :
                 clientChannel.region === 'Bihar' ? 'Others' :
                 clientChannel.region,
          Genre: clientChannel.genre,
          Spend: clientChannel.spend,
          ReachPct: 0, // New channel, no baseline reach
          ATC: estimatedATC,
          ImpactScore: avgImpactScore,
        })
      }
    }
  })
  
  return clientChannels
}

/**
 * Calculate totals for client plan
 */
export function getClientPlanTotals() {
  const channels = getClientPlanChannels()
  const totalSpend = channels.reduce((sum, c) => sum + c.Spend, 0)
  const totalATC = channels.reduce((sum, c) => sum + c.ATC, 0)
  return { spend: totalSpend, atc: totalATC, channels: channels.length }
}
