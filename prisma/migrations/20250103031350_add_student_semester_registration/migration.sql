/*
  Warnings:

  - Added the required column `updatedAt` to the `student-semester-registration-course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student-semester-registration-course" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
