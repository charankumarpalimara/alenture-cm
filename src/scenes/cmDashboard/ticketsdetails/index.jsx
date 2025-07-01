import {
  Box,
  useMediaQuery,
  Typography,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import { message, Modal } from "antd";
import { Formik } from "formik";
import { tokens } from "../../../theme";
import * as yup from "yup";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import download from "downloadjs";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListNumbered,
  FormatListBulleted,
  InsertPhoto,
  TableChart,
  YouTube,
} from "@mui/icons-material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TableTiptap from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Youtube from "@tiptap/extension-youtube";
import { Underline } from "@tiptap/extension-underline";
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { io } from "socket.io-client";
// const SOCKET_URL = "http://147.182.163.213:3000/";

const CmTicketDetails = () => {
  const location = useLocation();
  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);

  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      path: "/socket.io/",
      transports: ["websocket"],
      withCredentials: true,
    });
    if (ticket.experienceid && ticket.crmid) {
      socketRef.current.emit("joinRoom", {
        experienceid: ticket.experienceid,
        crmid: ticket.crmid,
      });
    }

    socketRef.current.on("receiveMessage", (msg) => {
      console.log("messag", msg);
      setMessages((prev) => [
        ...prev,
        {
          text: msg.message || msg.messege, // <-- handle both
          sender: msg.sender,
          time: msg.time,
        },
      ]);
    });
    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [ticket.experienceid, ticket.crmid]);

  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:484px)");
  const colors = tokens(theme.palette.mode);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);
  const Navigate = useNavigate();
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "support" },
  ]);
  const [newMessage, setNewMessage] = useState("");

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
    console.log("Form Data:", { ...values, fullPhoneNumber });
  };

  const initialValues = {
    organizationid: ticket.organizationid || "",
    organization: ticket.organizationname || "",
    crmid: ticket.crmid || "",
    cmname: ticket.cmname || "",
    experience: ticket.experience || "",
    branch: ticket.branch || "",
    priority: ticket.priority || "",
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
    impact: ticket.impact || "",
    id: ticket.experienceid || "",
    imageUrl: ticket.imageUrl || "",
  };

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
        setMessages([{ text: "Failed to load messages.", sender: "support" }]);
      }
    };
    fetchMessages();
  }, [ticket.experienceid, ticket.crmid]);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file.name);
    }
  };

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
    // Enable collaborative editing (emit changes)
    onTransaction: ({ editor }) => {
      // Emit the message content to the server for real-time sync
      if (socketRef.current && ticket.experienceid && ticket.crmid) {
        socketRef.current.emit("insert", {
          experienceid: ticket.experienceid,
          crmid: ticket.crmid,
          content: editor.getHTML(),
        });
      }
    },
  });

  // Listen for 'insert' events to update the editor content in real-time
  useEffect(() => {
    if (!socketRef.current) return;
    const handleInsert = (data) => {
      if (data && data.content && editor) {
        editor.commands.setContent(data.content);
      }
    };
    socketRef.current.on("insert", handleInsert);
    return () => {
      socketRef.current.off("insert", handleInsert);
    };
  }, [editor, ticket.experienceid, ticket.crmid]);

  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const cmid = ticket.cmid || "";
    const msgData = {
      experienceid: ticket.experienceid,
      crmid: ticket.crmid,
      cmid,
      message: newMessage,
      sender: "user",
      crmname: ticket.crmname,
    };
    console.log("msg data", msgData);

    // Emit real-time message (do NOT optimistically add to UI)
    socketRef.current.emit("sendMessage", msgData);

    // REMOVE this block:
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     text: newMessage,
    //     sender: "user",
    //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //   }
    // ]);

    // Save message to DB via REST API
    try {
      // await fetch(`${process.env.REACT_APP_API_URL}/v1/chatInsert`, {
         await fetch(`http://127.0.0.1:8080/v1/chatInsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message.");
    }

    setNewMessage("");
    editor.commands.clearContent();
  };

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

  // const customerManagers = [
  //   "Rambabu",
  //   "Charan",
  //   "Lakshman",
  //   "Satya dev",
  //   "Ram",
  // ];

  // const priority = [
  //   "Urgent",
  //   "High",
  //   "Low",
  // ];

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
          md: "repeat(2, 1fr)",
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
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Experience ID
                  </Typography>
                  <Typography>{values.id}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Organization
                  </Typography>
                  <Typography>{values.organization}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Branch
                  </Typography>
                  <Typography>{values.branch}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Customer Manager
                  </Typography>
                  <Typography>{values.cmname}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Customer Relationship Manager
                  </Typography>
                  <Typography>{values.crmname}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Priority
                  </Typography>
                  <Typography
                    sx={{ color: getExperienceColor(values.priority) }}
                  >
                    {values.priority}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Status
                  </Typography>
                  <Typography
                    sx={{ color: getExperienceColor(values.priority) }}
                  >
                    {values.status}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Date
                  </Typography>
                  <Typography>{values.date}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Time
                  </Typography>
                  <Typography>{values.time}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
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
                    sx={{ color: "#555", fontWeight: "bold" }}
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
                    sx={{ color: "#555", fontWeight: "bold" }}
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
                      sx={{ color: "#555", fontWeight: "bold" }}
                    >
                      Request Details
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {values.requestdetails}
                  </Typography>
                </Box>


                {/* Download Button */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  {ticket.imageUrl && (
                    <Button
                      variant="contained"
                      // icon={<DownloadOutlined />}
                      disabled={isDownloading}
                      onClick={handleDownload}
                      sx={{ minWidth: 180 }}
                    >
                      {isDownloading ? "Downloading..." : "Download Attachment"}
                    </Button>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {ticket.status === "New" && (
                  <Button
                    variant="contained"
                    sx={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "bold",
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
                    onClick={() => {
                      Modal.confirm({
                        title: "Are you sure you want to delete this experience?",
                        content: "This action cannot be undone.",
                        okText: "Yes, Delete",
                        okType: "danger",
                        cancelText: "Cancel",
                        onOk: async () => {
                          try {
                            await fetch(
                              `${process.env.REACT_APP_API_URL}/v1/deleteExperienceByCm`,
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  experienceid: ticket.experienceid,
                                }),
                              }
                            );
                            message.success("Experience deleted successfully!");
                            Navigate("/");
                          } catch (error) {
                            message.error("Failed to delete experience.");
                          }
                        },
                      });
                    }}
                  >
                    Delete
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
        {/* Chat Section */}
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
            {" "}
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
                    message.sender === "user" ? "flex-start" : "flex-end",
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
                      You
                    </Typography>
                  )}
                  {/* Message bubble */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor:
                        message.sender === "user"
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
                        textAlign: message.sender === "user" ? "left" : "right",
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
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Toolbar */}
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
                <IconButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  color={editor.isActive("bold") ? "primary" : "default"}
                  size="small"
                >
                  <FormatBold fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  color={editor.isActive("italic") ? "primary" : "default"}
                  size="small"
                >
                  <FormatItalic fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  color={editor.isActive("underline") ? "primary" : "default"}
                  size="small"
                >
                  <FormatUnderlined fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  color={editor.isActive("bulletList") ? "primary" : "default"}
                  size="small"
                >
                  <FormatListBulleted fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  color={editor.isActive("orderedList") ? "primary" : "default"}
                  size="small"
                >
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
            {/* Editor Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                overflow: "scroll",
                height: "250px",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  minHeight: "100px",
                  maxHeight: "100px",
                  "& .tiptap": {
                    minHeight: "200px",
                    outline: "none",
                    "& p": {
                      margin: 0,
                      marginBottom: "0.5em",
                    },
                  },
                }}
              >
                <EditorContent editor={editor} />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            maxHeight: "100px",
            width: "100%",
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            fullWidth
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: "#ffffff",
              "&:hover": { backgroundColor: colors.blueAccent[600] },
              textTransform: "none",
              minWidth: 0,
              width: "100%",
              fontSize: { xs: "14px", sm: "16px" },
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CmTicketDetails;
