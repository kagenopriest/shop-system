import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error']
})

async function main() {
    const password = await bcrypt.hash('123456', 10)

    // Admin
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password,
            role: 'ADMIN',
            name: 'Admin User',
        },
    })

    // Staff
    await prisma.user.upsert({
        where: { username: 'staff' },
        update: {},
        create: {
            username: 'staff',
            password,
            role: 'STAFF',
            name: 'Staff User',
        },
    })

    // Initial Data
    const otherCat = await prisma.category.upsert({
        where: { name: 'Others' },
        update: {},
        create: { name: 'Others' },
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
