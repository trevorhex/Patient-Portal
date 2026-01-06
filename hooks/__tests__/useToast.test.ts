import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useToast } from '../useToast'

vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), __esModule: true })
}))
const mockToast = vi.mocked(toast)

describe('useToast', () => {
  const render = () => renderHook(() => useToast())

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return all toast functions', () => {
    const { result } = render()

    expect(result.current).toHaveProperty('showSuccess')
    expect(result.current).toHaveProperty('showError')
    expect(result.current).toHaveProperty('showInfo')
    expect(result.current).toHaveProperty('showWarning')
    expect(typeof result.current.showSuccess).toBe('function')
    expect(typeof result.current.showError).toBe('function')
    expect(typeof result.current.showInfo).toBe('function')
    expect(typeof result.current.showWarning).toBe('function')
  })

  describe('showSuccess', () => {
    it('should call toast.success with correct message and options', () => {
      const { result } = render()
      const message = 'Success message'

      result.current.showSuccess(message)

      expect(toast.success).toHaveBeenCalledWith(message, {
        ariaProps: { role: 'status', 'aria-live': 'polite' },
        style: { background: '#10b981', color: '#fff' }
      })
    })
  })

  describe('showError', () => {
    it('should call toast.error with correct message and options', () => {
      const { result } = render()
      const message = 'Error message'

      result.current.showError(message)

      expect(toast.error).toHaveBeenCalledWith(message, {
        ariaProps: { role: 'alert', 'aria-live': 'assertive' },
        style: { background: '#ef4444', color: '#fff' }
      })
    })
  })

  describe('showInfo', () => {
    it('should call toast with correct message and options', () => {
      const { result } = render()
      const message = 'Info message'

      result.current.showInfo(message)

      expect(mockToast).toHaveBeenCalledWith(message, {
        icon: 'ℹ️',
        ariaProps: { role: 'status', 'aria-live': 'polite' },
        style: { background: '#363636', color: '#fff' }
      })
    })
  })

  describe('showWarning', () => {
    it('should call toast with correct message and options', () => {
      const { result } = render()
      const message = 'Warning message'

      result.current.showWarning(message)

      expect(mockToast).toHaveBeenCalledWith(message, {
        icon: '⚠️',
        ariaProps: { role: 'status', 'aria-live': 'polite' },
        style: { background: '#f59e0b', color: '#fff' }
      })
    })
  })

  describe('multiple calls', () => {
    it('should handle multiple toast calls', () => {
      const { result } = render()

      result.current.showSuccess('Success 1')
      result.current.showError('Error 1')
      result.current.showInfo('Info 1')
      result.current.showWarning('Warning 1')

      expect(toast.success).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(mockToast).toHaveBeenCalledTimes(2)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string messages', () => {
      const { result } = render()

      result.current.showSuccess('')
      result.current.showError('')
      result.current.showInfo('')
      result.current.showWarning('')

      expect(toast.success).toHaveBeenCalledWith('', expect.any(Object))
      expect(toast.error).toHaveBeenCalledWith('', expect.any(Object))
      expect(mockToast).toHaveBeenCalledWith('', expect.any(Object))
    })

    it('should handle long messages', () => {
      const { result } = render()
      const longMessage = 'A'.repeat(1000)

      result.current.showSuccess(longMessage)

      expect(toast.success).toHaveBeenCalledWith(longMessage, expect.any(Object))
    })
  })
})
