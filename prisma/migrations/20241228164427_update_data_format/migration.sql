/*
  Warnings:

  - The `dayOfWeek` column on the `offered-course-class-schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- AlterTable
ALTER TABLE "offered-course-class-schedule" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "WeekDays" NOT NULL DEFAULT 'SATURDAY';
