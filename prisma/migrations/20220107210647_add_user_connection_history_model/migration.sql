-- CreateEnum
CREATE TYPE "ConnectionEvent" AS ENUM ('CONNECTED', 'DISCONNECTED', 'DENIED');

-- CreateTable
CREATE TABLE "UserConnectionHistory" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "event" "ConnectionEvent" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserConnectionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserConnectionHistory" ADD CONSTRAINT "UserConnectionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
