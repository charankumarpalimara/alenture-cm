import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from "@mui/material";
import { message } from "antd";

const priorityOptions = ["High", "Medium", "Low"];
const columnColors = {
  todo: "#ef4444",
  inprogress: "#fb923c",
  done: "#22c55e",
};
const COLUMN_ID_TO_STATUS = {
  todo: "New",
  inprogress: "In Progress",
  done: "Completed",
};
const STATUS_TO_COLUMN_ID = (status) => {
  if (!status) return "todo";
  const s = status.toLowerCase().replace(/\s|_/g, "");
  if (s === "new") return "todo";
  if (["inprogress", "progress", "started", "working"].includes(s)) return "inprogress";
  if (["completed", "complete", "done", "closed", "finished"].includes(s)) return "done";
  return "todo";
};

function KanbanBoard({ experienceid, crmid, experienceStatus }) {
  const [columns, setColumns] = useState({
    todo: { id: "todo", title: "To Do", color: columnColors.todo, taskIds: [] },
    inprogress: { id: "inprogress", title: "In Progress", color: columnColors.inprogress, taskIds: [] },
    done: { id: "done", title: "Completed", color: columnColors.done, taskIds: [] },
  });
  const [tasks, setTasks] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [addValues, setAddValues] = useState({
    taskName: "",
    taskDescription: "",
    taskOwner: "",
    taskPriority: "Medium",
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getTaskDataByExpId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experienceId: experienceid,
            crmid: crmid,
          }),
        }
      );
      const result = await response.json();
      if (result && result.data) {
        const tasksObj = {};
        const taskIdsByStatus = { todo: [], inprogress: [], done: [] };
        result.data.forEach((task) => {
          const taskId = String(task.id);
          tasksObj[taskId] = {
            id: taskId,
            content: task.taskname || task.content,
            description: task.description || task.discription || "",
            owner: task.taskownername || task.taskowner || task.owner || "",
            priority: task.priority || "Medium",
          };
          const col = STATUS_TO_COLUMN_ID(task.status);
          taskIdsByStatus[col].push(taskId);
        });
        setTasks(tasksObj);
        setColumns({
          todo: { ...columns.todo, taskIds: taskIdsByStatus.todo },
          inprogress: { ...columns.inprogress, taskIds: taskIdsByStatus.inprogress },
          done: { ...columns.done, taskIds: taskIdsByStatus.done },
        });
      } else {
        setTasks({});
        setColumns({
          todo: { ...columns.todo, taskIds: [] },
          inprogress: { ...columns.inprogress, taskIds: [] },
          done: { ...columns.done, taskIds: [] },
        });
      }
    } catch (error) {
      setTasks({});
    }
  };

  useEffect(() => {
    if (experienceid && crmid) fetchTasks();
    // eslint-disable-next-line
  }, [experienceid, crmid]);

  // Drag logic
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    // Remove from old column
    const newStartTaskIds = Array.from(start.taskIds);
    newStartTaskIds.splice(source.index, 1);

    // Add to new column
    const newFinishTaskIds = Array.from(finish.taskIds);
    newFinishTaskIds.splice(destination.index, 0, draggableId);

    const newColumns = {
      ...columns,
      [start.id]: { ...start, taskIds: newStartTaskIds },
      [finish.id]: { ...finish, taskIds: newFinishTaskIds },
    };
    setColumns(newColumns);

    // Backend update
    let newStatus = COLUMN_ID_TO_STATUS[finish.id];
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/v1/updateTaskStatus/${draggableId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      setTimeout(() => {
        fetchTasks();
      }, 500);
    } catch (err) {
      message.error("Failed to update task status!");
    }
  };

  // Add Task Dialog handlers
  const handleAddOpen = () => {
    setAddValues({
      taskName: "",
      taskDescription: "",
      taskOwner: "",
      taskPriority: "Medium",
    });
    setAddOpen(true);
  };
  const handleAddSave = async () => {
    if (!addValues.taskName || !addValues.taskOwner) {
      message.error("Task Name and Owner required");
      return;
    }
    const formData = new FormData();
    formData.append("experienceid", experienceid || "");
    formData.append("taskname", addValues.taskName);
    formData.append("taskowner", addValues.taskOwner);
    formData.append("priority", addValues.taskPriority);
    formData.append("discription", addValues.taskDescription);
    formData.append("crmid", crmid || "");
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/v1/createTask`, {
        method: "POST",
        body: formData,
      });
      message.success("Task created successfully!");
      setAddOpen(false);
      fetchTasks();
    } catch (err) {
      message.error("Failed to create task!");
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto", pb: 2 }}>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        flexWrap: "wrap",
        gap: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          📝 Kanban Task Board
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddOpen}
          style={{ display: experienceStatus === "Resolved" ? "none" : "block" }}
        >
          Add Task
        </Button>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{
          display: "flex",
          gap: 3,
          minHeight: 430,
          pb: 2,
          overflowX: { xs: "auto", md: "visible" }
        }}>
          {["todo", "inprogress", "done"].map((colId) => {
            const column = columns[colId];
            return (
              <Droppable key={colId} droppableId={colId}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      flex: "0 0 330px",
                      display: "flex",
                      flexDirection: "column",
                      background: "#f9fafb",
                      border: `2px solid ${column.color}`,
                      borderRadius: 2,
                      padding: 2,
                      minHeight: 430,
                      maxHeight: 600,
                      overflowY: "auto",
                      boxShadow: 1,
                      transition: "background 0.2s",
                      backgroundColor: snapshot.isDraggingOver ? "#f1f5f9" : "#f9fafb"
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 700,
                        color: column.color,
                        textAlign: "center",
                      }}
                    >
                      {column.title}
                    </Typography>
                    {column.taskIds.length === 0 && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#aaa", textAlign: "center", mt: 2 }}
                      >
                        No tasks
                      </Typography>
                    )}
                    {column.taskIds.map((tid, index) => (
                      <Draggable key={tid} draggableId={tid} index={index}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              width: "100%",
                              mb: 2,
                              p: 2,
                              bgcolor: "#fff",
                              borderRadius: 2,
                              boxShadow: 3,
                              fontWeight: 500,
                              opacity: snapshot.isDragging ? 0.5 : 1,
                              cursor: "grab",
                              transition: "box-shadow 0.2s",
                              display: "flex",
                              flexDirection: "column",
                              userSelect: "none",
                              minHeight: 64,
                            }}
                          >
                            <Typography fontWeight="bold" sx={{ mb: 0.5, fontSize: "1rem" }}>
                              {tasks[tid]?.content}
                            </Typography>
                            {tasks[tid]?.description && (
                              <Typography variant="body2" sx={{ mb: 1, color: "#888" }}>
                                {tasks[tid]?.description}
                              </Typography>
                            )}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                👤 {tasks[tid]?.owner}
                              </Typography>
                              <Typography
                                variant="caption"
                                color={
                                  tasks[tid]?.priority === "High"
                                    ? "#ef4444"
                                    : tasks[tid]?.priority === "Medium"
                                    ? "#f59e42"
                                    : "#22c55e"
                                }
                              >
                                🚦 {tasks[tid]?.priority}
                              </Typography>
                            </Box>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            );
          })}
        </Box>
      </DragDropContext>
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Name"
            fullWidth
            margin="dense"
            value={addValues.taskName}
            onChange={e => setAddValues(v => ({ ...v, taskName: e.target.value }))}
          />
          <TextField
            label="Task Description"
            fullWidth
            margin="dense"
            value={addValues.taskDescription}
            onChange={e => setAddValues(v => ({ ...v, taskDescription: e.target.value }))}
          />
          <TextField
            label="Task Owner"
            fullWidth
            margin="dense"
            value={addValues.taskOwner}
            onChange={e => setAddValues(v => ({ ...v, taskOwner: e.target.value }))}
          />
          <TextField
            label="Priority"
            select
            fullWidth
            margin="dense"
            value={addValues.taskPriority}
            onChange={e => setAddValues(v => ({ ...v, taskPriority: e.target.value }))}
          >
            {priorityOptions.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSave}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default KanbanBoard;