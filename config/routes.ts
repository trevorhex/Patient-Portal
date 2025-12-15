export interface RouteProps { href: string, name: string, target?: string, rel?: string }

interface Routes {
  marketing: {
    product: RouteProps[]
    resources: RouteProps[]
  }
  legal: RouteProps[]
  auth: {
    signin: RouteProps
    signup: RouteProps
  }
}

export const ROUTES: Routes = {
  marketing: {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'FAQ', href: '/faq' }
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'GitHub', href: 'https://github.com/trevorhex/patient-portal', target: '_blank', rel: 'noopener noreferrer' }
    ]
  },
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' }
  ],
  auth: {
    signin: { name: 'Log in', href: '/login' },
    signup: { name: 'Sign up', href: '/signup' }
  }
}
