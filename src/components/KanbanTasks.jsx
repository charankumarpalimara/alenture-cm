import { CloseOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  IconButton,
  Grid,
  useMediaQuery
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { message, Input, Select } from "antd";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useTasks } from "../utils/TasksContext";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DoneIcon from "@mui/icons-material/Done";
import { getCreaterRole } from "../config";

const columnDefinitions = [
  { key: "To Do", title: "To Do", color: "#ef4444", icon: <AssignmentIcon sx={{ color: "#fff" }} /> },
  { key: "In Progress", title: "In Progress", color: "#f97316", icon: <AutorenewIcon sx={{ color: "#fff" }} /> },
  { key: "Done", title: "Done", color: "#22c55e", icon: <DoneIcon sx={{ color: "#fff" }} /> },
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
  const [viewOpen, setViewOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [viewingCard, setViewingCard] = useState(null);
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

  const { tasks, addTask, editTask, deleteTask, experienceStatus } = useTasks();

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

  // Handler functions
  const handleViewClick = (card) => {
    setViewingCard(card);
    setViewOpen(true);
  };

  const handleDeleteClick = (taskId) => {
    setDeletingTaskId(taskId);
    setDeleteDialogOpen(true);
  };

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

  const handleAddSave = async () => {
    if (!addValues.taskName.trim()) {
      message.error("Task name is required");
      return;
    }

    if (!addValues.taskDescription.trim()) {
      message.error("Task description is required");
      return;
    }

    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.append("taskname", addValues.taskName.trim());
      formData.append("description", addValues.taskDescription.trim());
      formData.append("taskowner", addValues.taskOwner?.trim() || "");
      formData.append("priority", addValues.taskPriority);
      formData.append("status", addValues.taskStatus);

      await addTask(formData);

      setAddValues({
        taskName: "",
        taskDescription: "",
        taskOwner: "",
        taskPriority: "Medium",
        taskStatus: "To Do",
      });
      setAddOpen(false);
      message.success("Task added successfully");
    } catch (error) {
      console.error("Add task error:", error);
      message.error("Failed to add task");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!addValues.taskName.trim()) {
      message.error("Task name is required");
      return;
    }

    if (!addValues.taskDescription.trim()) {
      message.error("Task description is required");
      return;
    }

    setEditLoading(true);
    try {
      await editTask(editingCard.Id, {
        taskname: addValues.taskName.trim(),
        description: addValues.taskDescription.trim() || "null",
        taskowner: addValues.taskOwner?.trim() || "",
        priority: addValues.taskPriority,
        status: addValues.taskStatus,
      });

      setEditOpen(false);
      setEditingCard(null);
      message.success("Task updated successfully");
    } catch (error) {
      console.error("Edit task error:", error);
      message.error("Failed to update task");
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteTask(deletingTaskId);
      setDeleteDialogOpen(false);
      setDeletingTaskId(null);
      message.success("Task deleted successfully");
    } catch (error) {
      message.error("Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
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
      {/* Heading */}
      <Box sx={{
        width: "100%",
        alignItems: "left",
        py: 2,
      }}>
        {/* <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: colors.blueAccent[500],
            mb: 3,
            textAlign: "left",
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.5rem" }
          }}
        >
          Task Management Board
        </Typography> */}
      </Box>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          className="form-button"
          sx={{
            background: colors.blueAccent[1000],
            color: "#ffffff",
            whiteSpace: "nowrap",
            textTransform: "none",
            "&:hover": { backgroundColor: colors.blueAccent[600] },
            width: isMobile ? "45%" : "15%",
            display: getCreaterRole() === "crm" && experienceStatus !== "Resolved" ? "block" : "none",
          }}
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
                background: colors.blueAccent[1000],
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "12px",
              }}>
                <span style={{ fontSize: 10, marginTop: 3 }}>{col.icon}</span>
                <span style={{ color: "#fff" }}>{col.title}</span>
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
                    {/* View Button */}
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8 ,
                        right: experienceStatus !== "Resolved" ? 72 : 8,
                        color: "#2563eb",
                        "&:hover": { background: "rgba(37,99,235,0.1)" },
                      }}
                      onClick={() => handleViewClick(card)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    {/* Delete Button */}
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 40,
                        color: "#e53935",
                        "&:hover": { background: "rgba(229,57,53,0.1)" },
                        display: getCreaterRole() === "crm" && experienceStatus !== "Resolved" ? "block" : "none",
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
                        "&:hover": { background: "rgba(100,116,139,0.1)" },
                        display: getCreaterRole() === "crm" && experienceStatus !== "Resolved" ? "block" : "none",
                      }}
                      onClick={() => handleEditCard(card)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontWeight: "bold", fontSize:"11px", color: "#1e293b", mb: 1 }}>
                      {card.Title}
                    </Typography>
                    <Typography sx={{ color: "#64748b", fontSize:"11px", mb: 1 }}>
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
                              fontSize: "11px",
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
            zIndex: 1000,
          },
        }}
        sx={{
          zIndex: 1000,
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            fontSize: "18px",
            pb: 1,
            textAlign: "center",
          }}
        >
          Add New Task
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Input
              placeholder="Task Name"
              value={addValues.taskName}
              onChange={e => setAddValues(v => ({ ...v, taskName: e.target.value }))}
              style={{ marginBottom: 16 }}
            />
            <Input.TextArea
              placeholder="Task Description"
              value={addValues.taskDescription}
              onChange={e => setAddValues(v => ({ ...v, taskDescription: e.target.value }))}
              rows={3}
              style={{ marginBottom: 16 }}
            />
            <Input
              placeholder="Task Owner"
              value={addValues.taskOwner}
              onChange={e => setAddValues(v => ({ ...v, taskOwner: e.target.value }))}
              style={{ marginBottom: 16 }}
            />
            <Select
              placeholder="Priority"
              value={addValues.taskPriority}
              onChange={val => setAddValues(v => ({ ...v, taskPriority: val }))}
              style={{ width: "100%", marginBottom: 16 }}
              options={priorityOptions.map(p => ({ label: p, value: p }))}
              dropdownStyle={{ zIndex: 9999 }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
            <Select
              placeholder="Status"
              value={addValues.taskStatus}
              onChange={val => setAddValues(v => ({ ...v, taskStatus: val }))}
              style={{ width: "100%", marginBottom: 16 }}
              options={columnDefinitions.map(col => ({ label: col.title, value: col.key }))}
              dropdownStyle={{ zIndex: 9999 }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            key="cancel"
            onClick={() => setAddOpen(false)}
            variant="outlined"
            className="form-button"
            color="error"
            icon={<CloseOutlined />}
            style={{
              textTransform: "none",
              // border: `1.5px solid ${colors.redAccent[500]}`,
              borderRadius: 8,
              // color: colors.redAccent[500],
              // background: "transparent"
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddSave}
            className="form-button"
            sx={{
              background: colors.blueAccent[1000],
              color: "#fff",
              "&:hover": {
                background: colors.blueAccent[1000],
              },
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
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
        {/* <DialogTitle>Confirm Delete</DialogTitle> */}
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            color="error"
            className="form-button"
            // ghost
            icon={<CloseOutlined />}
            style={{
              textTransform: "none",
              // borderColor: colors.redAccent[500],
              borderRadius: 8,
              // color: colors.redAccent[500],
              // background: "#fff"
            }}
          >
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete} className="form-button">
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Task Dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
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
          View Task
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Input
                placeholder="Title"
                value={viewingCard?.Title || ""}
                readOnly
                style={{ marginBottom: 16, width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Input.TextArea
                placeholder="Description"
                value={viewingCard?.Description || ""}
                readOnly
                rows={3}
                style={{ marginBottom: 16, width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                placeholder="Status"
                value={viewingCard?.Status || ""}
                readOnly
                style={{ marginBottom: 16, width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                placeholder="Priority"
                value={viewingCard?.Priority || ""}
                readOnly
                style={{ marginBottom: 16, width: "100%" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setViewOpen(false)}
            variant="outlined"
            color="error"
            className="form-button"
            // sx={{
            //   background: colors.blueAccent[1000],
            //   color: "#fff",
            //   padding: "10px 20px",
            //   "&:hover": {
            //     backgroundColor: colors.blueAccent[600],
            //   },
            // }}
          >
            Close
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
            zIndex: 1000,
          },
        }}
        sx={{
          zIndex: 1000,
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontSize: "18px",
            pb: 1,
            textAlign: "center",
          }}
        >
          Edit Task
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Input
              placeholder="Task Name"
              value={addValues.taskName}
              onChange={e => setAddValues(v => ({ ...v, taskName: e.target.value }))}
              style={{ marginBottom: 16 }}
            />
            <Input.TextArea
              placeholder="Task Description"
              value={addValues.taskDescription}
              onChange={e => setAddValues(v => ({ ...v, taskDescription: e.target.value }))}
              rows={3}
              style={{ marginBottom: 16 }}
            />
            <Input
              placeholder="Task Owner"
              value={addValues.taskOwner}
              onChange={e => setAddValues(v => ({ ...v, taskOwner: e.target.value }))}
              style={{ marginBottom: 16 }}
            />
            <Select
              placeholder="Priority"
              value={addValues.taskPriority}
              onChange={val => setAddValues(v => ({ ...v, taskPriority: val }))}
              style={{ width: "100%", marginBottom: 16 }}
              options={priorityOptions.map(p => ({ label: p, value: p }))}
              dropdownStyle={{ zIndex: 9999 }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
            <Select
              placeholder="Status"
              value={addValues.taskStatus}
              onChange={val => setAddValues(v => ({ ...v, taskStatus: val }))}
              style={{ width: "100%", marginBottom: 16 }}
              options={columnDefinitions.map(col => ({ label: col.title, value: col.key }))}
              dropdownStyle={{ zIndex: 9999 }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            color="error"
            className="form-button"
            icon={<CloseOutlined />}
            style={{
              textTransform: "none",
              // border: `1.5px solid ${colors.redAccent[500]}`,
              borderRadius: 8,
              // color: colors.redAccent[500],
              background: "transparent"
            }}
          >
            Cancel
          </Button>
          {/* <Button
          onClick={() => setEditOpen(false)}
          type="default"
          className="form-button"
          danger
          ghost
          icon={<CloseOutlined />}
          style={{
            textTransform: "none",
            borderColor: colors.redAccent[500],
            borderRadius: 8,
            color: colors.redAccent[500],
            background: "#fff"
          }}
        >
          Cancel
        </Button> */}
          <Button
            variant="contained"
            onClick={handleEditSave}
            className="form-button"
            sx={{
              background: colors.blueAccent[1000],
              color: "#fff",
              "&:hover": {
                background: colors.blueAccent[1000],
              },
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
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