import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Document, Page } from 'react-pdf';

const Preview = ({ isLoading }) => {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, height: 'calc(100vh - 64px)' }}>
            <Typography variant="h6" gutterBottom>
                文档预览
            </Typography>

            {isLoading ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80%',
                        color: 'text.secondary',
                    }}
                >
                    文档加载中...
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80%',
                        color: 'text.secondary',
                    }}
                >
                    文档加载成功！
                </Box>
            )}
        </Box>
    );
};

export default Preview;
