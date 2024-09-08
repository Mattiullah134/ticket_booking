/*
  Warnings:

  - You are about to drop the column `password` on the `Theater` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Theater" DROP COLUMN "password";

-- AddForeignKey
ALTER TABLE "Theater" ADD CONSTRAINT "Theater_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
