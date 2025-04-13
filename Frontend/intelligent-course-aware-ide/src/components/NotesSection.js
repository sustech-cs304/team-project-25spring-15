import React, { useState, useEffect } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Paper,
    Menu,
    MenuItem
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
import { motion } from 'framer-motion';

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
    boxShadow: theme.shadows[1],
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const NotesSection = () => {
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

    const [anchorEl, setAnchorEl] = useState(null); // 控制下拉框的位置

    const handleAddCellClick = (event) => {
        setAnchorEl(event.currentTarget); // 打开菜单
    };

    const handleCloseMenu = () => {
        setAnchorEl(null); // 关闭菜单
    };

    const handleAddCodeCell = () => {
        const newCell = {
            id: uuidv4(),
            type: 'code',
            content: '// 新的代码单元',
            language: 'javascript',
            executionResult: '',
        };
        addCell(newCell);
        handleCloseMenu();
    };

    const handleAddMarkdownCell = () => {
        const newCell = {
            id: uuidv4(),
            type: 'markdown',
            content: '### 新的Markdown单元',
            language: '',
            executionResult: '',
        };
        addCell(newCell);
        handleCloseMenu();
    };

    const addCell = (newCell) => {
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

    const loadNotebook = async () => {
        try {
            const response = await axios.get('https://m1.apifoxmock.com/m1/5989566-5677982-default/api/getNoteBook');
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

    useEffect(() => {
        loadNotebook();
    }, []);

    const handleDeleteCell = () => {
        if (!activeCellId) return;
        const newCells = cells.filter(cell => cell.id !== activeCellId);
        setCells(newCells);
        setActiveCellId(newCells[0]?.id || null);
    };

    const handleMoveUp = () => {
        if (!activeCellId) return;
        const index = cells.findIndex(cell => cell.id === activeCellId);
        if (index <= 0) return;
        const newCells = [...cells];
        [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
        setCells(newCells);
    };

    const handleMoveDown = () => {
        if (!activeCellId) return;
        const index = cells.findIndex(cell => cell.id === activeCellId);
        if (index === -1 || index >= cells.length - 1) return;
        const newCells = [...cells];
        [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
        setCells(newCells);
    };

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

    const updateCellContent = (id, content) => {
        setCells(prevCells =>
            prevCells.map(cell => (cell.id === id ? { ...cell, content } : cell))
        );
    };

    const renderCell = (cell) => {
        const isActive = cell.id === activeCellId;
        return (
            <motion.div
                key={cell.id}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{ opacity: 0, y: -10 }}
                transition={{duration: 0.3}}
            >
                <CellContainer
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
                        <Box sx={{mt: 1, p: 1, border: '1px solid #ccc', borderRadius: 1, backgroundColor: '#f0f0f0'}}>
                            <Typography variant="body2">运行结果:</Typography>
                            <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>
                                {cell.executionResult}
                            </Typography>
                        </Box>
                    )}
                </CellContainer>
            </motion.div>
        );
    };

    return (
        <NotesContainer>
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
                    <Typography variant="h6" sx={{flexGrow: 1, color: 'text.primary'}}>
                        Notebook
                    </Typography>
                    <IconButton color="inherit" onClick={handleAddCellClick}>
                        <AddIcon/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem onClick={handleAddCodeCell}>添加代码单元</MenuItem>
                        <MenuItem onClick={handleAddMarkdownCell}>添加Markdown单元</MenuItem>
                    </Menu>
                    <IconButton color="inherit" onClick={handleDeleteCell}>
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleMoveUp}>
                        <UpIcon/>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleMoveDown}>
                        <DownIcon/>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleRun}>
                        <RunIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <CellsWrapper>{cells.map(renderCell)}</CellsWrapper>
        </NotesContainer>
    );
};

export default NotesSection;
