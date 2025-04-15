import React from "react";
import { AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Topbar() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#3f51b5" }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <IconButton sx={{ color: "white", mr: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "white",
                  borderRadius: "50%",
                }}
              />
            </IconButton>
          </motion.div>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CourseIDE
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton sx={{ bgcolor: "#e57373", color: "white" }}>
            <Box sx={{ width: 24, height: 24, borderRadius: "50%" }} />
          </IconButton>
          <IconButton sx={{ bgcolor: "#fff176", color: "white" }}>
            <Box sx={{ width: 24, height: 24, borderRadius: "50%" }} />
          </IconButton>
          <IconButton sx={{ bgcolor: "#81d4fa", color: "white" }}>
            <Box sx={{ width: 24, height: 24, borderRadius: "50%" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
