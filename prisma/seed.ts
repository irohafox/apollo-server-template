import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const main = async () => {
  const users = await createUsers()
  console.log(users)
}

const createUsers = async () => {
  const promises = [...Array(3)].map((_, i) => {
    return prisma.user.create({
      data: {
        name: `seed_user_${i + 1}`
      }
    })
  })
  return await Promise.all(promises)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
