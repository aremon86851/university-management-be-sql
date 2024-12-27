/*
  Warnings:

  - You are about to drop the `OfferedCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OfferedCourse" DROP CONSTRAINT "OfferedCourse_academicDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "OfferedCourse" DROP CONSTRAINT "OfferedCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "OfferedCourse" DROP CONSTRAINT "OfferedCourse_semesterRegistrationId_fkey";

-- DropTable
DROP TABLE "OfferedCourse";

-- CreateTable
CREATE TABLE "offered-course" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicDepartmentId" TEXT NOT NULL,
    "semesterRegistrationId" TEXT NOT NULL,

    CONSTRAINT "offered-course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offered-course" ADD CONSTRAINT "offered-course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered-course" ADD CONSTRAINT "offered-course_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered-course" ADD CONSTRAINT "offered-course_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "SemesterRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
