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
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import { userLogOut } from "@/app/lib/data";
import { User } from "next-auth";

interface TopbarProps {
  user?: User;
}

export default function Topbar({ user }: TopbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important" }}>
        {/* 左侧品牌Logo和标题 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <SchoolIcon 
              sx={{ 
                fontSize: 32, 
                color: "white",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
              }} 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                letterSpacing: "0.5px"
              }}
            >
              SUSTech CourseIDE
            </Typography>
          </motion.div>
        </Box>

        {/* 中间弹性空间 */}
        <Box sx={{ flexGrow: 1 }} />

        {/* 右侧用户信息 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                cursor: "pointer",
                px: 2,
                py: 1,
                borderRadius: 2,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)"
                }
              }}
              onClick={handleAvatarClick}
            >
              {/* 用户名显示 */}
              <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: "white", 
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}
                >
                  {user?.userName || 'Guest'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "rgba(255, 255, 255, 0.8)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}
                >
                  {user?.identity || 'User'}
                </Typography>
              </Box>

              {/* 用户头像 */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)"
                  }
                }}
              >
                {getUserInitials(user?.userName)}
              </Avatar>
            </Box>
          </motion.div>

          {/* 用户菜单 */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                minWidth: 280,
                mt: 1,
                borderRadius: 3,
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(20px)",
                overflow: "visible",
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 20,
                  width: 12,
                  height: 12,
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                  transform: "translateY(-50%) rotate(45deg)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  borderBottom: "none",
                  borderRight: "none",
                },
              },
            }}
          >
            {/* 用户信息头部 */}
            <Box sx={{ px: 3, py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                  }}
                >
                  {getUserInitials(user?.userName)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#2d3748" }}>
                    {user?.userName || 'Guest User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    {user?.email || 'No email provided'}
                  </Typography>
                  {user?.university && (
                    <Typography variant="caption" sx={{ color: "#a0aec0" }}>
                      {user.university}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(113, 128, 150, 0.2)" }} />

            {/* 个人信息菜单项 */}
            <MenuItem 
              onClick={handleClose}
              sx={{ 
                py: 1.5, 
                px: 3,
                "&:hover": { 
                  backgroundColor: "rgba(102, 126, 234, 0.08)",
                  "& .MuiListItemIcon-root": {
                    color: "#667eea"
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonIcon sx={{ color: "#718096" }} />
              </ListItemIcon>
              <ListItemText 
                primary="个人资料" 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                  color: "#2d3748"
                }}
              />
            </MenuItem>

            <Divider sx={{ borderColor: "rgba(113, 128, 150, 0.2)" }} />

            {/* 退出登录 */}
            <form action={userLogOut}>
              <MenuItem 
                component="button"
                type="submit"
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  width: "100%",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  "&:hover": { 
                    backgroundColor: "rgba(244, 67, 54, 0.08)",
                    "& .MuiListItemIcon-root": {
                      color: "#f44336"
                    },
                    "& .MuiTypography-root": {
                      color: "#f44336"
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon sx={{ color: "#718096" }} />
                </ListItemIcon>
                <ListItemText 
                  primary="退出登录" 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: "#2d3748"
                  }}
                />
              </MenuItem>
            </form>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
