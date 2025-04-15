// TaskList.jsx
import React, { useState } from 'react';
import {
    Box,
    Card,
    Tabs,
    Tab,
    Typography,
    IconButton,
    InputBase,
    Paper,
    Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// 模拟的任务数据，增加了更多任务
const initialTasks = [
    {
        id: 1,
        title: '完成斐波那契数列联系',
        status: '已逾期',
        isUrgent: false,
        isDone: false,
    },
    {
        id: 2,
        title: '实现快速排序算法',
        status: '今日截止',
        isUrgent: true,
        isDone: false,
    },
    {
        id: 3,
        title: '实现二叉树遍历算法',
        status: '4月25日',
        isUrgent: false,
        isDone: false,
    },
    {
        id: 4,
        title: '解决递归问题',
        status: '已完成',
        isUrgent: false,
        isDone: true,
    },
    {
        id: 5,
        title: '编写冒泡排序',
        status: '今日截止',
        isUrgent: false,
        isDone: false,
    },
    {
        id: 6,
        title: '优化查找算法',
        status: '待完成',
        isUrgent: false,
        isDone: false,
    },
    {
        id: 7,
        title: '处理字符串操作',
        status: '已完成',
        isUrgent: false,
        isDone: true,
    },
];

// 顶部过滤Tab的四种类型
const filterOptions = ['全部', '待完成', '紧急', '已完成'];

const TaskListContainer = styled(Card)(({ theme }) => ({
    width: '90%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

const FilterTabsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '2px 8px',
    marginLeft: 'auto', // 使搜索框靠右对齐
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f0f0f0',
}));

const TaskRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 0),
    borderBottom: '1px solid #f0f0f0',
    ':last-child': {
        borderBottom: 'none',
    },
    cursor: 'pointer', // 添加指针样式
    '&:hover': {
        backgroundColor: theme.palette.action.hover, // 添加悬停效果
    }
}));

const StatusLabel = styled(Typography)(({ theme, color }) => ({
    color: color || theme.palette.text.primary,
    fontSize: '0.875rem',
}));

export default function ExercisesList({ onExerciseClick }) {
    const [tabValue, setTabValue] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [tasks] = useState(initialTasks);

    // Tab切换
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // 处理练习点击
    const handleTaskClick = (taskId) => {
        if (onExerciseClick) {
            onExerciseClick(taskId);
        }
    };

    // 根据当前过滤Tab和搜索文本对任务进行筛选
    const filteredTasks = tasks.filter((task) => {
        // 根据Tab过滤
        switch (tabValue) {
            case 1: // 待完成：不显示已完成的任务
                if (task.isDone) return false;
                break;
            case 2: // 紧急：仅保留紧急的（且未完成）
                if (!task.isUrgent || task.isDone) return false;
                break;
            case 3: // 已完成
                if (!task.isDone) return false;
                break;
            default:
                break;
        }
        // 搜索关键字过滤
        if (searchText && !task.title.includes(searchText)) {
            return false;
        }
        return true;
    });

    // 统计信息
    const total = tasks.length;
    const undoneCount = tasks.filter((t) => !t.isDone).length;
    const urgentCount = tasks.filter((t) => t.isUrgent && !t.isDone).length;

    return (
        <TaskListContainer>
            <FilterTabsContainer>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    {filterOptions.map((label) => (
                        <Tab key={label} label={label} />
                    ))}
                </Tabs>
                {/* 搜索框 */}
                <SearchContainer>
                    <IconButton sx={{ p: '4px' }} disabled>
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="搜索任务..."
                        inputProps={{ 'aria-label': '搜索任务' }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </SearchContainer>
            </FilterTabsContainer>

            {/* 任务列表 */}
            <Box>
                {filteredTasks.map((task) => {
                    // 根据任务状态设置显示颜色
                    let statusColor = '#555';
                    if (task.status === '已逾期') {
                        statusColor = 'red';
                    } else if (task.status === '今日截止') {
                        statusColor = 'orange';
                    } else if (task.isDone) {
                        statusColor = 'green';
                    }

                    return (
                        <TaskRow key={task.id} onClick={() => handleTaskClick(task.id)}>
                            {/* 在任务前显示状态图标 */}
                            <Box sx={{ mr: 1 }}>
                                {task.isDone ? (
                                    <CheckCircleIcon sx={{ color: 'green' }} />
                                ) : (
                                    <RadioButtonUncheckedIcon sx={{ color: 'gray' }} />
                                )}
                            </Box>
                            <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                {task.title}
                            </Typography>
                            <StatusLabel color={statusColor}>{task.status}</StatusLabel>
                        </TaskRow>
                    );
                })}
            </Box>

            {/* 底部统计与新建任务按钮 */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 1,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {`总计 ${total} 个任务，${undoneCount} 个待完成，${urgentCount} 个紧急`}
                </Typography>
                <Button variant="contained" color="primary">
                    新建任务
                </Button>
            </Box>
        </TaskListContainer>
    );
}

