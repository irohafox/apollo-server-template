import { Request, Response, Router } from 'express'
import { body, validationResult } from 'express-validator'
import * as auth from '@src/middleware/auth'
import { prisma } from '@src/middleware/db'

const router = Router()

router.post(
  '/sign_in',
  body('email').isEmail(),
  body('password').not().isEmpty(),
  async (req: Request, res: Response) => {
    const [valid, errors] = validateRequest(req)
    if (!valid) {
      return res.status(400).json({ errors })
    }

    const specificUser = await prisma.user.findUnique({
      where: {
        email: req.body.email
      },
      select: {
        id: true,
        encryptedPassword: true,
        reauthVersion: true
      }
    })

    if (!specificUser) {
      return res.status(401).json({ errors: null })
    }

    const authorized = await auth.comparePassword(
      req.body.password,
      specificUser.encryptedPassword
    )

    if (!authorized) {
      return res.status(401).json({ errors: null })
    }

    const { accessToken, refreshToken } = auth.createToken(
      specificUser.id,
      specificUser.reauthVersion
    )

    res.set({
      'Access-Token': accessToken,
      'Refresh-Token': refreshToken
    })
    res.send()
  }
)

router.post(
  '/sign_up',
  body('email').isEmail(),
  body('password').not().isEmpty(),
  body('name').not().isEmpty(),
  async (req: Request, res: Response) => {
    const [valid, errors] = validateRequest(req)
    if (!valid) {
      return res.status(400).json({ errors })
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
      const user = await prisma.user.create({
        data: permitAttributes(req.body),
        select: {
          id: true
        }
      })
      return res.status(200).json(user)
    } catch (_) {
      return res.status(422).json({ errors: null })
    }
  }
)

function validateRequest(req: Request): [boolean, any] {
  const errors = validationResult(req)
  return [errors.isEmpty(), errors.array()]
}

export default router
