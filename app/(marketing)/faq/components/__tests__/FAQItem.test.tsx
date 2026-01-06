import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FAQItem } from '../FAQItem'

const mockedFAQItem = {
  question: 'Mocked question?',
  answer: 'Mocked answer.'
}

describe('FAQItem', () => {
  const renderComponent = () => render(<FAQItem {...mockedFAQItem} />)

  it('renders question', () => {
    renderComponent()
    
    expect(screen.getByText(mockedFAQItem.question)).toBeInTheDocument()
  })

  it('renders answer', () => {
    renderComponent()
    
    expect(screen.getByText(mockedFAQItem.answer)).toBeInTheDocument()
  })
})
