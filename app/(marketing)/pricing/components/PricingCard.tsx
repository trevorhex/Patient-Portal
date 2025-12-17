import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/app/components/Button'
import { Badge } from '@/app/components/Badge'
import { Card } from '@/app/components/Card'

export interface PricingFeature {
  name: string
  included: boolean
}

export interface PricingCardProps {
  title: string
  price: string
  period?: string
  description: string
  features: PricingFeature[]
  buttonText: string
  buttonLink: string
  highlighted?: boolean
  badge?: string
  disabled?: boolean
}

export const PricingCard = ({
  title,
  price,
  period = 'per month',
  description,
  features,
  buttonText,
  buttonLink,
  highlighted = false,
  disabled = false,
  badge
}: PricingCardProps) => {
  return (
    <Card className={cn(
      'p-8 shadow-sm flex flex-col gap-9',
      highlighted && 'bg-purple-950 border-2 border-purple-600 shadow-md relative'
    )}>
      {badge && <Badge className="absolute -top-3 -right-3 dark:bg-purple-600 px-3 py-2 dark:text-white">
        {badge}
      </Badge>}
      <div className="flex flex-col gap-5">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex flex-col gap-3 text-gray-300">
          <div>
            <span className="text-3xl font-bold">{price}</span>
            {price !== 'Custom' && <span> {period}</span>}
          </div>
          <p>{description}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included
              ? <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0" />
              : <XCircle className="h-5 w-5 text-gray-500 mr-2 shrink-0" />}
            <span className={feature.included ? 'text-white' : 'text-gray-500'}>
              {feature.name}
            </span>
          </li>
        ))}
      </ul>
      <Link href={buttonLink} className={disabled ? 'pointer-events-none' : ''}>
        <Button variant={highlighted ? 'primary' : 'outline'} fullWidth>{buttonText}</Button>
      </Link>
    </Card>
  )
}
