import { PricingCardProps } from './components/PricingCard'

export const pricingPlans: PricingCardProps[] = [
  {
    title: 'Free',
    price: '$0',
    description: 'Perfect for individuals and small families getting started.',
    features: [
      { name: 'Up to 3 family members', included: true },
      { name: 'Unlimited issues', included: true },
      { name: 'Basic issue tracking', included: true },
      { name: 'Email support', included: true },
      { name: 'API access', included: false },
      { name: 'Custom fields', included: false },
      { name: 'Advanced integrations', included: false },
    ],
    buttonText: 'Sign Up Free',
    buttonLink: '/auth/signup',
  },
  {
    title: 'Pro',
    price: '$10',
    period: 'per individual / month',
    description: 'For growing families that need more features and flexibility.',
    features: [
      { name: 'Unlimited family members', included: true },
      { name: 'Unlimited issues', included: true },
      { name: 'Advanced issue tracking', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: true },
      { name: 'Custom fields', included: true },
      { name: 'Advanced integrations', included: false },
    ],
    buttonText: 'Coming Soon',
    buttonLink: '#',
    disabled: true,
    highlighted: true,
    badge: 'Popular'
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'For families that need advanced security and support.',
    features: [
      { name: 'Unlimited family members', included: true },
      { name: 'Unlimited issues', included: true },
      { name: 'Advanced issue tracking', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'API access', included: true },
      { name: 'Custom fields', included: true },
      { name: 'Advanced integrations', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonLink: 'mailto:sales@patientportal.med'
  }
]
