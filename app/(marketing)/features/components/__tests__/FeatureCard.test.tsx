import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureCard } from '../FeatureCard'

const mockedFeature = {
  title: 'Mocked Feature',
  description: 'Mocked answer.'
}

describe('FeatureCard', () => {
  const renderComponent = () => render(<FeatureCard {...mockedFeature} />)

  it('renders title', () => {
    renderComponent()
    
    expect(screen.getByText(mockedFeature.title)).toBeInTheDocument()
  })

  it('renders description', () => {
    renderComponent()
    
    expect(screen.getByText(mockedFeature.description)).toBeInTheDocument()
  })
})
