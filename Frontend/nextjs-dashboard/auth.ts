import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { LoginResponse, UserInfo } from './app/lib/definitions';

// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//     return user[0];
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }

declare module "next-auth" {
  interface User {
    userId: string;
    userName: string;
    usersign?: string;
    university?: string;
    birthday?: string;
    identity?: string;
    token: string;
    email: string;
  }
}

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

          const responseJson = JSON.parse(responseText) as LoginResponse;
          const data = responseJson.data;

          if (data && typeof data.token === "string" && typeof data.userInfo === "object") {
            const { token, userInfo } = data as { token: string; userInfo: UserInfo };
            // 把 token 和用户信息都返回，token 会存到 session 里
            return {
              ...userInfo,
              token,
            };
          }

          return null;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 登录时 user 有值，把 user 信息存到 token
      if (user) {
        Object.assign(token, user);
      }
      return token;
    },
    async session({ session, token }) {
    // 把 token 里的所有字段挂到 session.user 上
      session.user = {
        ...(session.user || {}),
        userId: token.userId as string,
        userName: token.userName as string,
        email: token.email || "",
        usersign: token.usersign as string,
        university: token.university as string,
        birthday: token.birthday as string,
        identity: token.identity as string,
        token: token.token as string, // 这里的 token 是你的 JWT
      };
      return session;
    },
  },
});
