export type IFilterOptions = {
  searchTerm?: string;
  title?: string;
  code?: string;
  year?: string;
};

export type IOfferedCourseSectionSection = {
  academicDepartmentId: string;
  semesterRegistrationId: string;
  courseIds: string[];
};
