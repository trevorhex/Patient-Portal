import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useReducedMotion } from '../useReducedMotion'

const mockMatchMedia = vi.fn()
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

const mockMedia = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  matches: false
}

describe('useReducedMotion', () => {
  const render = () => renderHook(() => useReducedMotion())

  beforeEach(() => {
    vi.resetAllMocks()
    Object.defineProperty(window, 'matchMedia', { writable: true, value: mockMatchMedia })
  })

  it('should return true as initial state', () => {
    mockMatchMedia.mockReturnValue(mockMedia)

    const { result } = render()
    expect(result.current).toBe(false)
  })

  it('should return true when user prefers reduced motion', () => {
    mockMatchMedia.mockReturnValue({ ...mockMedia, matches: true })

    const { result } = render()
    expect(result.current).toBe(true)
  })

  it('should return false when user does not prefer reduced motion', () => {
    mockMatchMedia.mockReturnValue(mockMedia)

    const { result } = render()
    expect(result.current).toBe(false)
  })

  it('should call matchMedia with correct query', () => {
    mockMatchMedia.mockReturnValue(mockMedia)

    render()
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('should add event listener for changes', () => {
    mockMatchMedia.mockReturnValue(mockMedia)

    render()
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should update state when media query changes', () => {
    let changeListener: (e: MediaQueryListEvent) => void

    mockMatchMedia.mockReturnValue({
      ...mockMedia,
      addEventListener: (event: string, listener: (e: MediaQueryListEvent) => void) => { changeListener = listener }
    })

    const { result } = render()
    expect(result.current).toBe(false)

    act(() => {
      changeListener({ matches: true } as MediaQueryListEvent)
    })

    expect(result.current).toBe(true)

    act(() => {
      changeListener({ matches: false } as MediaQueryListEvent)
    })

    expect(result.current).toBe(false)
  })

  it('should remove event listener on unmount', () => {
    mockMatchMedia.mockReturnValue(mockMedia)

    const { unmount } = render()
    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should handle multiple renders without side effects', () => {
    mockMatchMedia.mockReturnValue({ ...mockMedia, matches: true })

    const { result, rerender } = render()
    expect(result.current).toBe(true)

    rerender()
    expect(result.current).toBe(true)
    expect(mockMatchMedia).toHaveBeenCalledTimes(1)
  })
})
