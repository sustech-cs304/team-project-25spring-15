import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentViewer from './ContentViewer'; // 你已有的PDF组件
import CodeEditor from './CodeEditor';       // 简单的代码示例

const UpperBox = styled(Box)(({ theme }) => ({
    height: '50%', // 上半部分高度
    overflow: 'auto',
}));

const LowerBox = styled(Box)(({ theme }) => ({
    height: '50%', // 下半部分高度
    overflow: 'auto',
}));

const CoursewareView = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 上方：PDF 显示 */}
            <UpperBox>
                <ContentViewer />
            </UpperBox>

            <Divider />

            {/* 下方：代码示例 */}
            {/* <LowerBox sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>
                    代码示例
                </Typography>
                <Box sx={{ height: 'calc(100% - 32px)', overflow: 'auto' }}> */}
                    {/* 这里放简易 code editor, 也可复用NotesSection的某个代码单元 */}
                    {/* <CodeEditor
                        value="// 这里是课件相关的代码示例"
                        language="javascript"
                        onChange={() => {}}
                    />
                </Box>
            </LowerBox> */}
        </Box>
    );
};

export default CoursewareView;
