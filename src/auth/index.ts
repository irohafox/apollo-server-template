import express from 'express'

const router = express.Router()

router.get('/sign_in', (_, res) => {
  res.send('sign_in')
})

router.get('/sign_up', (_, res) => {
  res.send('sign_up')
})

export default router
