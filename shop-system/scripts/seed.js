const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Starting seed...');
        const password = await bcrypt.hash('123456', 10);

        // Admin
        await prisma.user.upsert({
            where: { username: 'admin' },
            create: {
                username: 'admin',
                password,
                role: 'ADMIN',
                name: 'Admin User',
            },
            update: { password },
        });
        console.log('Admin user created');

        // Staff
        await prisma.user.upsert({
            where: { username: 'staff' },
            create: {
                username: 'staff',
                password,
                role: 'STAFF',
                name: 'Staff User',
            },
            update: { password },
        });
        console.log('Staff user created');

        // Initial Data
        await prisma.category.upsert({
            where: { name: 'Others' },
            create: { name: 'Others' },
            update: {},
        });
        console.log('Categories created');

        console.log('Seeding finished.');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
