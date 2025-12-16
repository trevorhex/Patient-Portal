import React from 'react'
import { FeatureCard } from './components/FeatureCard'
import { features } from './config'

export default function FeaturesPage() {
  return (
    <div className="px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-18">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Features
        </h1>
        <p className="text-xl text-gray-400">
          Discover how Patient Portal can help you manage your healthcare more efficiently.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => <FeatureCard key={i} {...feature} />)}
      </div>
    </div>
  )
}
