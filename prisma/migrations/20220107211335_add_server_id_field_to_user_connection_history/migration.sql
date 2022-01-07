/*
  Warnings:

  - Added the required column `serverId` to the `UserConnectionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserConnectionHistory" ADD COLUMN     "serverId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserConnectionHistory" ADD CONSTRAINT "UserConnectionHistory_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
