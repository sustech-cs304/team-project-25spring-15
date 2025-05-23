'use server';

import {auth, signIn, signOut} from '@/auth';
import { AuthError } from 'next-auth';
import { cookies } from 'next/headers';

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

