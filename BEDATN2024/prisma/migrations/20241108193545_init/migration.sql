/*
  Warnings:

  - You are about to drop the column `rtmp` on the `Camera` table. All the data in the column will be lost.
  - Added the required column `streamKey` to the `Camera` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Camera` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Camera" DROP CONSTRAINT "Camera_userId_fkey";

-- AlterTable
ALTER TABLE "Camera" DROP COLUMN "rtmp",
ADD COLUMN     "streamKey" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
