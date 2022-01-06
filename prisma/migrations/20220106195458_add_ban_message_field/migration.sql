-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_serverId_fkey";

-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banMessage" TEXT;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
