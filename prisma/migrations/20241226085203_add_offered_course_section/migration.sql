-- CreateTable
CREATE TABLE "offered-course-section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "currentlyEnrolledStudent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "offeredCourseId" TEXT NOT NULL,
    "semesterRegistrationId" TEXT NOT NULL,

    CONSTRAINT "offered-course-section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offered-course-section" ADD CONSTRAINT "offered-course-section_offeredCourseId_fkey" FOREIGN KEY ("offeredCourseId") REFERENCES "offered-course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered-course-section" ADD CONSTRAINT "offered-course-section_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester-registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
