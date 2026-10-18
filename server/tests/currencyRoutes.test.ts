import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../index'
import type { Request, Response } from 'express'
import * as currencyController from '../controllers/currencyController'

vi.mock('../controllers/currencyController')

describe('Currency routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('POST /api/convert/amount returns converted amount', async () => {
    vi.mocked(currencyController.convertAmount).mockImplementation(
      async (req: Request, res: Response) => {
        res.status(200).json({ amount: 9 })
      }
    )

    const res = await request(app)
      .post('/api/convert/amount')
      .send({ from: 'EUR', to: 'SEK', amount: 10 })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ amount: 9 })
  })

  test('POST /api/convert/amount returns 400 for invalid currency', async () => {
    vi.mocked(currencyController.convertAmount).mockImplementation(
      async (req: Request, res: Response) => {
        res.status(400).json({
          error: 'Currency codes must be 3-letter ISO abbreviations (e.g., USD, EUR).'
        })
      }
    )

    const res = await request(app)
      .post('/api/convert/amount')
      .send({ from: 'EU', to: 'SEK', amount: 10 })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})