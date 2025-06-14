import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";

interface EditButtonProps {
  editing: boolean;
  onToggle: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ editing, onToggle }) => (
  <Tooltip title={editing ? "保存" : "编辑"}>
    <button
      className="relative inline-flex rounded-md p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
      onClick={onToggle}
      type="button"
      aria-label={editing ? "保存" : "编辑"}
    >
      {editing ? <CheckIcon fontSize="small" /> : <EditIcon fontSize="small" />}
    </button>
  </Tooltip>
);

export default EditButton;
