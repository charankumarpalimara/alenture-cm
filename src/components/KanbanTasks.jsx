import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Grid,
  useMediaQuery
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { message } from "antd";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useTasks } from "../utils/TasksContext";
import {
  Add as AddIcon,
} from "@mui/icons-material";

const columnDefinitions = [
  { key: "To Do", title: "To Do", color: "#ef4444", icon: "📋" },
  { key: "In Progress", title: "In Progress", color: "#f97316", icon: "🔄" },
  { key: "Done", title: "Done", color: "#22c55e", icon: "✅" },
];

const priorityOptions = ["High", "Medium", "Low"];

function STATUS_TO_COLUMN_KEY(status) {
  if (!status) return "To Do";
  const s = status.toLowerCase().replace(/\s|_/g, "");
  if (s === "todo" || s === "new") return "To Do";
  if (["inprogress", "progress", "started", "working"].includes(s)) return "In Progress";
  if (["completed", "complete", "done", "closed", "finished"].includes(s)) return "Done";
  return "To Do";
}

function KanbanBoard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const isMobile = useMediaQuery("(max-width:484px)");
    const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [addValues, setAddValues] = useState({
    taskName: "",
    taskDescription: "",
    taskOwner: "",
    taskPriority: "Medium",
    taskStatus: "To Do",
  });

  const { tasks, loading, addTask, editTask, deleteTask } = useTasks();

  const kanbanData = tasks.map(task => {
    const ownerName = task.taskownername || task.taskowner || task.owner || "User";
    return {
      Id: String(task.id),
      Title: task.taskname || task.content,
      Description: task.description || task.discription || "",
      Owner: ownerName,
      Priority: task.priority || "Medium",
      Status: STATUS_TO_COLUMN_KEY(task.status),
      Tags: (task.tags || task.priority || ""),
      Assignee: ownerName,
      Avatar: ownerName.split(" ").map(w => w[0]).join("").toUpperCase()
    };
  });

  // Add Task
  const handleAddSave = async () => {
    if (!addValues.taskName || !addValues.taskOwner) {
      message.error("Task Name and Owner required");
      return;
    }
        setAddLoading(true);
    const formData = new FormData();
    formData.append("taskname", addValues.taskName);
    formData.append("taskowner", addValues.taskOwner);
    formData.append("priority", addValues.taskPriority);
    formData.append("discription", addValues.taskDescription);
    formData.append("status", addValues.taskStatus);
    // experienceid and crmid will be added in context/provider
    try {
      await addTask(formData);
      message.success("Task created successfully!");
      setAddOpen(false);
      setAddValues({
        taskName: "",
        taskDescription: "",
        taskOwner: "",
        taskPriority: "Medium",
        taskStatus: "To Do",
      });
    } catch (err) {
      message.error("Failed to create task!");
    }
        setAddLoading(false);
  };

  // Edit Task
  const handleEditCard = (card) => {
    setEditingCard(card);
    setAddValues({
      taskName: card.Title,
      taskDescription: card.Description,
      taskOwner: card.Owner,
      taskPriority: card.Priority,
      taskStatus: card.Status,
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingCard) return;
        setEditLoading(true);
    try {
      await editTask(editingCard.Id, {
        taskname: addValues.taskName,
        discription: addValues.taskDescription,
        taskowner: addValues.taskOwner,
        priority: addValues.taskPriority,
        status: addValues.taskStatus,
      });
      message.success("Task updated successfully!");
      setEditOpen(false);
      setEditingCard(null);
    } catch (err) {
      message.error("Failed to update task!");
    }
        setEditLoading(false);
  };

  // Delete Task
  const handleDeleteClick = (id) => {
    setDeletingTaskId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
        setDeleteLoading(true);
    try {
      await deleteTask(deletingTaskId);
      setDeleteDialogOpen(false);
      setDeletingTaskId(null);
      message.success("Task deleted successfully!");
    } catch (err) {
      message.error("Failed to delete task!");
    }
        setDeleteLoading(false);
  };

  return (
    <Box sx={{
      width: "100%",
      py: 4,
      px: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          sx={{
                  background: colors.blueAccent[1000],
                      fontWeight: "600",
                      color: "#ffffff",
                      whiteSpace: "nowrap",
                      textTransform: "none",
                      "&:hover": { backgroundColor: colors.blueAccent[600] },
                      width: isMobile ? "45%" : "20%",
                      fontSize: { xs: "12px", sm: "14px" },
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add Task
                  </Button>
      </Box>
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {columnDefinitions.map(col => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={col.key}
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: 320,
            }}
          >
            <Box
              sx={{
                background: "#fff",
                borderRadius: "14px",
                boxShadow: "0 4px 24px rgba(30,41,59,0.07)",
                p: { xs: 1, sm: 2 },
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Column Header */}
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
                px: 1,
                py: 1,
                background: "#f1f5f9",
                borderRadius: "8px",
                border: `2px solid ${col.color}`,
                fontWeight: 700,
                fontSize: { xs: "16px", md: "18px" }
              }}>
                <span style={{ fontSize: 20 }}>{col.icon}</span>
                <span style={{ color: col.color }}>{col.title}</span>
              </Box>
              {/* Cards */}
              {kanbanData.filter(card => card.Status === col.key).map(card => (
                <Card
                  key={card.Id}
                  sx={{
                    mb: 2,
                    borderLeft: `4px solid ${col.color}`,
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    position: "relative",
                    px: { xs: 1, sm: 2 },
                    width: "100%",
                    mx: "auto",
                  }}
                >
                  <CardContent sx={{ pb: "16px !important", px: 0 }}>
                    {/* Delete Button */}
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 40,
                        color: "#e53935",
                        "&:hover": { background: "rgba(229,57,53,0.1)" }
                      }}
                      onClick={() => handleDeleteClick(card.Id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#64748b",
                        "&:hover": { background: "rgba(100,116,139,0.1)" }
                      }}
                      onClick={() => handleEditCard(card)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: 15, md: 16 }, color: "#1e293b", mb: 1 }}>
                      {card.Title}
                    </Typography>
                    <Typography sx={{ color: "#64748b", fontSize: { xs: 13, md: 14 }, mb: 1 }}>
                      {card.Description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {card.Tags && card.Tags.split(",").map(tag => (
                          <Box
                            key={tag}
                            sx={{
                              background: "#f1f5f9",
                              borderRadius: "4px",
                              px: 1,
                              fontSize: "12px",
                              color: "#475569",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            {tag.trim()}
                          </Box>
                        ))}
                      </Box>
                      <Box
                        title={card.Assignee}
                        sx={{
                          background: "#e2e8f0",
                          color: "#475569",
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                      >
                        {card.Avatar}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Add Task Dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "14px",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontSize: "22px",
            pb: 1,
            textAlign: "center",
          }}
        >
          Add New Task
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Task Name"
              fullWidth
              size="small"
              value={addValues.taskName}
              onChange={e => setAddValues(v => ({ ...v, taskName: e.target.value }))}
            />
            <TextField
              label="Task Description"
              fullWidth
              multiline
              rows={3}
              size="small"
              value={addValues.taskDescription}
              onChange={e => setAddValues(v => ({ ...v, taskDescription: e.target.value }))}
            />
            <TextField
              label="Task Owner"
              fullWidth
              size="small"
              value={addValues.taskOwner}
              onChange={e => setAddValues(v => ({ ...v, taskOwner: e.target.value }))}
            />
            <TextField
              label="Priority"
              select
              fullWidth
              size="small"
              value={addValues.taskPriority}
              onChange={e => setAddValues(v => ({ ...v, taskPriority: e.target.value }))}
            >
              {priorityOptions.map(opt => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Status"
              select
              fullWidth
              size="small"
              value={addValues.taskStatus}
              onChange={e => setAddValues(v => ({ ...v, taskStatus: e.target.value }))}
            >
              {columnDefinitions.map(col => (
                <MenuItem key={col.key} value={col.key}>
                  {col.title}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setAddOpen(false)}
            sx={{
              textTransform: "none",
              color: "#fff",
              background: colors.redAccent[500],
             
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddSave}
            sx={{
              background: colors.blueAccent[1000],
              color: "#fff",
              "&:hover": {
                background: colors.blueAccent[1000],
              },
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              fontWeight: 600,
            }}
          >
            {addLoading ? "Adding..." : "Add Task"}
          </Button>
          
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "14px",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontSize: "22px",
            pb: 1,
            textAlign: "center",
          }}
        >
          Edit Task
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Task Name"
              fullWidth
              size="small"
              value={addValues.taskName}
              onChange={e => setAddValues(v => ({ ...v, taskName: e.target.value }))}
            />
            <TextField
              label="Task Description"
              fullWidth
              multiline
              rows={3}
              size="small"
              value={addValues.taskDescription}
              onChange={e => setAddValues(v => ({ ...v, taskDescription: e.target.value }))}
            />
            <TextField
              label="Task Owner"
              fullWidth
              size="small"
              value={addValues.taskOwner}
              onChange={e => setAddValues(v => ({ ...v, taskOwner: e.target.value }))}
            />
            <TextField
              label="Priority"
              select
              fullWidth
              size="small"
              value={addValues.taskPriority}
              onChange={e => setAddValues(v => ({ ...v, taskPriority: e.target.value }))}
            >
              {priorityOptions.map(opt => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Status"
              select
              fullWidth
              size="small"
              value={addValues.taskStatus}
              onChange={e => setAddValues(v => ({ ...v, taskStatus: e.target.value }))}
            >
              {columnDefinitions.map(col => (
                <MenuItem key={col.key} value={col.key}>
                  {col.title}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setEditOpen(false)}
            sx={{
              textTransform: "none",
              color: "#fff",
              background: colors.redAccent[500],
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            sx={{
              background: colors.blueAccent[1000],
              color: "#fff",
              "&:hover": {
                background: colors.blueAccent[1000],
              },
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              fontWeight: 600,
            }}
          >
            {editLoading ? "Updating..." : "Update Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default KanbanBoard;