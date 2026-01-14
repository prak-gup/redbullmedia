# Red Bull Cross-Media Campaign Optimizer

A Next.js application for optimizing cross-media campaign budgets across TV and Digital platforms (YouTube & JioHotstar).

## Features

- **Budget Optimization**: Adjust TV/Digital split and YouTube/JioHotstar allocation
- **TV Channel Analysis**: View and optimize spending across regional TV channels
- **Real-time Calculations**: See optimization impact instantly
- **Impact Scoring**: Visual indicators for channel performance
- **TypeScript**: Fully typed for better development experience
- **Tailwind CSS**: Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── tabs/             # Tab components (Summary, Digital, TV)
│   ├── LabeledSlider.tsx # Slider component
│   ├── ImpactScoreBar.tsx # Impact score visualization
│   └── MiniMetric.tsx    # Metric display component
├── hooks/                # Custom React hooks
│   └── useOptimization.ts # Optimization calculations
├── types/                # TypeScript type definitions
│   └── index.ts
├── data/                 # Data constants
│   └── constants.ts
└── utils/                # Utility functions
    ├── formatting.ts     # Number/currency formatting
    └── impactScore.ts    # Impact score styling
```

## Usage

1. **Summary Tab**: Adjust optimization controls and view overall impact
2. **Digital Tab**: Compare YouTube vs JioHotstar performance
3. **TV Tab**: Analyze regional TV channel performance and optimization

### Optimization Controls

- **TV/Digital Split**: Adjust budget allocation between TV and Digital (50-95%)
- **YouTube/JioHotstar Split**: Adjust digital budget split (30-90%)
- **Optimization Intensity**: Control how aggressive the optimization is (5-30%)
- **Protection Threshold**: Set threshold for protecting channels (50-90%)

## Technology Stack

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Recharts**: Chart visualization
- **React Hooks**: State management

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without building

## License

Proprietary - WPP + SYNC
