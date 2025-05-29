import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { AcademicCapIcon, BookOpenIcon, CodeBracketIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 动态渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        {/* 动画背景元素 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* 左侧内容 */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo/品牌 */}
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">SUSTech Intelligent CourseIDE</h1>
            </div>

            {/*/!* 主标题 *!/*/}
            {/*<div className="space-y-4">*/}
            {/*  <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">*/}
            {/*    智能学习*/}
            {/*    <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">*/}
            {/*      新体验*/}
            {/*    </span>*/}
            {/*  </h2>*/}
            {/*  <p className="text-xl text-blue-100 max-w-md mx-auto lg:mx-0 leading-relaxed">*/}
            {/*    集成代码编辑、在线运行、智能评测于一体的现代化教学平台*/}
            {/*  </p>*/}
            {/*</div>*/}

            {/* 功能特点 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center space-x-2 text-white">
                <CodeBracketIcon className="w-5 h-5 text-yellow-200" />
                <span className="text-sm">在线编程</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <BookOpenIcon className="w-5 h-5 text-yellow-200" />
                <span className="text-sm">课程管理</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <SparklesIcon className="w-5 h-5 text-yellow-200" />
                <span className="text-sm">智能评测</span>
              </div>
            </div>

            {/* CTA按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-blue-50"
              >
                <span>开始学习</span>
                <ArrowRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                了解更多
              </button>
            </div>

            {/* 统计数据 */}
            <div className="flex justify-center lg:justify-start space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5</div>
                <div className="text-blue-200 text-sm">活跃学习者</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1</div>
                <div className="text-blue-200 text-sm">优质课程</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-blue-200 text-sm">满意度</div>
              </div>
            </div>
          </div>

          {/* 右侧视觉元素 */}
          <div className="relative">
            {/* 主要卡片 */}
            <div className="relative">
              {/* 代码编辑器模拟 */}
              <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-gray-400 text-sm">main.cpp</span>
                </div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-purple-400">#include {"<iostream>"}</div>
                  <div className="text-blue-400">using namespace std;</div>
                  <div className="text-gray-400">// Your code here</div>
                  <div className="text-yellow-400">int main() {"{"}</div>
                  <div className="ml-4 text-green-400">cout {"<<"} &quot;Hello World!&quot;;</div>
                  <div className="ml-4 text-pink-400">return 0;</div>
                  <div className="text-yellow-400">{"}"}</div>
                </div>
              </div>

              {/* 浮动元素 */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-200 rounded-2xl shadow-lg animate-bounce opacity-80"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-200 rounded-full shadow-lg animate-pulse opacity-80"></div>

              {/* 成绩卡片 */}
              <div className="absolute top-1/2 -right-8 bg-white rounded-xl shadow-xl p-4 transform -translate-y-1/2 animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <div className="text-gray-800 font-semibold">测试通过</div>
                    <div className="text-gray-500 text-xs">100/100 分</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </main>
  );
}
