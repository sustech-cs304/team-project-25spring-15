// app/components/ClientSessionSync.tsx
'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import type { User } from 'next-auth'

type SessionUser = User & { token: string }

interface Props {
  user: SessionUser | null
}

export default function ClientSessionSync({ user }: Props) {
  const setToken    = useStore(s => s.setToken)
  const setUserInfo = useStore(s => s.setUserInfo)
  const setLoggedIn = useStore(s => s.setLoggedIn)

  useEffect(() => {
    if (user) {
      setToken(user.token)
      // 映射 NextAuth 的 User 到你的 UserInfo 类型
      setUserInfo({
        userId:     Number(user.userId),
        userName:   user.userName,
        email:      user.email,
        usersign:   user.usersign,
        university: user.university,
        birthday:   user.birthday,
        identity:   user.identity,
      })
      setLoggedIn(true)
    }
  }, [user, setToken, setUserInfo, setLoggedIn])

  return null
}
