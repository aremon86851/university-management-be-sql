/*
  Warnings:

  - Added the required column `academicSemesterId` to the `SemesterRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SemesterRegistration" ADD COLUMN     "academicSemesterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SemesterRegistration" ADD CONSTRAINT "SemesterRegistration_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
