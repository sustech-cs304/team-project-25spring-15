'use server';

import { cookies } from 'next/headers';

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

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}
