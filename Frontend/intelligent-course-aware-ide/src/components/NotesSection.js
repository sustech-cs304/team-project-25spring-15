import React, { useState, useEffect } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    KeyboardArrowUp as UpIcon,
    KeyboardArrowDown as DownIcon,
    PlayArrow as RunIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { debounce } from 'lodash';
import CodeEditor from './CodeEditor';
import MarkdownEditor from './MarkdownEditor';

const NotesContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
}));

const CellsWrapper = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
}));

const CellContainer = styled(Paper)(({ theme, active }) => ({
    marginBottom: theme.spacing(2),
    border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    cursor: 'pointer',
    // 初始阴影，悬浮时阴影加深
    boxShadow: theme.shadows[1],
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const NotesSection = () => {
    // cells 数组中，每个对象代表一个单元格，有Code和Markdown两种类型，数据结构如下：
    // { id, type, content, language, executionResult }
    const [cells, setCells] = useState([
        {
            id: uuidv4(),
            type: 'code',
            content: '// 示例代码\nconsole.log("Hello World");',
            language: 'javascript',
            executionResult: '',
        },
        {
            id: uuidv4(),
            type: 'markdown',
            content: '### 示例 Markdown\n\n这是一段示例文本。',
            language: '',
            executionResult: '',
        },
    ]);

    const [activeCellId, setActiveCellId] = useState(cells[0]?.id || null);

    const loadNotebook = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:4523/m1/5989566-5677982-default/api/getNoteBook');
            // 假设后端返回一个 cell 数组（如果接口返回 { cells: [...] }，请调整为 response.data.cells）
            if (response.data && Array.isArray(response.data)) {
                setCells(response.data);
                setActiveCellId(response.data[0]?.id || null);
            } else {
                console.error('返回数据格式不正确', response.data);
            }
        } catch (error) {
            console.error('加载 Notebook 失败:', error);
        }
    };

    // 在组件挂载时加载 Notebook 数据
    useEffect(() => {
        loadNotebook();
    }, []);

    // 自动保存功能（使用 lodash 的 debounce 防抖）
    const autoSaveNotebook = async () => {
        try {
            console.log(cells);
            await axios.post('http://127.0.0.1:4523/m1/5989566-5677982-default/api/saveNoteBook', {
                cells,
            });
            console.log("自动保存成功");
        } catch (error) {
            console.error("自动保存失败:", error);
        }
    };

    // 延时1秒后自动执行，如果1秒内cells改变则重新计时
    const debouncedAutoSave = debounce(autoSaveNotebook, 1000);

    // 每当 cells 发生变化时自动保存
    useEffect(() => {
        debouncedAutoSave();
        return () => debouncedAutoSave.cancel();
    }, [cells]);

    // 添加：在当前活动 cell 后添加一个新的 cell
    const handleAddCell = () => {
        const newCell = {
            id: uuidv4(),
            type: 'code',
            content: '// 新的代码单元',
            language: 'javascript',
            executionResult: '',
        };
        if (activeCellId) {
            const index = cells.findIndex(cell => cell.id === activeCellId);
            const newCells = [...cells];
            newCells.splice(index + 1, 0, newCell);
            setCells(newCells);
            setActiveCellId(newCell.id);
        } else {
            setCells([...cells, newCell]);
            setActiveCellId(newCell.id);
        }
    };

    // 删除：删除当前活动 cell
    const handleDeleteCell = () => {
        if (!activeCellId) return;
        const newCells = cells.filter(cell => cell.id !== activeCellId);
        setCells(newCells);
        setActiveCellId(newCells[0]?.id || null);
    };

    // 上移
    const handleMoveUp = () => {
        if (!activeCellId) return;
        const index = cells.findIndex(cell => cell.id === activeCellId);
        if (index <= 0) return;
        const newCells = [...cells];
        [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
        setCells(newCells);
    };

    // 下移
    const handleMoveDown = () => {
        if (!activeCellId) return;
        const index = cells.findIndex(cell => cell.id === activeCellId);
        if (index === -1 || index >= cells.length - 1) return;
        const newCells = [...cells];
        [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
        setCells(newCells);
    };

    // 运行：如果当前 cell 为代码单元，将代码发送给后端执行，获取返回结果更新 executionResult
    const handleRun = async () => {
        if (!activeCellId) return;
        const cell = cells.find(cell => cell.id === activeCellId);
        if (cell && cell.type === 'code') {
            try {
                const response = await axios.post('http://your-backend-api/execute', {
                    language: cell.language,
                    code: cell.content,
                });
                const result = response.data.result || '无返回结果';
                setCells(prevCells =>
                    prevCells.map(c =>
                        c.id === activeCellId ? { ...c, executionResult: result } : c
                    )
                );
                alert("运行结果:\n" + result);
            } catch (error) {
                console.error("运行代码出错:", error);
                alert("运行代码出错:\n" + error.message);
            }
        } else {
            alert("当前活动单元不是代码单元！");
        }
    };

    // 更新单元内容
    const updateCellContent = (id, content) => {
        setCells(prevCells =>
            prevCells.map(cell => (cell.id === id ? { ...cell, content } : cell))
        );
    };

    // 根据 cell 类型渲染对应的编辑器组件
    const renderCell = (cell) => {
        const isActive = cell.id === activeCellId;
        return (
            <CellContainer
                key={cell.id}
                active={isActive ? 1 : 0}
                onClick={() => setActiveCellId(cell.id)}
            >
                {cell.type === 'code' ? (
                    <CodeEditor
                        value={cell.content}
                        language={cell.language}
                        onChange={(newCode) => updateCellContent(cell.id, newCode)}
                    />
                ) : (
                    <MarkdownEditor
                        value={cell.content}
                        onChange={(newContent) => updateCellContent(cell.id, newContent)}
                    />
                )}
                {cell.type === 'code' && cell.executionResult && (
                    <Box sx={{ mt: 1, p: 1, border: '1px solid #ccc', borderRadius: 1, backgroundColor: '#f0f0f0' }}>
                        <Typography variant="body2">运行结果:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {cell.executionResult}
                        </Typography>
                    </Box>
                )}
            </CellContainer>
        );
    };

    return (
        <NotesContainer>
            {/* 局部工具栏，固定在 NotesSection 部分的上方 */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    backgroundColor: '#fff',
                    color: 'inherit',
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
                        Notebook
                    </Typography>
                    <IconButton color="inherit" onClick={handleAddCell}>
                        <AddIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleDeleteCell}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleMoveUp}>
                        <UpIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleMoveDown}>
                        <DownIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleRun}>
                        <RunIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {/* CellsWrapper：滚动区域 */}
            <CellsWrapper>{cells.map(renderCell)}</CellsWrapper>
        </NotesContainer>
    );
};

export default NotesSection;
