'use client'

import { useState } from 'react'
import type { TabId, RegionCode } from '@/types'
import { useBaselineMetrics, useOptimizedMetrics } from '@/hooks/useOptimization'
import HomeTab from '@/components/tabs/HomeTab'
import SummaryTab from '@/components/tabs/SummaryTab'
import DigitalTab from '@/components/tabs/DigitalTab'
import TVTab from '@/components/tabs/TVTab'
import OptimalPlanTab from '@/components/tabs/OptimalPlanTab'
import PlanComparisonTab from '@/components/tabs/PlanComparisonTab'

export default function Home() {
  // Optimal Plan Defaults: 5.28 Cr total, 81:19 YouTube/JHS, 15% intensity, 70% threshold
  const [tvDigitalSplit, setTvDigitalSplit] = useState(79)
  const [ytJhsSplit, setYtJhsSplit] = useState(81) // Optimal: 81% YouTube
  const [selectedTVRegion, setSelectedTVRegion] = useState<RegionCode>('HSM')
  const [tvIntensity, setTvIntensity] = useState(15) // Optimal: 15% intensity
  const [tvThreshold, setTvThreshold] = useState(70) // Optimal: 70% protection threshold
  const [hasOptimized, setHasOptimized] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('home')
  
  // SYNC State
  const [syncEnabled, setSyncEnabled] = useState(false)
  const [syncBudget, setSyncBudget] = useState(4000000) // ₹40 L default
  
  const baselineMetrics = useBaselineMetrics()
  const optimizedMetrics = useOptimizedMetrics(
    hasOptimized,
    baselineMetrics,
    tvDigitalSplit,
    ytJhsSplit,
    tvIntensity,
    tvThreshold,
    syncEnabled,
    syncBudget
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold sm:text-xl">Cross-Media Campaign Optimizer</h1>
            <p className="text-slate-400 text-[10px] sm:text-xs">Red Bull • TV + Digital Attribution</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {hasOptimized && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 sm:gap-2 sm:px-3 sm:py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse sm:w-2 sm:h-2" />
                <span className="text-emerald-400 text-[10px] font-medium sm:text-xs">Optimized</span>
              </div>
            )}
            <div className="text-[10px] text-slate-400 sm:text-xs">
              <span>WPP</span> + <span className="text-emerald-400 font-semibold">SYNC</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-2 sm:p-4">
        {/* Navigation */}
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-slate-200 min-w-max sm:min-w-0">
              {[
                { id: 'home' as TabId, label: '🏠 Home' },
                { id: 'summary' as TabId, label: '📊 Summary' },
                { id: 'digital' as TabId, label: '🌐 Digital' },
                { id: 'tv' as TabId, label: '📺 TV' },
                { id: 'optimal' as TabId, label: '🎯 Optimal Plan' },
                { id: 'comparison' as TabId, label: '📋 Plan Comparison' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all whitespace-nowrap sm:px-3 sm:text-xs ${
                    activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 active:bg-slate-100 sm:hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setHasOptimized(!hasOptimized)}
            className={`w-full px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow active:opacity-90 sm:w-auto sm:text-xs ${
              hasOptimized
                ? 'bg-slate-600 active:bg-slate-700 sm:hover:bg-slate-700'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 active:from-orange-600 active:to-orange-700 sm:hover:from-orange-600 sm:hover:to-orange-700'
            }`}
          >
            {hasOptimized ? '↺ Reset' : '⚡ Run Optimization'}
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'home' && (
          <HomeTab onTabChange={(tab) => setActiveTab(tab as TabId)} />
        )}
        
        {activeTab === 'summary' && (
          <SummaryTab
            hasOptimized={hasOptimized}
            optimizedMetrics={optimizedMetrics}
            baselineMetrics={baselineMetrics}
            tvDigitalSplit={tvDigitalSplit}
            ytJhsSplit={ytJhsSplit}
            tvIntensity={tvIntensity}
            tvThreshold={tvThreshold}
            syncEnabled={syncEnabled}
            syncBudget={syncBudget}
            onTvDigitalSplitChange={setTvDigitalSplit}
            onYtJhsSplitChange={setYtJhsSplit}
            onTvIntensityChange={setTvIntensity}
            onTvThresholdChange={setTvThreshold}
            onSyncEnabledChange={setSyncEnabled}
            onSyncBudgetChange={setSyncBudget}
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
        
        {activeTab === 'optimal' && (
          <OptimalPlanTab
            baselineMetrics={baselineMetrics}
          />
        )}
        
        {activeTab === 'comparison' && (
          <PlanComparisonTab
            baselineMetrics={baselineMetrics}
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
