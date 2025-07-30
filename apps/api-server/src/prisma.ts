import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log(users);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
    });
export default prisma;