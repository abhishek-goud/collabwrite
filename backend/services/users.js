const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getUsers = async ({ username, email }) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });
  return user;
};

const createUser = async ({ username, email, passwordHash, userId }) => {
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      userId,
    },
  });

  return newUser;
};

module.exports = { getUsers, createUser };
