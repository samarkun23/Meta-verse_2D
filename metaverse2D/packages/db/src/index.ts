import type { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaClientClass } from "@prisma/client";

const client: PrismaClient = new PrismaClientClass();

export default client;
