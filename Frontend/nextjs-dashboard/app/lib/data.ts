'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { cookies } from 'next/headers';
import axios from "axios";

/**
 * Get course information for a user
 */
export async function fetchCourses() {
  try {
    console.log('Fetching courses...')
    let coursesUrl = 'http://47.117.144.50:8000/api/course/getCourses';
    const response = await axios.get(coursesUrl);
    console.log('Fetched courses in data.ts:', response.data.data);
    return response.data.data.courses;
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

export async function userLogOut() {
  await signOut({ redirectTo: "/" });
}

