// src/components/ExercisesContainer.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import ExercisesList from './ExercisesList';
import ExercisesView from './ExercisesView';
import mocked_exercise from '../mock/data'; // 导入模拟数据

const ExercisesContainer = () => {
    const [showExerciseDetail, setShowExerciseDetail] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    // 准备练习内容数据
    const exerciseContents = {
        1: "# 斐波那契数列\n\n实现一个函数，计算斐波那契数列的第n项。\n\n```javascript\nfunction fibonacci(n) {\n  // 请在此实现\n}\n```",
        2: "# 快速排序\n\n请实现快速排序算法，对给定数组进行排序。\n\n```javascript\nfunction quickSort(arr) {\n  // 请在此实现\n}\n```",
        3: "# 二叉树遍历\n\n请实现二叉树的前序、中序和后序遍历。\n\n```javascript\nfunction preOrder(root) {\n  // 请在此实现\n}\n\nfunction inOrder(root) {\n  // 请在此实现\n}\n\nfunction postOrder(root) {\n  // 请在此实现\n}\n```",
        4: "# 递归问题\n\n请使用递归实现阶乘函数。\n\n```javascript\nfunction factorial(n) {\n  // 请在此实现\n}\n```",
        5: "# 冒泡排序\n\n请实现冒泡排序算法。\n\n```javascript\nfunction bubbleSort(arr) {\n  // 请在此实现\n}\n```",
        6: "# 二分查找\n\n请实现二分查找算法。\n\n```javascript\nfunction binarySearch(arr, target) {\n  // 请在此实现\n}\n```",
        7: "# 字���串操作\n\n请实现一个函数，判断字符串是否为回文。\n\n```javascript\nfunction isPalindrome(str) {\n  // 请在此实现\n}\n```"
    };

    // 处理练习项点击
    const handleExerciseClick = (exerciseId) => {
        const content = exerciseContents[exerciseId] || mocked_exercise;
        setSelectedExercise({ id: exerciseId, content });
        setShowExerciseDetail(true);
    };

    // 返回列表
    const handleBackToList = () => {
        setShowExerciseDetail(false);
    };

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
            {showExerciseDetail ? (
                <ExercisesView
                    exerciseContent={selectedExercise.content}
                    exerciseId={selectedExercise.id}
                    onBack={handleBackToList}
                />
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <ExercisesList onExerciseClick={handleExerciseClick} />
                </Box>
            )}
        </Box>
    );
};

export default ExercisesContainer;