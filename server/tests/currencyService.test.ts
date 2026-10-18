import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { convert } from '../services/currencyService'
import * as convertUtils from '../utils/convert'

describe('CurrencyService.convert', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  test('Returns converted amount with valid currencies', async () => {
    const spy = vi.spyOn(convertUtils, 'calculateConversion')

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { SEK: 11.5 } })
    } as Response)

    const result = await convert('EUR', 'SEK', 10)

    expect(result).toEqual({ amount: 115 })
    expect(spy).toHaveBeenCalledWith(10, 11.5)
  })

  test('Throws error when API call fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false
    } as Response)

    await expect(convert('EUR', 'SEK', 10)).rejects.toThrow(
      'Error retrieving exchange rate.'
    )
  })
})