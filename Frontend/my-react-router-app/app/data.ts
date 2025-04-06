export type Lecture = {
  id?: string;
  title?: string;
}

export type Course = {
  id?: number;
  title?: string;
  lectures?: Lecture[];
};

export async function fetchCourses(): Promise<Course[]>{
  try {
    const response = await fetch('https://m1.apifoxmock.com/m1/5989229-5677644-default/courses');
    if (response.ok) {
      const data = await response.json();
      const courses: Course[] = data.courses.map((course: Course) => ({
        id: course.id,
        title: course.title,
        lectures: course.lectures?.map((lecture: Lecture) => ({
            id: lecture.id,
            title: lecture.title,
        }))
      }));
      console.log('Fetched courses data: ', data);
      return courses;
    } else {
      console.error('Failed to fetch courses data');
      return [];
    }
  } catch (error) {
    console.error('Error fetching courses data:', error);
    return [];
  }
};
