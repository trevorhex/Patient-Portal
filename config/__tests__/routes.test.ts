import { describe, it, expect } from 'vitest'
import { ROUTES } from '../routes'

describe('ROUTES', () => {
  describe('marketing routes', () => {
    it('should have correct product routes', () => {
      expect(ROUTES.marketing.product).toEqual([
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'FAQ', href: '/faq' }
      ])
    })

    it('should have correct resources routes', () => {
      expect(ROUTES.marketing.resources).toEqual([
        { name: 'Documentation', href: '/docs' },
        { name: 'GitHub', href: 'https://github.com/trevorhex/patient-portal', target: '_blank', rel: 'noopener noreferrer' }
      ])
    })

    it('should have external GitHub link with correct attributes', () => {
      const githubRoute = ROUTES.marketing.resources.find(route => route.name === 'GitHub')
      expect(githubRoute).toBeDefined()
      expect(githubRoute?.target).toBe('_blank')
      expect(githubRoute?.rel).toBe('noopener noreferrer')
    })
  })

  describe('legal routes', () => {
    it('should have correct legal routes', () => {
      expect(ROUTES.legal).toEqual([
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' }
      ])
    })
  })

  describe('auth routes', () => {
    it('should have correct login route', () => {
      expect(ROUTES.auth.login).toEqual({ name: 'Log in', href: '/login' })
    })

    it('should have correct signup route', () => {
      expect(ROUTES.auth.signup).toEqual({ name: 'Sign up', href: '/signup' })
    })
  })

  describe('static routes', () => {
    it('should have correct account route', () => {
      expect(ROUTES.account).toEqual({ name: 'Account', href: '/account' })
    })

    it('should have correct dashboard route', () => {
      expect(ROUTES.dashboard).toEqual({ name: 'Dashboard', href: '/dashboard' })
    })

    it('should have correct API route', () => {
      expect(ROUTES.api).toEqual({ href: '/api' })
    })
  })

  describe('profile routes', () => {
    it('should have correct profile base route', () => {
      expect(ROUTES.profile.base).toEqual({ name: 'Patient Profile', href: '/profile' })
    })
  })

  describe('issues routes', () => {
    it('should have correct issues base route', () => {
      expect(ROUTES.issues.base).toEqual({ name: 'Issues', href: '/issues' })
    })

    it('should have correct new issue route', () => {
      expect(ROUTES.issues.new).toEqual({ name: 'New Issue', href: '/issues/new' })
    })

    describe('edit function', () => {
      it('should generate correct edit route with string id', () => {
        const result = ROUTES.issues.edit('123')
        expect(result).toEqual({ href: '/issues/123/edit' })
      })

      it('should generate correct edit route with number id', () => {
        const result = ROUTES.issues.edit(456)
        expect(result).toEqual({ href: '/issues/456/edit' })
      })

      it('should be a function', () => {
        expect(typeof ROUTES.issues.edit).toBe('function')
      })
    })

    describe('view function', () => {
      it('should generate correct view route with string id', () => {
        const result = ROUTES.issues.view('abc')
        expect(result).toEqual({ href: '/issues/abc' })
      })

      it('should generate correct view route with number id', () => {
        const result = ROUTES.issues.view(789)
        expect(result).toEqual({ href: '/issues/789' })
      })

      it('should be a function', () => {
        expect(typeof ROUTES.issues.view).toBe('function')
      })
    })
  })

  describe('route structure validation', () => {
    it('should have all required top-level properties', () => {
      expect(ROUTES).toHaveProperty('marketing')
      expect(ROUTES).toHaveProperty('legal')
      expect(ROUTES).toHaveProperty('auth')
      expect(ROUTES).toHaveProperty('account')
      expect(ROUTES).toHaveProperty('dashboard')
      expect(ROUTES).toHaveProperty('profile')
      expect(ROUTES).toHaveProperty('issues')
      expect(ROUTES).toHaveProperty('api')
    })

    it('should have marketing subsections', () => {
      expect(ROUTES.marketing).toHaveProperty('product')
      expect(ROUTES.marketing).toHaveProperty('resources')
    })

    it('should have auth subsections', () => {
      expect(ROUTES.auth).toHaveProperty('login')
      expect(ROUTES.auth).toHaveProperty('signup')
    })

    it('should have issues subsections', () => {
      expect(ROUTES.issues).toHaveProperty('base')
      expect(ROUTES.issues).toHaveProperty('new')
      expect(ROUTES.issues).toHaveProperty('edit')
      expect(ROUTES.issues).toHaveProperty('view')
    })
  })

  describe('href validation', () => {
    it('should have valid internal hrefs starting with /', () => {
      const internalRoutes = [
        ROUTES.auth.login.href,
        ROUTES.auth.signup.href,
        ROUTES.account.href,
        ROUTES.dashboard.href,
        ROUTES.profile.base.href,
        ROUTES.issues.base.href,
        ROUTES.issues.new.href,
        ROUTES.api.href
      ]

      internalRoutes.forEach(href => {
        expect(href).toMatch(/^\//)
      })
    })

    it('should have valid external hrefs with protocol', () => {
      const githubRoute = ROUTES.marketing.resources.find(route => route.name === 'GitHub')
      expect(githubRoute?.href).toMatch(/^https?:\/\//)
    })
  })
})
