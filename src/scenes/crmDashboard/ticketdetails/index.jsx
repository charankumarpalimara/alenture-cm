import {
  Box,
  useMediaQuery,
  Typography,
  Button,
  useTheme,
  TextField,
  Autocomplete,
  // IconButton,
  // Modal,
  // Dialog, DialogContent, DialogActions
} from "@mui/material";
import {
  Form,
  // Input,
  // Select,
  // // Button as AntdButton,
  // Col,
  // Row,
  message,
  // Modal as AntdModal,
  // Table,
} from "antd";
import { Formik } from "formik";
import { tokens } from "../../../theme";
import * as yup from "yup";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import {
  // FormatBold,
  // FormatItalic,
  // FormatUnderlined,
  // FormatListNumbered,
  // FormatListBulleted,
  // InsertPhoto,
  // TableChart,
  // YouTube,
  // Check as CheckIcon,
  // Delete as DeleteIcon,
  // Add as AddIcon,
  DownloadOutlined
} from "@mui/icons-material";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TableTiptap from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Youtube from "@tiptap/extension-youtube";
import { Underline } from "@tiptap/extension-underline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
// import { getCreaterId } from "../../../config";
import ActivityTimeline from "./ActivityTimeline";
// import dayjs from "dayjs"; // Use dayjs for formatting UTC
import { TasksProvider } from "../../../utils/TasksContext";
import KanbanBoard from "../../../components/KanbanTasks";
import AssignCrmModal from "./AssignCrmModal";
import ResolveDialog from "./ResolveDialog";
import ChatSection from "./ChatSection";


// const { Option } = Select;

