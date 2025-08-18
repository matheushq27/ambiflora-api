/*
  Warnings:

  - You are about to drop the column `folder_id` on the `monitored_processes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "monitored_processes" DROP CONSTRAINT "monitored_processes_folder_id_fkey";

-- AlterTable
ALTER TABLE "monitored_processes" DROP COLUMN "folder_id",
ADD COLUMN     "folder_uuid" TEXT;

-- AddForeignKey
ALTER TABLE "monitored_processes" ADD CONSTRAINT "monitored_processes_folder_uuid_fkey" FOREIGN KEY ("folder_uuid") REFERENCES "folders"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
