/*
  Warnings:

  - You are about to drop the column `customer_id` on the `Folders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_customer_id_fkey";

-- AlterTable
ALTER TABLE "Folders" DROP COLUMN "customer_id",
ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
