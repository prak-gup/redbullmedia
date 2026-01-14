'use client'

import { useState } from 'react'
import type { TabId, RegionCode } from '@/types'
import { useBaselineMetrics, useOptimizedMetrics } from '@/hooks/useOptimization'
import SummaryTab from '@/components/tabs/SummaryTab'
import DigitalTab from '@/components/tabs/DigitalTab'
import TVTab from '@/components/tabs/TVTab'

export default function Home() {
  const [tvDigitalSplit, setTvDigitalSplit] = useState(79)
  const [ytJhsSplit, setYtJhsSplit] = useState(60)
  const [selectedTVRegion, setSelectedTVRegion] = useState<RegionCode>('HSM')
  const [tvIntensity, setTvIntensity] = useState(15)
  const [tvThreshold, setTvThreshold] = useState(70)
  const [hasOptimized, setHasOptimized] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('summary')
  
  const baselineMetrics = useBaselineMetrics()
  const optimizedMetrics = useOptimizedMetrics(
    hasOptimized,
    baselineMetrics,
    tvDigitalSplit,
    ytJhsSplit,
    tvIntensity,
    tvThreshold
  )

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
              { id: 'summary' as TabId, label: '📊 Summary' },
              { id: 'digital' as TabId, label: '🌐 Digital' },
              { id: 'tv' as TabId, label: '📺 TV' },
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
        
        {/* Tab Content */}
        {activeTab === 'summary' && (
          <SummaryTab
            hasOptimized={hasOptimized}
            optimizedMetrics={optimizedMetrics}
            baselineMetrics={baselineMetrics}
            tvDigitalSplit={tvDigitalSplit}
            ytJhsSplit={ytJhsSplit}
            tvIntensity={tvIntensity}
            tvThreshold={tvThreshold}
            onTvDigitalSplitChange={setTvDigitalSplit}
            onYtJhsSplitChange={setYtJhsSplit}
            onTvIntensityChange={setTvIntensity}
            onTvThresholdChange={setTvThreshold}
            onOptimizationChange={() => setHasOptimized(false)}
          />
        )}
        
        {activeTab === 'digital' && (
          <DigitalTab
            hasOptimized={hasOptimized}
            optimizedMetrics={optimizedMetrics}
            baselineMetrics={baselineMetrics}
          />
        )}
        
        {activeTab === 'tv' && (
          <TVTab
            hasOptimized={hasOptimized}
            optimizedMetrics={optimizedMetrics}
            selectedTVRegion={selectedTVRegion}
            onRegionChange={setSelectedTVRegion}
          />
        )}
        
        {/* Footer */}
        <footer className="text-center text-slate-400 text-[10px] py-4 mt-4">
          SYNC Cross-Media Attribution • Red Bull Campaign Optimizer v3.0 • January 2026
        </footer>
      </main>
    </div>
  )
}
