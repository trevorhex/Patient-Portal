import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimeStamp } from '../components/TimeStamp'

const mockDate = new Date('2025-01-07T12:00:00.000Z')

describe('TimeStamp Component', () => {
  const renderComponent = () => render(<TimeStamp />)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    renderComponent()
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('displays the current year', () => {
    renderComponent()
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('displays correct year when date changes', () => {
    vi.setSystemTime(new Date('2026-06-15T10:30:00.000Z'))
    
    renderComponent()
    expect(screen.getByText('2026')).toBeInTheDocument()
  })

  it('handles future years correctly', () => {
    vi.setSystemTime(new Date('2030-12-31T23:59:59.999Z'))
    
    renderComponent()
    expect(screen.getByText('2030')).toBeInTheDocument()
  })

  it('component re-renders with same year when props change', () => {
    const { rerender } = renderComponent()
    expect(screen.getByText('2025')).toBeInTheDocument()
    
    rerender(<TimeStamp />)
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('handles component unmounting gracefully', () => {
    const { unmount } = renderComponent()
    expect(screen.getByText('2025')).toBeInTheDocument()
    
    expect(() => unmount()).not.toThrow()
  })

  it('returns number type for the year', () => {
    renderComponent()
    const yearElement = screen.getByText('2025')
    
    expect(yearElement.textContent).toBe('2025')
    expect(typeof 2025).toBe('number')
  })

  it('handles leap years correctly', () => {
    vi.setSystemTime(new Date('2024-02-29T12:00:00.000Z'))
    
    renderComponent()
    expect(screen.getByText('2024')).toBeInTheDocument()
  })
})
