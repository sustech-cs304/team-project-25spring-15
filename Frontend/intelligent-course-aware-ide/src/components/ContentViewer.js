import React, { useState, useEffect } from 'react';
import {Box, AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Card} from '@mui/material';
import { styled } from '@mui/material/styles';
// import { Add as AddIcon, Delete as DeleteIcon, PlayArrow as RunIcon } from '@mui/icons-material';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const ContentViewerContainer = styled(Card)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
}));

const ContentViewer = () => {
    const [file, setFile] = useState(null);  // 存储文件的 URL
    const [fileId, setFileId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1); 

    // 1. 加载已经上传的文件
    const loadPdfFile = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:4523/m1/5989566-5677982-default/api/getNoteBook`);
            if (response.data && response.data.fileId) {
                const { fileId } = response.data;
                setFileId(fileId);
                // 请求获取 PDF 数据流
                const pdfResponse = await axios.get(`http://127.0.0.1:4523/m1/5989566-5677982-default/api/get-pdf/${fileId}`, {
                    responseType: 'blob',
                });
                const fileURL = URL.createObjectURL(pdfResponse.data);
                setFile(fileURL);
            }
        } catch (err) {
            setError("加载 PDF 文件失败，请重试！");
            console.error(err);
        }
    };

    useEffect(() => {
        const testMode = true;

        if (testMode) {
            // 使用public文件夹中的PDF (假设你放了一个sample.pdf在public文件夹)
            setFile('/mockedPdf.pdf');
        } else {
            // 原来的加载逻辑
            loadPdfFile();
        }
    }, []);

    // 2. 上传文件
    const handleFileUpload = async (event) => {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await axios.post('http://127.0.0.1:4523/m1/5989566-5677982-default/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { fileId } = response.data;
            setFileId(fileId);  // 存储文件 ID
            // 请求获取 PDF 数据流
            const pdfResponse = await axios.get(`http://127.0.0.1:4523/m1/5989566-5677982-default/api/get-pdf/${fileId}`, {
                responseType: 'blob',
            });

            const fileURL = URL.createObjectURL(pdfResponse.data);
            setFile(fileURL);  // 设置 PDF URL 来展示
        } catch (err) {
            setError("文件上传失败，请重试！");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <ContentViewerContainer>
            {/* 如果没有文件，显示提示和上传按钮 */}
            {!file ? (
                <Box>
                    <Box sx={{ bgcolor: '#ffffff', borderRadius: 1, textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            当前没有上传文件
                        </Typography>
                        {loading && <CircularProgress sx={{ mt: 2 }} />}
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    </Box>
                    <Button variant="contained" component="label">
                        上传文件
                        <input type="file" hidden onChange={handleFileUpload} />
                    </Button>
                </Box>
            ) : (
                // 如果上传了文件，展示 PDF
                <Box>
                    <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 1, height: 510, overflow: 'auto' }}>
                        <Typography variant="h4" gutterBottom>
                            PDF 预览
                        </Typography>
                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber} width={800} renderTextLayer={false} renderAnnotationLayer={false}/>
                        </Document>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                        <Button 
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber(pageNumber - 1)}
                            variant="contained"
                            sx={{ mx: 1 }}
                        >
                            上一页
                        </Button>
                        
                        <Typography variant="body1" sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
                            第 {pageNumber} 页 / 共 {numPages} 页
                        </Typography>
                        
                        <Button 
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber(pageNumber + 1)}
                            variant="contained"
                            sx={{ mx: 1 }}
                        >
                            下一页
                        </Button>
                    </Box>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        {file && (
                            <Button onClick={handleFileUpload} variant="contained" component="label">
                                覆盖上传文件
                                <input type="file" hidden onChange={handleFileUpload} />
                            </Button>
                        )}
                    </Box>
                </Box>
            )}
        </ContentViewerContainer>
    );
};

export default ContentViewer;
