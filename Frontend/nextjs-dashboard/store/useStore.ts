// src/store/useStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserInfo, Course, Lecture } from '@/app/lib/definitions';

interface Store {
  token: string;
  setToken: (token: string) => void;
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
  courses: Course[];
  setCourses: (c: Course[]) => void;
  lectures: Lecture[];
  setLectures: (l: Lecture[]) => void;
  selectedCourseId: number;
  setSelectedCourseId: (id: number) => void;
  selectedLectureId: number;
  setSelectedLectureId: (id: number) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // —— 初始 State ——
      token: '',
      userInfo: null,
      isLoggedIn: false,
      courses: [],
      lectures: [],
      selectedCourseId: 0,
      selectedLectureId: 0,

      // —— 修改方法 ——
      setToken: (token) => set({ token }),
      setUserInfo: (info) => set({ userInfo: info }),
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      setCourses: (c) => set({ courses: c }),
      setLectures: (l) => set({ lectures: l }),
      setSelectedCourseId: (id) => set({ selectedCourseId: id }),
      setSelectedLectureId: (id) => set({ selectedLectureId: id }),
    }),
    {
      name: 'my-app-storage',                               // localStorage 的 key
      storage: createJSONStorage(() => localStorage),       // 或者 sessionStorage
      // 如果只想持久化部分字段，可加 whitelist/blacklist：
      // whitelist: ['token', 'isLoggedIn']
    }
  )
);
