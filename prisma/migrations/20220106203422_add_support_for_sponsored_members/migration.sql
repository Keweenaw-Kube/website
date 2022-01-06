-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sponsoredByUserId" INTEGER,
ALTER COLUMN "email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sponsoredByUserId_fkey" FOREIGN KEY ("sponsoredByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
