"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import { userLogOut } from "@/app/lib/actions";

const user = {
  name: "张三",
  email: "zhangsan@example.com",
};

export default function Topbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            <IconButton
              sx={{ color: "white", mr: 1 }}
              onClick={handleAvatarClick}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "white",
                  borderRadius: "50%",
                }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                sx: {
                  minWidth: 220,
                  p: 1,
                  borderRadius: 2,
                  boxShadow: 3,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Box sx={{ my: 1 }}>
                <hr style={{ border: 0, borderTop: "1px solid #eee" }} />
              </Box>
              <form action={userLogOut}>
                <button
                  type="submit"
                  style={{
                    color: "#d32f2f",
                    background: "none",
                    border: "none",
                    width: "100%",
                    padding: "8px 0",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#ededed")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  Log out
                </button>
              </form>
            </Menu>
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
}
