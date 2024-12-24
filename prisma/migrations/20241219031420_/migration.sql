/*
  Warnings:

  - A unique constraint covering the columns `[academicSemesterId]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_academicSemesterId_key" ON "student"("academicSemesterId");
