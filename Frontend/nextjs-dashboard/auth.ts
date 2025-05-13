import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { fakeUser } from './app/lib/mocked-data';

// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//     return user[0];
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // const user = await getUser(email);

          // 调用后端登录接口
          const response = await fetch('http://47.117.144.50:8000/api/user/loginUser', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "userLogin": { "email": email, "password": password } })
          });

          if (!response.ok) return null;

          const responseText = await response.text();
          console.log('response body:', responseText);

          const response_json = JSON.parse(responseText);
          const data = response_json.data;

          if (data && data.token && data.userInfo) {
          // 把 token 和用户信息都返回，token 会存到 session 里
            return {
              ...data.userInfo,
              token: data.token,
            };
          }

          return null;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],

});
