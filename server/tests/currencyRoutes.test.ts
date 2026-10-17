import { afterEach, describe, expect, test, vi } from 'vitest'
import request from 'supertest'
import { app } from '../index'
import * as currencyService from '../services/currencyService'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Currency routes', () => {
  test('POST /api/convert/amount returns converted amount', async () => {
    vi.spyOn(currencyService, 'convert').mockResolvedValue({ amount: 9 })

    const res = await request(app)
      .post('/api/convert/amount')
      .send({ from: 'EUR', to: 'SEK', amount: 10 })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ amount: 9 })
    expect(currencyService.convert).toHaveBeenCalledWith('EUR', 'SEK', 10)
  })

  test('POST /api/convert/amount returns 400 for invalid currency', async () => {
    const res = await request(app)
      .post('/api/convert/amount')
      .send({ from: 'EU', to: 'SEK', amount: 10 })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})