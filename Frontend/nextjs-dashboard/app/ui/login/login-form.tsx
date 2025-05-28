'use client';

import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@mui/material';
import {ChangeEvent, FormEvent, useActionState} from 'react';
import { authenticate } from '@/app/lib/data';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { useStore } from '@/store/useStore';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  // 控制登录/注册模式切换
  const [isRegister, setIsRegister] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    userName: '',
    email: '',
    identity: 'student',
    password: '',
  });
  const [registerError, setRegisterError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理注册提交
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterError('');

    try {
      const token = useStore.getState().token;
      const payload = {
        user: registerForm
      }
      console.log('注册请求:', payload);
      const response = await axios.post('/api/user/createUser', payload, {headers: {Authorization: `Bearer ${token}`,}});
      console.log('注册成功:', response.data);
      setIsRegister(false);
    } catch (error) {
      console.error('注册失败:', error);
      setRegisterError('注册失败，请重试');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <form
      action={!isRegister ? formAction : undefined}
      onSubmit={isRegister ? handleRegister : undefined}
      className="space-y-3"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>
          {isRegister ? '创建新账号' : '请登录以继续'}
        </h1>
        <div className="w-full">
          {isRegister && (
            <div>
              <label
                className="mb-3 mt-5 block text-s font-medium text-gray-900"
                htmlFor="userName"
              >
                用户名
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-m outline-2 placeholder:text-gray-500"
                  id="userName"
                  type="text"
                  name="userName"
                  value={registerForm.userName}
                  onChange={handleChange}
                  placeholder="请输入用户名"
                  required
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          )}

          <div className={isRegister ? "mt-4" : ""}>
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
                value={isRegister ? registerForm.email : loginForm.email}
                onChange={isRegister ? handleChange : handleLoginChange}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {isRegister && (
            <div className="mt-4">
              <label
                className="mb-3 block text-s font-medium text-gray-900"
                htmlFor="identity"
              >
                身份
              </label>
              <div className="relative">
                <select
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-m outline-2"
                  id="identity"
                  name="identity"
                  value={registerForm.identity}
                  onChange={handleChange}
                  required
                >
                  <option value="student">学生</option>
                  <option value="teacher">教师</option>
                  <option value="superuser">管理员</option>
                </select>
              </div>
            </div>
          )}

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
                placeholder={isRegister ? "请设置密码" : "请输入密码"}
                value={isRegister ? registerForm.password : loginForm.password}
                onChange={isRegister ? handleChange : handleLoginChange}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {!isRegister && <input type="hidden" name="redirectTo" value={callbackUrl} />}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isRegister && isRegistering}
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
          {isRegister ? (isRegistering ? '注册中...' : '注册') : '登录'}
        </Button>

        <div className="flex h-8 items-end space-x-1">
          {(isRegister ? registerError : errorMessage) && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{isRegister ? registerError : errorMessage}</p>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isRegister ? '已有账号？返回登录' : '没有账号？立即注册'}
          </button>
        </div>
      </div>
    </form>
  );
}
