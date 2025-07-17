import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const TasksContext = createContext();

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ experienceId, crmId, children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    if (!experienceId || !crmId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getTaskDataByExpId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experienceId,
            crmid: crmId,
          }),
        }
      );
      const data = await response.json();
      setTasks(data?.data || []);
    } catch (error) {
      setTasks([]);
    }
    setLoading(false);
  }, [experienceId, crmId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add Task
  const addTask = async (formData) => {
      formData.append("experienceid", experienceId);
  formData.append("crmid", crmId);
    await fetch(`${process.env.REACT_APP_API_URL}/v1/createTask`, {
      method: "POST",
      body: formData,
    });
    await fetchTasks();
  };

  // Edit Task
  const editTask = async (id, payload) => {
    await fetch(`${process.env.REACT_APP_API_URL}/v1/updateTaskStatus/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchTasks();
  };

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/v1/TaskDelete/${id}`, {
      method: "DELETE",
    });
    await fetchTasks();
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, addTask, editTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};