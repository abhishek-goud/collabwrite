const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getUsers = async ({ username, email }) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });
    return user;
  } catch (err) {
    throw new Error("Error fetching user");
  }
};

const createUser = async ({ username, email, passwordHash, userId }) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        userId,
      },
    });

    return newUser;
  } catch (err) {
    throw new Error("Error creating user");
  }
};

module.exports = { getUsers, createUser };
