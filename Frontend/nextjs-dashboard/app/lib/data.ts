export interface Lecture {
  id: string;
  title: string;
  status?: 'notStarted' | 'inProgress' | 'done';  // 可选: 添加状态属性
}

export interface Course {
  id: string;
  title: string;
  lectures: Lecture[];
}

export async function fetchCourses() {
  try {
    let coursesUrl = 'https://m1.apifoxmock.com/m1/5989566-5677982-default/api/getCourses';
    const response = await fetch(coursesUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.courses;
  } catch (err) {
    console.error(`Failed to fetch courses infomation:`, err);
  }
}
