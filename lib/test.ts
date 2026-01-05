import { vi } from 'vitest'

export const createMockSelect = (resultMock: any[] = []) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue(resultMock)
    })
  })
})

export const createMockSelectReject = (error: Error = new Error('')) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      limit: vi.fn().mockRejectedValue(error)
    })
  })
})

export const createMockUpdate = (valuesMock = vi.fn()) => ({
  set: vi.fn().mockReturnValue({
    where: valuesMock
  })
})

export const createMockInsert = (valuesMock = vi.fn()) => ({
  values: valuesMock
})

export const createMockDelete = () => ({
  where: vi.fn()
})
