import { CheckCircle2 } from 'lucide-react'

export interface FeatureCardProps {
  title: string
  description: string
}

export const FeatureCard = ({ title, description }: FeatureCardProps) => (
  <div className="flex flex-col gap-3 p-8 rounded-lg shadow-sm bg-zinc-900 border border-zinc-700">
    <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-3">
      <CheckCircle2 className="h-7 w-7 text-green-400" />
      {title}
    </h3>
    <p className="text-gray-400">{description}</p>
  </div>
)
