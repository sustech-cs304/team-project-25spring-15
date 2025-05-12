// src/store/useStore.ts
import { create } from 'zustand';
import { UserInfo, Course, Lecture } from '@/app/lib/definitions';

interface Store {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;

  courses: Course[];
  setCourses: (c: Course[]) => void;

  lectures: Lecture[];
  setLectures: (l: Lecture[]) => void;

  selectedCourseId: number | null;
  setSelectedCourseId: (id: number | null) => void;

  selectedLectureId: number | null;
  setSelectedLectureId: (id: number | null) => void;
}

export const useStore = create<Store>((set) => ({
  // —— 初始 State ——
  userInfo: null,
  isLoggedIn: false,
  courses: [],
  lectures: [],
  selectedCourseId: null,
  selectedLectureId: null,

  // —— 修改方法 ——
  setUserInfo: (info) => set({ userInfo: info }),
  setLoggedIn: (status) => set({ isLoggedIn: status }),

  setCourses: (c) => set({ courses: c }),
  setLectures: (l) => set({ lectures: l }),

  setSelectedCourseId: (id) => set({ selectedCourseId: id }),
  setSelectedLectureId: (id) => set({ selectedLectureId: id }),
}));


