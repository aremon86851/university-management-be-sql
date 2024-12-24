export type IFilterOptions = {
  searchTerm?: string;
  title?: string;
};

export type ICourses = {
  title: string;
  code: string;
  credits?: number;
  prerequisiteCourses: {
    courseId: string;
  }[];
  prerequisiteCourseFor?: string;
};
