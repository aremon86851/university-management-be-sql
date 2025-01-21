/*
  Warnings:

  - The `fullPaymentAmount` column on the `student-semester-payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `partialPaymentAmount` column on the `student-semester-payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalDueAmount` column on the `student-semester-payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "student-semester-payment" DROP COLUMN "fullPaymentAmount",
ADD COLUMN     "fullPaymentAmount" INTEGER,
DROP COLUMN "partialPaymentAmount",
ADD COLUMN     "partialPaymentAmount" INTEGER,
DROP COLUMN "totalDueAmount",
ADD COLUMN     "totalDueAmount" INTEGER;
