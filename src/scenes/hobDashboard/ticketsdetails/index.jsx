import {
  Box,
  useMediaQuery,
  useTheme,
  TextField,
  Autocomplete,
  // IconButton,
  Modal,
  Button, Dialog, DialogContent, DialogActions, Typography,
} from "@mui/material";
import {
  Form,
  Input,
  Select,
  // Button as AntdButton,
  Col,
  Row,
  message,
  // Modal as AntdModal,
  // Table,
} from "antd";
import { Formik } from "formik";
import { tokens } from "../../../theme";
import * as yup from "yup";
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  // useCallback,
} from "react";
import { useLocation } from "react-router-dom";
// import download from "downloadjs";
import {
  // Check as CheckIcon,
  // Delete as DeleteIcon,
  // Add as AddIcon,
} from "@mui/icons-material";
import { DownloadOutlined } from "@ant-design/icons";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ActivityTimeline from "./ActivityTimeline";
import { TasksProvider } from "../../../utils/TasksContext";
import KanbanBoard from "../../../components/KanbanTasks";

// const { Option } = Select;

const AdminTicketDetails = () => {
  const [form] = Form.useForm();
  const socketRef = useRef(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:484px)");
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // const [crmIdList, setCrmIdList] = useState([]); 
  const [crmNameList, setCrmNameList] = useState([]);
  const [crmNamelistExp, setCrmNameListExp] = useState([]);
  // const [tasks, setTasks] = useState([]);
  const Navigate = useNavigate();
  // const [openTaskModal, setOpenTaskModal] = useState(false);
  const [shareEntireExperience, setshareEntireExperience] = useState(false);
  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);
  // const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // const [deletingTaskId, setDeletingTaskId] = useState(null);
  // const [completeModalVisible, setCompleteModalVisible] = useState(false);
  // const [completeTaskId, setCompleteTaskId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

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

  // const handleFormSubmit = (values) => {
  //   const fullPhoneNumber = `${values.phoneCode}${values.PhoneNo}`;
  //   console.log("Form Data:", { ...values, fullPhoneNumber });
  // };

  // const columns = [
  //   {
  //     title: "ID",
  //     dataIndex: "id",
  //     key: "id",
  //     width: 100,
  //     render: (_text, _record, index) => <span>{index + 1}</span>, // Serial number
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

  const initialValues = {
    organizationid: ticket.organizationid || "",
    organization: ticket.organizationname || "",
    crmid: ticket.crmid || "",
    cmname: ticket.cmname || "",
    experience: ticket.experience || "",
    branch: ticket.branch || "",
    priority: ticket.priority || "",
    impact: ticket.impact || "",
    crmname: ticket.crmname || "",
    status: ticket.status || "",
    department: ticket.department || "",
    date: ticket.date || "",
    time: ticket.time || "",
    subject: ticket.subject || "",
    requestdetails: ticket.experiencedetails || "",
    phoneCode: ticket.phoneCode || "",
    PhoneNo: ticket.PhoneNo || "",
    notes: ticket.notes || "",
    processtime: ticket.processtime || "",
    processdate: ticket.processdate || "",
    resolvedtime: ticket.resolvedtime || "",
    resolveddate: ticket.resolveddate || "",
    // filename: ticket.filename || "",
    id: ticket.experienceid || "",
    imageURl: ticket.imageUrl || "",
  };

  const filenamevalue = ticket.filename;

  const ExperienceId = ticket.experienceid || "";
  const crmId = ticket.crmid || "";

  console.log("Ticket Details:", ticket);

  // useEffect(() => {
  //   const fetchCrmIds = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}/v1/getCrmId`
  //       );
  //       if (response.ok) {
  //         const data = await response.json();
  //         if (Array.isArray(data.crmid)) {
  //           setCrmIdList(data.crmid.map((item) => item.crmid));
  //         }
  //       }
  //     } catch (error) {}
  //   };
  //   fetchCrmIds();
  // }, []);

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


  // const fetchTasks = useCallback(async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL}/v1/getTaskDataByExpId`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           experienceId: ticket.experienceid,
  //           crmid: ticket.crmid,
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
  // }, [ticket.experienceid, ticket.crmid]);




  // useEffect(() => {
  //   if (!ticket.experienceid || !ticket.crmid) return;
  //   fetchTasks();
  // }, [ticket.experienceid, ticket.crmid, fetchTasks]);

  // // For fetchTasks
  // useEffect(() => {
  //   if (!ticket.experienceid || !ticket.crmid) return;
  //   fetchTasks();
  //   // Add fetchTasks as dependency
  // }, [ticket.experienceid, ticket.crmid, fetchTasks]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (!ticket.experienceid || !ticket.crmid) return;
  //     try {
  //       const res = await fetch(
  //         `http://localhost:8080/api/v1/getChatMessages?experienceid=${ticket.experienceid}&crmid=${ticket.crmid}`
  //       );
  //       const data = await res.json();
  //       if (Array.isArray(data.messages)) {
  //         setMessages(data.messages.map(msg => ({
  //           text: msg.message,
  //           sender: msg.sender
  //         })));
  //       }
  //     } catch (error) {
  //       setMessages([{ text: "Failed to load messages.", sender: "support" }]);
  //     }
  //   };
  //   fetchMessages();
  // }, [ticket.experienceid, ticket.crmid]);

  // const handleDeleteTask = (id) => (event) => {
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


  const fileUrl = ticket.imageUrl || ""; // your file URL
  const filename = fileUrl.split("/").pop() || "attachment";

  const handleDownload = async (fileUrl) => {
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

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     console.log("Selected file:", file.name);
  //   }
  // };

  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "support" },
  ]);
  // const [newMessage, setNewMessage] = useState("");

  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     Underline,
  //     Image.configure({
  //       inline: true,
  //       allowBase64: true,
  //     }),
  //     TableTiptap.configure({
  //       resizable: true,
  //     }),
  //     TableRow,
  //     TableHeader,
  //     TableCell,
  //     Youtube,
  //   ],
  //   content: newMessage,
  //   onUpdate: ({ editor }) => {
  //     setNewMessage(editor.getHTML());
  //   },
  // });

  // const addImage = () => {
  //   const url = window.prompt("Enter the URL of the image:");
  //   if (url) {
  //     editor.chain().focus().setImage({ src: url }).run();
  //   }
  // };

  // const addYoutubeVideo = () => {
  //   const url = window.prompt("Enter YouTube URL:");
  //   if (url) {
  //     editor.commands.setYoutubeVideo({
  //       src: url,
  //       width: 640,
  //       height: 480,
  //     });
  //   }
  // };

  // const addTable = () => {
  //   editor
  //     .chain()
  //     .focus()
  //     .insertTable({
  //       rows: 3,
  //       cols: 3,
  //       withHeaderRow: true,
  //     })
  //     .run();
  // };

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL);
    if (ticket.experienceid && ticket.crmid) {
      socketRef.current.emit("joinRoom", {
        experienceid: ticket.experienceid,
        crmid: ticket.crmid,
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
  }, [ticket.experienceid, ticket.crmid]);




  useEffect(() => {
    const fetchMessages = async () => {
      if (!ticket.experienceid || !ticket.crmid) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getChatMessages?experienceid=${ticket.experienceid}&crmid=${ticket.crmid}`
        );
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((msg) => ({
              text: msg.messege, // <-- use 'messege'
              sender: msg.sender,
              time: msg.time,
              crmname: msg.extraind1, // <-- include crmname if available
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
  }, [ticket.experienceid, ticket.crmid]);

  // useEffect(() => {
  //   const sendProcessingStatus = async () => {
  //     const msgData = {
  //       experienceid: ticket.experienceid,
  //       status: "Processing",
  //     };

  //     try {
  //       await fetch(
  //         `${process.env.REACT_APP_API_URL}/v1/updateExperienceStatus`,
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(msgData),
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //       message.error("Failed to send message.");
  //     }
  //   };

  //   if (ticket.experienceid) {
  //     sendProcessingStatus();
  //   }
  // }, [ticket.experienceid]);



  useEffect(() => {
    const fetchCrmNamesByExperienceid = async () => {
      if (!ticket.experienceid) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getCrmNamesByExperienceid/${ticket.experienceid}`
        );
        const data = await res.json();
        if (data && Array.isArray(data.data)) {
          setCrmNameListExp(data.data);
        } else {
          setCrmNameListExp([]);
        }
      } catch (error) {
        setCrmNameListExp([]);
      }
    };
    fetchCrmNamesByExperienceid();
  }, [ticket.experienceid]);

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

  const assignmodel = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isDesktop ? "40%" : "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  // const handleRowClick = (params) => {
  //   Navigate("/taskdetails", { state: { ticket: params.row } });
  // };

  // const handleCompleteTask = (id) => (event) => {
  //   event.stopPropagation();
  //   console.log("Task completed:", id);
  // };

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
  //       // setTasks(prev => prev.filter(task => task.id !== completeTaskId));
  //       message.success("Task deleted successfully!");
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


  const handleCloseExperience = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/v1/updateExperienceStatusToResolve`,
        //  `http://127.0.0.1:8080/v1/updateExperienceStatusToResolve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experienceid: ticket.experienceid,
            status: "Resolved",
          }),
        }
      );
      message.success("Experience status updated to Resolved!");
      Navigate("/resolvedExperiences");
    } catch (error) {
      message.error("Failed to update status.");
    }
  }
  useEffect(() => {
    const fetchCrmNames = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCrmNames`);
      const data = await res.json();
      setCrmNameList(data.data || []);
    };
    fetchCrmNames();
  }, []);




  // const TaskForm = ({ handleClose, fetchTasks }) => {
  //   const [taskForm] = Form.useForm();
  //   const [loading, setLoading] = useState(false);
  //   const priorityOptions = ["Urgent", "High", "Low"];

  //   const handleFormSubmit = async (values) => {
  //     const formData = new FormData();
  //     formData.append("experienceid", ticket.experienceid || "");
  //     formData.append("taskname", values.taskname || "");
  //     formData.append("taskowner", values.taskowner || "");
  //     formData.append("priority", values.priority || "");
  //     formData.append("discription", values.description || "");

  //     // const sessionData = JSON.parse(
  //     //   sessionStorage.getItem("userDetails") || "{}"
  //     // );
  //     const crmid = ticket.crmid || "";
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
  //         if (fetchTasks) fetchTasks(); // update table instantly
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
  //               background: colors.redAccent[500],
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

  const AssignCrm = ({ handleClose, crmNameList = [] }) => {
    const [assignForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFinish = async (values) => {
      setLoading(true);
      try {
        const experienceid = ticket.experienceid;
        const existcrmid = ticket.crmid;
        const crmid = values.crmid;
        const crmname = values.crmname;

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/AssignTask`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ experienceid, crmid, existcrmid, crmname }),
          }
        );

        if (response.ok) {
          message.success("Task assigned successfully!");
          handleClose();
        } else {
          const data = await response.json();
          message.error(data.error || "Failed to assign task.");
        }
      } catch (error) {
        message.error("Error assigning task.");
      }
      setLoading(false);
    };

    //     useEffect(() => {
    //   const fetchCrmNames = async () => {
    //     try {
    //       const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/GetCrmNames`);
    //       const data = await res.json();
    //       setCrmNameList(data.data || []);
    //     } catch (error) {
    //       setCrmNameList([]);
    //     }
    //   };
    //   fetchCrmNames();
    // }, []);

    return (
      <Form
        form={assignForm}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ crmid: "", crmname: "" }}
        style={{ minHeight: "200px", justifyContent: "space-between" }}
      >
        <Row gutter={16} style={{ flexDirection: "column" }}>
          <Col xs={24} md={24} style={{ width: "100%" }}>
            <Form.Item
              label="Relationship Manager Name"
              name="crmname"
              rules={[{ required: true, message: "CRM Name is required" }]}
              style={{ width: "100%" }}
            >
              <Select
                showSearch
                placeholder="Select CRM Name"
                optionFilterProp="children"
                size="large"
                style={{ width: "100%" }}
                getPopupContainer={trigger => trigger.parentNode}
                onChange={(value) => {
                  const selected = crmNameList.find(crm => crm.crmid === value);
                  // Set both crmname and crmid in the form
                  assignForm.setFieldsValue({
                    crmname: selected ? selected.name : "",
                    crmid: value
                  });
                }}
              >
                {crmNameList.map((crm) => (
                  <Select.Option key={crm.crmid} value={crm.crmid}>
                    {crm.name} ({crm.crmid})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="CRM ID" name="crmid" style={{ display: "none" }}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={8}>
          <Col>
            <Button
              className="form-button"
              onClick={handleClose}
              style={{ background: colors.redAccent[500], color: "#fff", borderRadius: 8, }}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              className="form-button"
              onClick={() => assignForm.submit()}
              disabled={loading}
              style={{
                background: colors.blueAccent[1000],
                borderRadius: 8,
                color: "#fff",
                ...(loading && { opacity: 0.7 }),
              }}
            >
              {loading ? "Assigning..." : "Assign"}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // const customerManagers = [
  //   "Rambabu",
  //   "Charan",
  //   "Lakshman",
  //   "Satya dev",
  //   "Ram",
  // ];

  const priority = ["Urgent", "High", "Medium", "Low"];

  // const status = [
  //   "Pending",
  //   "Processing",
  //   "Closed",
  // ];

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
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        // onSubmit={handleFormSubmit}
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
                  {crmNamelistExp && crmNamelistExp.length > 0 ? (
                    crmNamelistExp.map((crm, idx) => (
                      <Typography key={crm.crmid || idx}>
                        {idx + 1}. {crm.crmnamebyexp} {crm.crmid ? `(${crm.crmid})` : ""}
                      </Typography>
                    ))
                  ) : (
                    <Typography>No Relationship Manager assigned</Typography>
                  )}
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

                        // Call backend API to update priority
                        try {
                          await fetch(
                            `${process.env.REACT_APP_API_URL}/v1/updateExperiencePriority`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                experienceid: ticket.experienceid, // or ticket.experienceid
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
                    sx={{
                      color:
                        values.experience?.trim() === "Frustrated"
                          ? "#E64A19"
                          : values.experience?.trim() === "Extremely Frustrated"
                            ? "#D32F2F"
                            : values.experience?.trim() === "Happy"
                              ? "#FBC02D"
                              : values.experience?.trim() === "Extremely Happy"
                                ? "#388E3C"
                                : "#616161",
                    }}
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

                {/* ----- ACTIVITY TIMELINE - Full Width Row ----- */}

                {/* ----- END ACTIVITY TIMELINE ----- */}


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
                </Box>



                {filenamevalue !== 'N/A' && (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      className="form-button"
                      disabled={isDownloading}
                      onClick={handleDownload}
                      sx={{
                        border: '1px solid #3e4396',
                        cursor: 'pointer',
                        maxWidth: '180px',
                        background: 'transparent',
                        color: '#3e4396',
                        borderRadius: 8,
                        fontWeight: 600,
                        transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                        '&:hover': {
                          border: '1px solid #2E2E9F',
                          color: '#2E2E9F',
                          background: '#f5f7ff',
                        },
                      }}
                    >
                      {isDownloading ? "Downloading..." : "Download Attachment"}
                    </Button>
                    {/* <Typography variant="body2" sx={{ color: colors.grey[600] }}>
                {filenamevalue}
              </Typography> */}
                  </Box>
                )}

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: 2,
                    mt: 1,

                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => setOpenConfirm(true)}
                    className="form-button"
                    sx={{
                      background: colors.redAccent[400],
                      color: "#fff",
                      "&:hover": { background: colors.redAccent[500] },
                      textTransform: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Resolve
                  </Button>
                  {/* <Button
                    variant="outlined"
                    onClick={() => setshareEntireExperience(true)}
                    className="form-button"
                    sx={{
                      borderColor: colors.blueAccent[500],
                      color: colors.blueAccent[500],
                      "&:hover": { borderColor: colors.blueAccent[600] },
                      textTransform: "none",
                    }}
                  >
                    Assign CRM
                  </Button> */}

                  <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                    {/* <DialogTitle>Are you sure?</DialogTitle> */}
                    <DialogContent>
                      <Typography>Are you sure you want to Resolve this experience?</Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button className="form-button" onClick={() => setOpenConfirm(false)} color="primary">
                        Cancel
                      </Button>
                      <Button
                        className="form-button"
                        onClick={async () => {
                          setOpenConfirm(false);
                          await handleCloseExperience();
                        }}
                        color="error"
                        variant="contained"
                      >
                        Yes, Close
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {isEditing ? (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        className="form-button"
                        onClick={() => setIsEditing(false)}
                        sx={{
                          padding: "12px 24px",
                          borderRadius: "8px",
                          boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                          transition: "0.3s",
                          background: colors.redAccent[400],
                          color: "#ffffff",
                          textTransform: "none",
                          "&:hover": {
                            background: colors.redAccent[500],
                            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="contained"
                        className="form-button"
                        onClick={() => setIsEditing(false)}
                        sx={{
                          padding: "12px 24px",
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
                      className="form-button"
                      sx={{
                        padding: "12px 24px",
                        borderRadius: "8px",
                        boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                        transition: "0.3s",
                        background: colors.blueAccent[1000],
                        display: ticket.status === "Resolved" ? "none" : "block",
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
      {/* Customer Support Chat */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: isDesktop ? 3 : 2,
          borderRadius: "8px",
          gridColumn: {
            xs: "1 / -1",
            md: "2 / 3",
          },
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 3,
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            minHeight: isMobile ? "550px" : "",
            maxHeight: isMobile ? "600px" : "620px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Discussions
          </Typography>
          <Typography sx={{ mb: 2, color: colors.grey[600] }}>
            Discuss with Customer Support
          </Typography>
          {/* Messages Display */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "4px",
              p: 2,
              mb: 2,
              border: "1px solid #ddd",
              overflowY: "auto",
              minHeight: "200px",
              maxHeight: "800px",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent:
                    message.sender === "manager" ? "flex-start" : "flex-end",
                }}
              >
                <Box>
                  {/* Show extraind1 above the message if sender is manager */}
                  {message.sender === "manager" ? (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.grey[700],
                        fontWeight: "bold",
                        mb: 0.5,
                        display: "block",
                        textAlign: "left",
                      }}
                    >
                      {message.crmname}
                    </Typography>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.grey[700],
                        fontWeight: "bold",
                        mb: 0.5,
                        display: "block",
                        textAlign: "left",
                      }}
                    >
                      {ticket.cmname}
                    </Typography>
                  )}
                  {/* Message bubble */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor:
                        message.sender === "manager"
                          ? colors.blueAccent[100]
                          : "#f0f0f0",
                      display: "inline-block",
                      minWidth: 80,
                      maxWidth: 350,
                      textAlign: "left",
                    }}
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                  {/* Time below the message */}
                  {message.time && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#aaa",
                        display: "block",
                        mt: 0.5,
                        textAlign:
                          message.sender === "manager" ? "left" : "right",
                      }}
                    >
                      {message.time}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Tiptap Editor */}
          {/* <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {editor && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 1,
                  borderBottom: `1px solid ${colors.grey[300]}`,
                  flexWrap: "wrap",
                }}
              >
                <IconButton onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive("bold") ? "primary" : "default"} size="small">
                  <FormatBold fontSize="small" />
                </IconButton>
                <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive("italic") ? "primary" : "default"} size="small">
                  <FormatItalic fontSize="small" />
                </IconButton>
                <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()} color={editor.isActive("underline") ? "primary" : "default"} size="small">
                  <FormatUnderlined fontSize="small" />
                </IconButton>
                <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive("bulletList") ? "primary" : "default"} size="small">
                  <FormatListBulleted fontSize="small" />
                </IconButton>
                <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive("orderedList") ? "primary" : "default"} size="small">
                  <FormatListNumbered fontSize="small" />
                </IconButton>
                <IconButton onClick={addImage} size="small">
                  <InsertPhoto fontSize="small" />
                </IconButton>
                <IconButton onClick={addTable} size="small">
                  <TableChart fontSize="small" />
                </IconButton>
                <IconButton onClick={addYoutubeVideo} size="small">
                  <YouTube fontSize="small" />
                </IconButton>
              </Box>
            )}
            <Box sx={{ display: "flex", flexDirection: "row", overflow: "scroll", height: "250px" }}>
              <Box sx={{ flex: 1, p: 2, minHeight: "100px", maxHeight: "100px" }}>
                <EditorContent editor={editor} />
              </Box>
            </Box>
          </Box> */}
        </Box>
        {/* <Box sx={{ display: "flex", justifyContent: "flex-end", maxHeight: "100px" }}>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: "#ffffff",
              "&:hover": { backgroundColor: colors.blueAccent[600] },
              textTransform: "none",
              minWidth: "100px",
            }}
          >
            Send
          </Button>
        </Box> */}
      </Box>



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
        {/* Ant Design Table */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
            alignItems: "stretch",
            mb: 2,
            gap: 2,
            width: "100%",
            minWidth: 0,
          }}
        >
          {/* <Button
            variant="contained"
            fullWidth
            sx={{
              background: colors.blueAccent[500],
              fontWeight: "bold",
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none",
              "&:hover": { backgroundColor: colors.blueAccent[600] },
              width: isMobile ? "45%" : "20%",

              fontSize: { xs: "12px", sm: "14px" },
            }}
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskModal(true)}
          >
            Create New Task
          </Button> */}
        </Box>

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
          <TasksProvider experienceId={ExperienceId} crmId={crmId}>
            <KanbanBoard />
          </TasksProvider>

        </Box>


        {/* Responsive Assign To Button */}
        <Box
          sx={{
            display: ticket.status === "Resolved" ? "none" : "flex",
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
            className="form-button"
            fullWidth
            sx={{
              background: colors.blueAccent[1000],
              // fontWeight: "600",
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none",
              // padding: "14px 20px",
              "&:hover": {
                backgroundColor: colors.blueAccent[900],
              },
              width: isMobile ? "25%" : "20%",
            }}
            onClick={() => setshareEntireExperience(true)}
          >
            Assign To
          </Button>
        </Box>



        <Modal
          open={shareEntireExperience}
          onClose={() => setshareEntireExperience(false)}
          aria-labelledby="task-modal-title"
          aria-describedby="task-modal-description"
        >
          <Box sx={assignmodel}>
            <Typography
              id="task-modal-title"
              variant="h5"
              component="h2"
              sx={{ mb: 3 }}
            >
              Assign To Relationship Manager
            </Typography>
            <AssignCrm
              handleClose={() => setshareEntireExperience(false)}
              crmNameList={crmNameList}
            />
          </Box>
        </Modal>
      </Box>
    </Box>


  );
};

export default AdminTicketDetails;
