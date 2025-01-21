/*
  Warnings:

  - Added the required column `endTime` to the `offered-course-class-schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offered-course-class-schedule" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;
