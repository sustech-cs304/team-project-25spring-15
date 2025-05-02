'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { cookies } from 'next/headers';

/**
 * Get course information for a user
 */
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

/**
 * save Chat model type information
 */
export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

/**
 * Auth related functions
 */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch ((error as any).type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function userLogOut(){
  await signOut({ redirectTo: "/" });
}

