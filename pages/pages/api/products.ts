import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllProducts } from '../../lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const products = await getAllProducts()
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
