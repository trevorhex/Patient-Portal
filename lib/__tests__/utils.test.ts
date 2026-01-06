import { describe, it, expect } from 'vitest'
import { cn, formatRelativeTime, isValidEmail, slugify } from '../utils'

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
  })

  it('should merge conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
  })
})

describe('formatRelativeTime', () => {
  it('should format Date object', () => {
    const date = new Date(Date.now() - 1000 * 60 * 5)
    const result = formatRelativeTime(date)
    expect(result).toMatch(/\d+ minutes? ago/)
  })

  it('should format date string', () => {
    const dateString = new Date(Date.now() - 1000 * 60 * 60).toISOString()
    const result = formatRelativeTime(dateString)
    expect(result).toMatch(/about 1 hour ago/)
  })

  it('should handle future dates', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60)
    const result = formatRelativeTime(futureDate)
    expect(result).toMatch(/in about 1 hour/)
  })
})

describe('isValidEmail', () => {
  it('should validate correct email formats', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
    expect(isValidEmail('test123@test-domain.com')).toBe(true)
  })

  it('should reject invalid email formats', () => {
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('test@domain')).toBe(false)
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('test.domain.com')).toBe(false)
  })
})

describe('slugify', () => {
  it('should convert text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('Multiple   Spaces   Here')).toBe('multiple-spaces-here')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello! @#$% World')).toBe('hello-world')
  })

  it('should handle leading and trailing spaces', () => {
    expect(slugify('  trimmed text  ')).toBe('trimmed-text')
  })

  it('should handle leading and trailing dashes', () => {
    expect(slugify('---start and end---')).toBe('start-and-end')
  })

  it('should handle consecutive dashes', () => {
    expect(slugify('dash--dash---dash')).toBe('dash-dash-dash')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('should handle numbers and underscores', () => {
    expect(slugify('Test_123 Item')).toBe('test_123-item')
  })

  it('should handle mixed case with numbers', () => {
    expect(slugify('Product V2.0 Release')).toBe('product-v20-release')
  })
})
