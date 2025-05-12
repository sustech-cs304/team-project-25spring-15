'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useStore } from '@/store/useStore';
import { api } from '@/api';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { setUserInfo, setLoggedIn } = useStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log('email: ', email, 'password: ', password);

    try {
      const response = await api.post('/user/loginUser', {
        userLogin: {
          email: email,
          password: password
        }
      });

      console.log('登录成功的响应数据', response.data);

      const { success, userInfo, token } = response.data.data;

      console.log('success: ', success, 'userInfo: ', userInfo, 'token: ', token);

      if (success) {
        setUserInfo({
          userId: userInfo.userId,
          username: userInfo.username,
          email: userInfo.email,
          token: token,
        });
        setLoggedIn(true);

        if (response.data.token) {
          // 存储token到localStorage
          localStorage.setItem('token', response.data.token);
        }

        console.log('准备跳转到:', callbackUrl);
        try {
          router.push(callbackUrl);
          console.log('路由跳转已执行');
        } catch (error) {
          console.error('路由跳转出错:', error);
        }
      } else {
        setErrorMessage('登录失败：无效的响应格式');
      }
    } catch (error) {
      console.error('登录失败', error);

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setErrorMessage('用户名或密码错误');
        } else if (error.response.status === 429) {
          setErrorMessage('请求过于频繁，请稍后再试');
        } else {
          setErrorMessage(`登录失败: ${error.response.data?.message || '未知错误'}`);
        }
      } else {
        setErrorMessage('登录失败：网络错误或服务器无响应');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          请登录以继续
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-s font-medium text-gray-900"
              htmlFor="email"
            >
              邮箱
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-m outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="请输入邮箱地址"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-s font-medium text-gray-900"
              htmlFor="password"
            >
              密码
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-m outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="请输入密码"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth
          sx={{
            mt: 2,
            fontSize: '1.2rem',
            textTransform: 'none',
            backgroundColor: 'black',
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: '#222',
            },
          }}
        >
          {isLoading ? '登录中...' : '登录'}
        </Button>
        <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}



// 'use client';
//
// import { lusitana } from '@/app/ui/fonts';
// import {
//   AtSymbolIcon,
//   ExclamationCircleIcon,
//   KeyIcon,
// } from '@heroicons/react/24/outline';
// import { Button } from '@mui/material';
// import { useActionState } from 'react';
// import { authenticate } from '@/app/lib/data';
// import { useSearchParams } from 'next/navigation';
//
// export default function LoginForm() {
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
//   const [errorMessage, formAction, isPending] = useActionState(
//     authenticate,
//     undefined,
//   );
//
//   return (
//     <form action={formAction} className="space-y-3">
//       <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
//         <h1 className={`${lusitana.className} mb-3 text-2xl`}>
//           Please log in to continue.
//         </h1>
//         <div className="w-full">
//           <div>
//             <label
//               className="mb-3 mt-5 block text-s font-medium text-gray-900"
//               htmlFor="email"
//             >
//               Email
//             </label>
//             <div className="relative">
//               <input
//                 className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-m outline-2 placeholder:text-gray-500"
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email address"
//                 required
//               />
//               <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
//             </div>
//           </div>
//           <div className="mt-4">
//             <label
//               className="mb-3 mt-5 block text-s font-medium text-gray-900"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-m outline-2 placeholder:text-gray-500"
//                 id="password"
//                 type="password"
//                 name="password"
//                 placeholder="Enter password"
//                 required
//                 minLength={6}
//               />
//               <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
//             </div>
//           </div>
//         </div>
//         <input type="hidden" name="redirectTo" value={callbackUrl} />
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{
//             mt: 2,
//             // py: 1.5,
//             // fontWeight: 'bold',
//             fontSize: '1.2rem',
//             textTransform: 'none',
//             backgroundColor: 'black', // 背景色
//             borderRadius: '12px', // 圆角
//             '&:hover': {
//               backgroundColor: '#222', // 悬停时更深色
//             },
//           }}
//         >
//           Log in
//         </Button>
//         <div className="flex h-8 items-end space-x-1">
//           {errorMessage && (
//             <>
//               <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
//               <p className="text-sm text-red-500">{errorMessage}</p>
//             </>
//           )}
//         </div>
//       </div>
//     </form>
//   );
// }