const CrmTicketDetails = () => {
  const { experienceid } = useParams();
  const [experienceData, setExperienceData] = useState(null);
  const [form] = Form.useForm();
  const socketRef = useRef(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:484px)");
  const colors = tokens(theme.palette.mode);
  // const location = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [crmIdList, setCrmIdList] = useState([]);
  const [crmNameList, setCrmNameList] = useState([]);
  // const [tasks, setTasks] = useState([]);
  // const Navigate = useNavigate();
  // const [openTaskModal, setOpenTaskModal] = useState(false);
  const [shareEntireExperience, setshareEntireExperience] = useState(false);
  // const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);
  // const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // const [deletingTaskId, setDeletingTaskId] = useState(null);
  // const [completeModalVisible, setCompleteModalVisible] = useState(false);
  // const [completeTaskId, setCompleteTaskId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);





  // Move fetchExperienceData to top-level so it can be called after resolve
  const fetchExperienceData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/experienceDetailsGet/${experienceid}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setExperienceData(data.data[0]);
        console.log(data.data[0]);
      } else {
        setExperienceData({});
      }
    } catch (error) {
      console.error("Error fetching experience data:", error);
      setExperienceData({});
      message.error("Failed to load experience data. Please try again later.");
    }
  };

  useEffect(() => {
    if (experienceid) fetchExperienceData();
  }, [experienceid]);




  // Memoize derived values
  const safeExperienceData = useMemo(() => experienceData || {}, [experienceData]);
  const ExperienceId = useMemo(() => safeExperienceData.experienceid, [safeExperienceData]);
  const crmId = useMemo(() => safeExperienceData.extraind1, [safeExperienceData]);
  const crmName = useMemo(() => safeExperienceData.extraind2, [safeExperienceData]);

  // Fix: Prevent null access in buildInitialValues
  const buildInitialValues = (data = {}) => {
    if (!data) data = {};
    return {
      organizationid: data.organizationid || "",
      organization: data.organizationname || "",
      crmid: data.extraind1 || "",
      cmname: data.cmname || "",
      crmname: data.extraind2 || "",
      experience: data.experience || "",
      branch: data.branch || "",
      priority: data.priority || "",
      status: data.status || "",
      department: data.department || "",
      date: data.date || "",
      time: data.time || "",
      subject: data.subject || "",
      requestdetails: data.experiencedetails || "",
      phoneCode: data.phonecode || "",
      PhoneNo: data.Phoneno || "",
      notes: data.notes || "",
      impact: data.impact || "",
      processtime: data.extraind3 || "N/A",
      processdate: data.extraind4 || "N/A",
      resolvedtime: data.extraind5 || "N/A",
      resolveddate: data.extraind6 || "N/A",
      id: data.experienceid || "",
      imageUrl: data.imageUrl || "",
    };
  };

  const getExperienceColor = (experience) => {
    switch (experience) {
      case "Frustrated":
        return "#E64A19";
      case "Extremely Frustrated":
        return "#D32F2F";
      case "Happy":
        return "#FBC02D";
      case "Extremely Happy":
        return "#388E3C";
      default:
        return "#616161";
    }
  };

  const handleFormSubmit = (values) => {
    const fullPhoneNumber = `${values.phoneCode}${values.PhoneNo}`;
    // Do something with form data if needed
    console.log("Form Data:", { ...values, fullPhoneNumber });
  };

  // const columns = [
  //   {
  //     title: "ID",
  //     dataIndex: "id",
  //     key: "id",
  //     width: 100,
  //     render: (_text, _record, index) => <span>{index + 1}</span>,
  //   },
  //   {
  //     title: "Task name",
  //     dataIndex: "taskname",
  //     key: "taskname",
  //     width: 200,
  //   },
  //   {
  //     title: "Task owner",
  //     dataIndex: "taskownername",
  //     key: "taskownername",
  //     width: 150,
  //   },
  //   {
  //     title: "Priority",
  //     dataIndex: "priority",
  //     key: "priority",
  //     width: 150,
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     key: "status",
  //     width: 150,
  //   },
  //   {
  //     title: "Action",
  //     key: "actions",
  //     width: 150,
  //     render: (_text, record) => (
  //       <Box sx={{ display: "flex", gap: 1 }}>
  //         <IconButton
  //           onClick={handleCompleteTask(record.id)}
  //           sx={{
  //             color: "#ffffff",
  //             backgroundColor: "#0BDA51",
  //             width: "30px",
  //             height: "30px",
  //           }}
  //           aria-label="complete"
  //           disableRipple
  //         >
  //           <CheckIcon />
  //         </IconButton>
  //         <IconButton
  //           onClick={handleDeleteTask(record.id)}
  //           sx={{
  //             color: "#ffffff",
  //             backgroundColor: "#FF2C2C",
  //             width: "30px",
  //             height: "30px",
  //           }}
  //           disableRipple
  //           aria-label="delete"
  //         >
  //           <DeleteIcon />
  //         </IconButton>
  //       </Box>
  //     ),
  //   },
  // ];



  // CRM ID List
  useEffect(() => {
    const fetchCrmIds = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getCrmId`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.crmid)) {
            setCrmIdList(data.crmid.map((item) => item.crmid));
          }
        }
      } catch (error) { }
    };
    fetchCrmIds();
  }, []);

  // CRM Name based on selected CRM ID
  const crmidValue = form.getFieldValue("crmid");

  useEffect(() => {
    if (crmidValue) {
      fetch(`${process.env.REACT_APP_API_URL}/v1/getCrmNamebyId/${crmidValue}`)
        .then((res) => res.json())
        .then((data) => {
          form.setFieldsValue({ crmname: data.crmNames || "" });
        });
    } else {
      form.setFieldsValue({ crmname: "" });
    }
  }, [form, crmidValue]);

  // Fetch tasks



  // const fetchTasks = useCallback(async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL}/v1/getTaskDataByExpId`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           experienceId: ExperienceId,
  //           crmid: crmId,
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (data && data.data) {
  //       setTasks(data.data);
  //     }
  //   } catch (error) {
  //     setTasks([]);
  //   }
  // }, [ExperienceId, crmId]);



  // useEffect(() => {
  //   if (!ExperienceId || !crmId) return;
  //   fetchTasks();
  // }, [ExperienceId, crmId, fetchTasks]);

  // const handleDeleteTask = (id) => (event) => {
  //   fetchTasks();
  //   event.stopPropagation();
  //   setDeletingTaskId(id);
  //   setDeleteModalVisible(true);
  // };

  // const handleCompleteTask = (id) => async (event) => {
  //   event.stopPropagation();
  //   setCompleteTaskId(id);
  //   setCompleteModalVisible(true);
  // };

  // const handleCancelDelete = () => {
  //   setDeleteModalVisible(false);
  //   setCompleteModalVisible(false)
  //   setDeletingTaskId(null);
  // };

  const checkoutSchema = yup.object().shape({
    organization: yup.string().required("Required"),
    cmname: yup.string().required("Required"),
    crmname: yup.string().required("Required"),
    status: yup.string().required("Required"),
    branch: yup.string().required("Required"),
    department: yup.string().required("Required"),
    date: yup.string().required("Required"),
    time: yup.string().required("Required"),
    subject: yup.string().required("Required"),
    phoneCode: yup.string().required("Required"),
    PhoneNo: yup
      .string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Must be at least 10 digits")
      .required("Required"),
    notes: yup.string(),
  });

  const fileUrl = safeExperienceData.imageUrl || "";
  const filename = fileUrl.split("/").pop() || "attachment";
  // const filenamevalue = safeExperienceData.filename;

  const handleDownload = async () => {
    if (!fileUrl) {
      message.error("No attachment available.");
      return;
    }
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("File not found or server error");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      message.error("Download failed. Please try again or contact support.");
    } finally {
      setIsDownloading(false);
    }
  };

  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "support" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TableTiptap.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube,
    ],
    content: newMessage,
    onUpdate: ({ editor }) => {
      setNewMessage(editor.getHTML());
    },
  });

  // Memoize handlers
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;
    const cmid = experienceData.cmid || "";
    const msgData = {
      experienceid: ExperienceId,
      crmid: crmId,
      cmid,
      crmname: crmName,
      message: newMessage,
      sender: "manager",
    };
    socketRef.current.emit("sendMessage", msgData);
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/v1/chatInsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
    } catch (error) {
      message.error("Failed to send message.");
    }
    setNewMessage("");
    editor.commands.clearContent();
  }, [newMessage, experienceData, ExperienceId, crmId, crmName, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    const url = window.prompt("Enter YouTube URL:");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  }, [editor]);

  const addTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  }, [editor]);

  // Socket.IO for chat messages
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL);
    if (ExperienceId && crmId) {
      socketRef.current.emit("joinRoom", {
        experienceid: ExperienceId,
        crmid: crmId,
      });
    }
    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          text: msg.message || msg.messege,
          sender: msg.sender,
          time: msg.time,
          crmname: msg.crmname,
        },
      ]);
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [ExperienceId, crmId]);

  // const handleSendMessage = async () => {
  //   if (!newMessage.trim()) return;
  //   const cmid = experienceData.cmid || "";
  //   const msgData = {
  //     experienceid: ExperienceId,
  //     crmid: crmId,
  //     cmid,
  //     crmname: crmName,
  //     message: newMessage,
  //     sender: "manager",
  //   };

  //   // Emit real-time message
  //   socketRef.current.emit("sendMessage", msgData);

  //   // Save message to DB via REST API
  //   try {
  //     await fetch(`${process.env.REACT_APP_API_URL}/v1/chatInsert`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(msgData),
  //     });
  //   } catch (error) {
  //     message.error("Failed to send message.");
  //   }

  //   setNewMessage("");
  //   editor.commands.clearContent();
  // };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!ExperienceId || !crmId) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getChatMessages?experienceid=${ExperienceId}&crmid=${crmId}`
        );
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((msg) => ({
              text: msg.messege,
              sender: msg.sender,
              time: msg.time,
              crmname: msg.extraind1,
            }))
          );
        }
      } catch (error) {
        setMessages([
          { text: "Failed to load messages.", sender: "support", time: "" },
        ]);
      }
    };
    fetchMessages();
  }, [ExperienceId, crmId]);

  // Status update to "Processing" on mount
  useEffect(() => {
    const sendProcessingStatus = async () => {
      const now = new Date();
      const utcDate = now.toISOString().slice(0, 10);
      const utcTime = now.toISOString().slice(11, 19);
      const msgData = {
        experienceid: ExperienceId,
        status: "Processing",
        date: utcDate,
        time: utcTime
      };

      try {
        await fetch(
          `${process.env.REACT_APP_API_URL}/v1/updateExperienceStatus`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(msgData),
          }
        );
      } catch (error) {
        message.error("Failed to send message.");
      }
    };

    if (ExperienceId) {
      sendProcessingStatus();
    }
  }, [ExperienceId]);

  // Close Experience Handler
  const handleCloseExperience = async () => {
    try {
      const now = new Date();
      const utcDate = now.toISOString().slice(0, 10);
      const utcTime = now.toISOString().slice(11, 19);
      await fetch(
        `${process.env.REACT_APP_API_URL}/v1/updateExperienceStatusToResolve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experienceid: ExperienceId,
            status: "Resolved",
            date: utcDate,
            time: utcTime
          }),
        }
      );
      message.success("Experience status updated to Resolved!");
      fetchExperienceData(); // Refresh data only
    } catch (error) {
      message.error("Failed to update status.");
    }
  };

  // CRM Names list for Assign To
  useEffect(() => {
    const fetchCrmNames = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCrmNames`);
      const data = await res.json();
      setCrmNameList(data.data || []);
    };
    fetchCrmNames();
  }, []);

  // Modal styles
  // const createtaskmodel = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: isDesktop ? "60%" : "90%",
  //   bgcolor: "background.paper",
  //   boxShadow: 24,
  //   p: 4,
  //   borderRadius: "8px",
  //   maxHeight: "90vh",
  //   overflowY: "auto",
  // };

  // const assignmodel = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: isDesktop ? "40%" : "90%",
  //   bgcolor: "background.paper",
  //   boxShadow: 24,
  //   p: 4,
  //   borderRadius: "8px",
  //   maxHeight: "90vh",
  //   overflowY: "auto",
  // };

  // const handleRowClick = (params) => {
  //   Navigate("/taskdetails", { state: { ticket: params.row } });
  // };

  // Confirm Delete Task
  // const handleConfirmDelete = async () => {
  //   if (!deletingTaskId) return;
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL}/v1/TaskDelete/${deletingTaskId}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //     if (response.ok) {
  //       setTasks((prev) => prev.filter((task) => task.id !== deletingTaskId));
  //       message.success("Task deleted successfully!");
  //     } else {
  //       const data = await response.json();
  //       message.error(data.error || "Failed to delete task.");
  //     }
  //   } catch (error) {
  //     message.error("Error deleting task.");
  //   }
  //   setDeleteModalVisible(false);
  //   setDeletingTaskId(null);
  // };

  // Confirm Complete Task
  // const handleConfirmComplete = async () => {
  //   if (!completeTaskId) return;
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL}/v1/updateTaskStatus/${completeTaskId}`,
  //       {
  //         method: "POST",
  //       }
  //     );
  //     if (response.ok) {
  //       message.success("Task Updated successfully!");
  //       fetchTasks();
  //     } else {
  //       const data = await response.json();
  //       message.error(data.error || "Failed to Update task Status.");
  //     }
  //   } catch (error) {
  //     message.error("Error deleting task.");
  //   }
  //   setCompleteModalVisible(false);
  //   setCompleteTaskId(null);
  // };

  // Task Form Modal
  // const TaskForm = ({ handleClose, fetchTasks }) => {
  //   const [taskForm] = Form.useForm();
  //   const [loading, setLoading] = useState(false);
  //   const priorityOptions = ["Urgent", "High", "Low"];

  //   const handleFormSubmit = async (values) => {
  //     const formData = new FormData();
  //     formData.append("experienceid", ExperienceId || "");
  //     formData.append("taskname", values.taskname || "");
  //     formData.append("taskowner", values.taskowner || "");
  //     formData.append("priority", values.priority || "");
  //     formData.append("discription", values.description || "");

  //     const crmid = getCreaterId() || "";
  //     formData.append("crmid", crmid);

  //     setLoading(true);
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}/v1/createTask`,
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );
  //       if (response.ok) {
  //         message.success("Task created successfully!");
  //         taskForm.resetFields();
  //         handleClose();
  //         if (fetchTasks) fetchTasks();
  //       } else {
  //         message.error("Failed to create task.");
  //       }
  //     } catch (error) {
  //       message.error("Error creating task.");
  //     }
  //     setLoading(false); 
  //   };

  //   return (
  //     <Form
  //       form={taskForm}
  //       layout="vertical"
  //       onFinish={handleFormSubmit}
  //       initialValues={{
  //         taskname: "",
  //         taskowner: "",
  //         description: "",
  //         priority: "",
  //       }}
  //     >
  //       <Form.Item
  //         label="Task Name"
  //         name="taskname"
  //         rules={[{ required: true, message: "Task Name is required" }]}
  //       >
  //         <Input placeholder="Enter task name" size="large" />
  //       </Form.Item>

  //       <Form.Item
  //         label="Task Owner"
  //         name="taskowner"
  //         rules={[{ required: true, message: "Task Owner is required" }]}
  //       >
  //         <Input placeholder="Enter task owner" size="large" />
  //       </Form.Item>

  //       <Form.Item
  //         label="Priority"
  //         name="priority"
  //         rules={[{ required: true, message: "Priority is required" }]}
  //       >
  //         <Select
  //           placeholder="Select priority"
  //           size="large"
  //           getPopupContainer={(trigger) => trigger.parentNode}
  //         >
  //           {priorityOptions.map((option) => (
  //             <Option key={option} value={option}>
  //               {option}
  //             </Option>
  //           ))}
  //         </Select>
  //       </Form.Item>

  //       <Form.Item
  //         label="Description"
  //         name="description"
  //         rules={[{ required: true, message: "Description is required" }]}
  //       >
  //         <Input.TextArea
  //           rows={4}
  //           placeholder="Enter description"
  //           size="large"
  //         />
  //       </Form.Item>

  //       <Form.Item>
  //         <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
  //           <AntdButton
  //             onClick={handleClose}
  //             style={{
  //               background: "#e57373",
  //               color: "#fff",
  //               borderRadius: 8,
  //               fontWeight: "bold",
  //             }}
  //           >
  //             Cancel
  //           </AntdButton>
  //           <AntdButton
  //             type="primary"
  //             onClick={() => taskForm.submit()}
  //             disabled={loading}
  //             style={{
  //               background: colors.blueAccent[1000],
  //               borderRadius: 8,
  //               fontWeight: "600",
  //             }}
  //           >
  //             {loading ? "Creating..." : "Create Task"}
  //           </AntdButton>
  //         </div>
  //       </Form.Item>
  //     </Form>
  //   );
  // };

  // Assign CRM Modal
  // const AssignCrm = ({ handleClose, crmNameList = [] }) => {
  //   const [assignForm] = Form.useForm();
  //   const [loading, setLoading] = useState(false);

  //   const handleFinish = async (values) => {
  //     setLoading(true);
  //     try {
  //       const experienceid = ExperienceId;
  //       const existcrmid = crmId;
  //       const crmid = values.crmid;
  //       const crmname = values.crmname;

  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}/v1/AssignTask`,
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ experienceid, crmid, existcrmid, crmname }),
  //         }
  //       );

  //       if (response.ok) {
  //         message.success("Task assigned successfully!");
  //         handleClose();
  //       } else {
  //         const data = await response.json();
  //         message.error(data.error || "Failed to assign task.");
  //       }
  //     } catch (error) {
  //       message.error("Error assigning task.");
  //     }
  //     setLoading(false);
  //   };

  //   return (
  //     <Form
  //       form={assignForm}
  //       layout="vertical"
  //       onFinish={handleFinish}
  //       initialValues={{ crmid: "", crmname: "" }}
  //     >
  //       <Col xs={24} md={24} style={{ width: "100%" }}>
  //         <Form.Item
  //           label="CRM Name"
  //           name="crmname"
  //           rules={[{ required: true, message: "CRM Name is required" }]}
  //           style={{ width: "100%" }}
  //         >
  //           <Select
  //             showSearch
  //             placeholder="Select CRM Name"
  //             optionFilterProp="children"
  //             size="large"
  //             style={{ width: "100%" }}
  //             getPopupContainer={trigger => trigger.parentNode}
  //             onChange={(value) => {
  //               const selected = crmNameList.find(crm => crm.crmid === value);
  //               assignForm.setFieldsValue({
  //                 crmname: selected ? selected.name : "",
  //                 crmid: value
  //               });
  //             }}
  //           >
  //             {crmNameList.map((crm) => (
  //               <Select.Option key={crm.crmid} value={crm.crmid}>
  //                 {crm.name} ({crm.crmid})
  //               </Select.Option>
  //             ))}
  //           </Select>
  //         </Form.Item>
  //         <Form.Item label="CRM ID" name="crmid" style={{ display: "none" }}>
  //           <Input disabled />
  //         </Form.Item>
  //       </Col>
  //       <Row justify="end" gutter={8}>
  //         <Col>
  //           <Button
  //             onClick={handleClose}
  //             style={{ background: "#e57373", color: "#fff", borderRadius: 8 }}
  //           >
  //             Cancel
  //           </Button>
  //         </Col>
  //         <Col>
  //           <Button
  //             type="primary"
  //             onClick={() => assignForm.submit()}
  //             disabled={loading}
  //             style={{
  //               background: colors.blueAccent[1000],
  //               borderRadius: 8,
  //               fontWeight: "600",
  //               color: "#fff",
  //               ...(loading && { opacity: 0.7 }),
  //             }}
  //           >
  //             {loading ? "Assigning..." : "Assign"}
  //           </Button>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // };

  const priority = ["Urgent", "High", "Medium", "Low"];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr",
          md: "60% 40%",
        },
        gap: { xs: 2, sm: 3 },
        p: { xs: 1, sm: 2 },
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* First Column - Ticket Details */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: isDesktop ? 3 : 2,
          borderRadius: "8px",
          gridColumn: {
            xs: "1 / -1",
            md: "1 / 2",
          },
        }}
      >
        <Formik
          enableReinitialize
          initialValues={buildInitialValues(experienceData)}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            setFieldValue,
            touched,
            errors,
            handleBlur,
            handleChange,
          }) => (
            <form>
              <Box
                display="grid"
                gap={2}
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
              >
                {/* Ticket Details Fields */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Experience ID
                  </Typography>
                  <Typography>{values.id}</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Organization
                  </Typography>
                  <Typography>{values.organization}</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Unit
                  </Typography>
                  <Typography>{values.branch}</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Customer Manager
                  </Typography>
                  <Typography>{values.cmname}</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Relationship Manager
                  </Typography>
                  <Typography>{values.crmname}</Typography>
                </Box>
                {isEditing ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#000",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      Priority
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={priority}
                      value={values.priority || null}
                      onChange={async (event, newValue) => {
                        setFieldValue("priority", newValue || "");
                        try {
                          await fetch(
                            `${process.env.REACT_APP_API_URL}/v1/updateExperiencePriority`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                experienceid: ExperienceId,
                                priority: newValue,
                              }),
                            }
                          );
                          message.success("Priority updated!");
                        } catch (error) {
                          message.error("Failed to update priority.");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            display: isEditing ? "block" : "none",
                            "& .MuiInputBase-root": {
                              height: "40px",
                            },
                          }}
                          error={!!touched.priority && !!errors.priority}
                          helperText={touched.priority && errors.priority}
                          disabled={!isEditing}
                        />
                      )}
                      disabled={!isEditing}
                      sx={{
                        gridColumn: "span 1",
                        "& .MuiAutocomplete-listbox": {
                          maxHeight: "200px",
                          padding: 0,
                          "& .MuiAutocomplete-option": {
                            minHeight: "32px",
                            padding: "4px 16px",
                          },
                        },
                      }}
                      freeSolo
                      forcePopupIcon
                      popupIcon={<ArrowDropDownIcon />}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#000", fontWeight: "600" }}
                    >
                      Priority
                    </Typography>
                    <Typography
                      sx={{ color: getExperienceColor(values.priority) }}
                    >
                      {values.priority}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Status
                  </Typography>
                  <Typography

                  >
                    {values.status}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Experience
                  </Typography>
                  <Typography
                    sx={{ color: getExperienceColor(values.experience) }}
                  >
                    {values.experience}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Impact
                  </Typography>
                  <Typography>{values.impact}</Typography>
                </Box>
                <Box
                  sx={{
                    gridColumn: { xs: "auto", sm: "span 2", md: "span 3" },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Subject
                  </Typography>
                  <Typography>{values.subject}</Typography>
                </Box>
              </Box>

              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
              >
                {/* Request Details Section */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#000", fontWeight: "600" }}
                    >
                      Request Details
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {values.requestdetails}
                  </Typography>
                </Box>
                {/* Activity Timeline */}
                <Box sx={{ display: "flex", mt: 2, alignItems: "flex-start", justifyContent: "flex-start" }}>
                  <ActivityTimeline
                    date={values.date}
                    time={values.time}
                    processtime={values.processtime}
                    processdate={values.processdate}
                    resolvedtime={values.resolvedtime}
                    resolveddate={values.resolveddate}
                  />
                </Box>
                {safeExperienceData.filename && (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      icon={<DownloadOutlined />}
                      disabled={isDownloading}
                      onClick={handleDownload}
                      sx={{ minWidth: 180 }}
                    >
                      {isDownloading ? "Downloading..." : "Download Attachment"}
                    </Button>
                  </Box>
                )}
                {/* Action Buttons */}
                <Box
                  sx={{
                    // display: "flex",
                    justifyContent: "flex-start",
                    gap: 2,
                    mt: 1,
                    display: safeExperienceData.status === "Resolved" ? "none" : "flex",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      padding: "12px 24px",
                      fontSize: "12px",
                      // fontWeight: "600",

                      borderRadius: "8px",
                      boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                      transition: "0.3s",
                      backgroundColor: colors.redAccent[400],
                      color: "#ffffff",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colors.redAccent[500],
                        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                    onClick={() => setOpenConfirm(true)}
                  >
                    Resolve
                  </Button>
                  <ResolveDialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    onConfirm={async () => {
                      setOpenConfirm(false);
                      await handleCloseExperience();
                    }}
                  />
                  {isEditing ? (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setIsEditing(false)}
                        sx={{
                          padding: "12px 24px",
                          fontSize: "12px",
                          // fontWeight: "600",
                          borderRadius: "8px",
                          boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                          transition: "0.3s",
                          backgroundColor: colors.redAccent[400],
                          color: "#ffffff",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: colors.redAccent[500],
                            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setIsEditing(false);
                          message.success("Changes saved!");
                        }}
                        sx={{
                          padding: "12px 24px",
                          fontSize: "12px",
                          // fontWeight: "600",
                          borderRadius: "8px",
                          boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                          transition: "0.3s",
                          background: colors.blueAccent[1000],
                          color: "#ffffff",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: colors.blueAccent[600],
                            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setIsEditing(true)}
                      sx={{
                        padding: "12px 24px",
                        fontSize: "12px",
                        // fontWeight: "600",
                        borderRadius: "8px",
                        boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                        transition: "0.3s",
                        background: colors.blueAccent[1000],
                        color: "#ffffff",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: colors.blueAccent[600],
                          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      {/* Second Column - Customer Support */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: { xs: 1, sm: isDesktop ? 3 : 2 },
          borderRadius: "8px",
          gridColumn: { xs: "1 / -1", md: "2 / 3" },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          minWidth: 0,
        }}
      >
        <ChatSection
          messages={messages}
          newMessage={newMessage}
          editor={editor}
          colors={colors}
          isMobile={isMobile}
          safeExperienceData={safeExperienceData}
          handleSendMessage={handleSendMessage}
          addImage={addImage}
          addTable={addTable}
          addYoutubeVideo={addYoutubeVideo}
          cmname={safeExperienceData.cmname}
        />
      </Box>
      {/* Third Column - Task Management */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: { xs: 1, sm: isDesktop ? 3 : 2 },
          borderRadius: "8px",
          gridColumn: { xs: "1 / -1", md: "1 / -1" },
          mt: { xs: 2, md: 0 },
          width: "100%",
          minWidth: 0,
        }}
      >

        {/* Responsive Table Wrapper */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            p: { xs: 1, sm: 3 },
            borderRadius: "8px",
            gridColumn: { xs: "1 / -1", md: "1 / -1" },
            mt: { xs: 2, md: 0 },
            width: "100%",
            minWidth: 0,
          }}
        >
          <TasksProvider experienceId={ExperienceId} crmId={crmId} experienceStatus={safeExperienceData.status}>
            <KanbanBoard />
          </TasksProvider>
        </Box>
        {/* <AntdModal
          title="Confirm Delete"
          open={deleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="Confirm"
          cancelText="Cancel"
          centered
        >
          <p>Are you sure you want to Delete this task?</p>
        </AntdModal>
        <AntdModal
          title="Confirm Complete"
          open={completeModalVisible}
          onOk={handleConfirmComplete}
          onCancel={handleCancelDelete}
          okText="Confirm"
          cancelText="Cancel"
          centered
        >
          <p>Are you sure you want to Complete this task?</p>
        </AntdModal> */}
        {/* Responsive Assign To Button */}
        <Box
          sx={{
            display: safeExperienceData.status === "Resolved" ? "none" : "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "stretch",
            mb: 2,
            gap: 2,
            mt: 2,
            width: "100%",
            minWidth: 0,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: colors.blueAccent[1000],
              fontWeight: "600",
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none",
              "&:hover": {
                background: colors.blueAccent[1000],
              },
              width: isMobile ? "25%" : "20%",
              fontSize: { xs: "12px", sm: "14px" },
            }}
            onClick={() => setshareEntireExperience(true)}
          >
            Assign To
          </Button>
        </Box>
        {/* Modals */}
        <AssignCrmModal
          open={shareEntireExperience}
          onClose={() => setshareEntireExperience(false)}
          crmNameList={crmNameList}
          experienceid={ExperienceId}
          existcrmid={crmId}
        />
      </Box>
    </Box>
  );
};

export default CrmTicketDetails;