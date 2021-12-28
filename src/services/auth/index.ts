import { Request, Response, Router } from 'express'
import { body, header, validationResult } from 'express-validator'
import * as auth from '@src/middleware/auth'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post(
  '/sign_in',
  body('email').isEmail(),
  body('password').not().isEmpty(),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ errors: null })
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
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ errors: null })
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

    req.body.encryptedPassword = await auth.createEncryptedPassword(
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
          id: true,
          reauthVersion: true
        }
      })

      const { accessToken, refreshToken } = auth.createToken(
        user.id,
        user.reauthVersion
      )

      res.set({
        'Access-Token': accessToken,
        'Refresh-Token': refreshToken
      })
      res.send()
    } catch (_) {
      return res.status(422).json({ errors: null })
    }
  }
)

router.put(
  '/refresh',
  header('authorization').contains('Bearer'),
  body('email').isEmail(),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ errors: null })
    }

    const authHeader = req.headers.authorization as string
    const targetRefreshToken = authHeader.replace('Bearer ', '')

    try {
      const decodedRefreshToken = auth.verifyToken(targetRefreshToken) as {
        id: number
        reauthVersion: number
      }

      const specificUser = await prisma.user.findUnique({
        where: {
          id: decodedRefreshToken.id
        },
        select: {
          email: true,
          reauthVersion: true
        }
      })

      if (
        !specificUser ||
        specificUser.email !== req.body.email ||
        specificUser.reauthVersion !== decodedRefreshToken.reauthVersion
      ) {
        return res.status(401).json({ errors: null })
      }

      const { accessToken, refreshToken } = auth.createToken(
        decodedRefreshToken.id,
        specificUser.reauthVersion
      )

      res.set({
        'Access-Token': accessToken,
        'Refresh-Token': refreshToken
      })
      res.send()
    } catch (_) {
      return res.status(401).json({ errors: null })
    }
  }
)

export default router
