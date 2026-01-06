import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ROUTES } from '@/config/routes'
import { Footer } from '../Footer'


describe('Footer', () => {
  const renderComponent = () => render(<Footer />)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('brand section', () => {
    it('renders the brand link with correct text', () => {
      renderComponent()
      
      const link = screen.getByRole('link', { name: 'Patient Portal' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/')
    })

    it('displays the brand description', () => {
      renderComponent()
      
      expect(screen.getByText('Manage your health with ease.')).toBeInTheDocument()
    })
  })

  describe('Footer Links', () => {
    it('renders all product links correctly', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument()
      
      const featuresLink = screen.getByRole('link', { name: 'Features' })
      const pricingLink = screen.getByRole('link', { name: 'Pricing' })
      const faqLink = screen.getByRole('link', { name: 'FAQ' })
      
      expect(featuresLink).toBeInTheDocument()
      expect(featuresLink).toHaveAttribute('href', ROUTES.marketing.product[0].href)
      expect(pricingLink).toBeInTheDocument()
      expect(pricingLink).toHaveAttribute('href', ROUTES.marketing.product[1].href)
      expect(pricingLink).toBeInTheDocument()
      expect(faqLink).toHaveAttribute('href', ROUTES.marketing.product[2].href)
    })

    it('renders all resource links correctly', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Resources' })).toBeInTheDocument()
      
      const docsLink = screen.getByRole('link', { name: 'Documentation' })
      const githubLink = screen.getByRole('link', { name: 'GitHub' })
      
      expect(docsLink).toBeInTheDocument()
      expect(docsLink).toHaveAttribute('href', ROUTES.marketing.resources[0].href)
      expect(githubLink).toBeInTheDocument()
      expect(githubLink).toHaveAttribute('href', ROUTES.marketing.resources[1].href)
    })

    it('renders all legal links correctly', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Legal' })).toBeInTheDocument()
      
      const termsLink = screen.getByRole('link', { name: 'Terms of Service' })
      const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })
      
      expect(termsLink).toBeInTheDocument()
      expect(termsLink).toHaveAttribute('href', ROUTES.legal[0].href)
      expect(privacyLink).toBeInTheDocument()
      expect(privacyLink).toHaveAttribute('href', ROUTES.legal[1].href)
    })
  })

  describe('Structure and Layout', () => {
    it('renders within the FooterWrapper component', () => {
      renderComponent()
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('renders all sections as list items within navigation', () => {
      renderComponent()
      
      const productNav = screen.getByRole('navigation', { name: 'Product links' })
      const resourcesNav = screen.getByRole('navigation', { name: 'Resources links' })
      const legalNav = screen.getByRole('navigation', { name: 'Legal links' })
      
      expect(productNav.querySelector('ul')).toBeInTheDocument()
      expect(resourcesNav.querySelector('ul')).toBeInTheDocument()
      expect(legalNav.querySelector('ul')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders navigation sections with proper ARIA labels', () => {
      renderComponent()
      
      expect(screen.getByRole('navigation', { name: 'Product links' })).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: 'Resources links' })).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: 'Legal links' })).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      renderComponent()
      
      const brandHeading = screen.getByRole('heading', { level: 2 })
      expect(brandHeading).toHaveTextContent('Patient Portal')
      
      const sectionHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(sectionHeadings).toHaveLength(3)
      expect(sectionHeadings.map(h => h.textContent)).toEqual(['Product', 'Resources', 'Legal'])
    })

    it('has semantic navigation structure', () => {
      renderComponent()
      
      const navElements = screen.getAllByRole('navigation')
      expect(navElements).toHaveLength(3)
      
      navElements.forEach(nav => {
        expect(nav).toHaveAttribute('aria-label')
        expect(nav.querySelector('ul')).toBeInTheDocument()
      })
    })

    it('all links are focusable', () => {
      renderComponent()
      
      screen.getAllByRole('link').forEach(link => {
        expect(link).not.toHaveAttribute('tabindex', '-1')
      })
    })
  })
})
