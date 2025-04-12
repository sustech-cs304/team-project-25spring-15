import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ContentViewerContainer = styled(Paper)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
}));

const ContentViewer = () => {
    return (
        <ContentViewerContainer elevation={1}>
            {/* 这里替换为你的实际内容组件 */}
            <Box sx={{ bgcolor: '#fafafa', p: 2, borderRadius: 1, height: 450 }}>
                <Typography variant="h4" gutterBottom>
                    TAKEAWAYS
                </Typography>
                <Typography variant="h6" gutterBottom>
                    "Plan to throw one away; you will, anyhow."
                </Typography>
                <Typography paragraph>
                    要有丢弃一个版本的心理准备，因为你做的第一个总会这样。
                </Typography>
            </Box>
        </ContentViewerContainer>
    );
};

export default ContentViewer;
