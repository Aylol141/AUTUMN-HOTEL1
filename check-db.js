const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDB() {
  try {
    console.log("--- Checking Database Tables ---");
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
    if (users.length > 0) {
      console.log("Admin User Email:", users[0].email);
    }
    
    const rooms = await prisma.room.findMany();
    console.log("Rooms found:", rooms.length);
    
    console.log("--- End of Check ---");
  } catch (error) {
    console.error("Error during DB check:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDB();
