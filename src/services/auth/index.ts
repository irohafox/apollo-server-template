import express from 'express'
import { body, validationResult } from 'express-validator'
import * as auth from '@src/middleware/auth'
import { prisma } from '@src/middleware/db'

const router = express.Router()

router.get('/sign_in', (_, res) => {
  res.send('sign_in')
})

router.post(
  '/sign_up',
  body('email').isEmail(),
  body('password').not().isEmpty(),
  body('name').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const duplicateEmail: boolean = await prisma.user
      .findUnique({
        where: {
          email: req.body.email
        },
        select: {
          id: true
        }
      })
      .then(Boolean)

    if (duplicateEmail) {
      return res.status(422).json({
        errors: [
          {
            param: 'email',
            msg: '入力されたメールアドレスは既に利用されています。'
          }
        ]
      })
    }

    req.body.encryptedPassword = await auth.generateEncryptedPassword(
      req.body.password
    )

    const permitAttributes = ({
      email,
      name,
      encryptedPassword
    }: {
      email: string
      name: string
      encryptedPassword: string
    }) => {
      return { email, name, encryptedPassword }
    }

    try {
      await prisma.user.create({
        data: permitAttributes(req.body)
      })
    } catch (_) {
      return res.status(422).json({ errors: null })
    }
    res.send('success')
  }
)

export default router
