export interface RouteProps { href: string, name?: string, target?: string, rel?: string }
export type RouteFunction = (id: number | string) => RouteProps

interface Routes {
  marketing: {
    product: RouteProps[]
    resources: RouteProps[]
  }
  legal: RouteProps[]
  auth: {
    login: RouteProps
    signup: RouteProps
  }
  account: RouteProps
  dashboard: RouteProps
  profile: {
    base: RouteProps
  }
  issues: {
    base: RouteProps
    new: RouteProps
    edit: RouteFunction
    view: RouteFunction
  }
  api: RouteProps
}

export const ROUTES: Routes = {
  marketing: {
    product: [
      { name: 'About', href: '/about' },
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
    login: { name: 'Log in', href: '/login' },
    signup: { name: 'Sign up', href: '/signup' }
  },
  account: { name: 'Account', href: '/account' },
  dashboard: { name: 'Dashboard', href: '/dashboard' },
  profile: {
    base: { name: 'Patient Profile', href: '/profile' }
  },
  issues: {
    base: { name: 'Issues', href: '/issues' },
    new: { name: 'New Issue', href: '/issues/new' },
    edit: (id: number | string) => ({ href: `/issues/${id}/edit` }),
    view: (id: number | string) => ({ href: `/issues/${id}` })
  },
  api: { href: '/api' }
}
