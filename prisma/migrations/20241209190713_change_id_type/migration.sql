/*
  Warnings:

  - The primary key for the `academic_department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `academic_faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `academic_semester` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "academic_department" DROP CONSTRAINT "academic_department_academicFacultyId_fkey";

-- DropForeignKey
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_academicDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_academicFacultyId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_academicDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_academicFacultyId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_academicSemesterId_fkey";

-- AlterTable
ALTER TABLE "academic_department" DROP CONSTRAINT "academic_department_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "academicFacultyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "academic_department_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "academic_department_id_seq";

-- AlterTable
ALTER TABLE "academic_faculty" DROP CONSTRAINT "academic_faculty_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "academic_faculty_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "academic_faculty_id_seq";

-- AlterTable
ALTER TABLE "academic_semester" DROP CONSTRAINT "academic_semester_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "academic_semester_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "academic_semester_id_seq";

-- AlterTable
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "academicDepartmentId" SET DATA TYPE TEXT,
ALTER COLUMN "academicFacultyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "faculty_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "faculty_id_seq";

-- AlterTable
ALTER TABLE "student" DROP CONSTRAINT "student_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "academicSemesterId" SET DATA TYPE TEXT,
ALTER COLUMN "academicDepartmentId" SET DATA TYPE TEXT,
ALTER COLUMN "academicFacultyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "student_id_seq";

-- AddForeignKey
ALTER TABLE "academic_department" ADD CONSTRAINT "academic_department_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
