import {
  Box,
  useMediaQuery,
  Typography,
  useTheme,
  // IconButton,
  Button as MuiButtom,
} from "@mui/material";
import { message, Modal, Button } from "antd";
import { Formik } from "formik";
import { tokens } from "../../../theme";
import * as yup from "yup";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import {
//   FormatBold,
//   FormatItalic,
//   FormatUnderlined,
//   FormatListNumbered,
//   FormatListBulleted,
//   InsertPhoto,
//   TableChart,
//   YouTube,
// } from "@mui/icons-material";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TableTiptap from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Youtube from "@tiptap/extension-youtube";
import { Underline } from "@tiptap/extension-underline";
import { io } from "socket.io-client";
import ActivityTimeline from "./ActivityTimeline";
import ChatSection from './ChatSection';


const CmTicketDetails = () => {
  const { experienceid } = useParams();
  const [experienceData, setExperienceData] = useState(null);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "support" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);

  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:484px)");
  const colors = tokens(theme.palette.mode);
  const Navigate = useNavigate();

  // Fetch experience details from backend using URL param
  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/experienceDetailsGet/${experienceid}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setExperienceData(data.data[0]);
        } else {
          setExperienceData({});
        }
      } catch (error) {
        console.error("Error fetching experience data:", error);
        setExperienceData({});
        message.error("Failed to load experience data. Please try again later.");
      }
    };
    if (experienceid) fetchExperienceData();
  }, [experienceid]);

  // Socket setup for chat (join after data is loaded)
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      path: "/socket.io/",
      transports: ["websocket"],
      withCredentials: true,
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Join room after experienceData is loaded and has IDs
  useEffect(() => {
    if (
      socketRef.current &&
      experienceData &&
      experienceData.experienceid &&
      experienceData.extraind1
    ) {
      socketRef.current.emit("joinRoom", {
        experienceid: experienceData.experienceid,
        crmid: experienceData.extraind1,
      });
      socketRef.current.on("receiveMessage", (msg) => {
        setMessages((prev) => [
          ...prev,
          {
            text: msg.message || msg.messege,
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
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage");
        socketRef.current.off("connect_error");
        socketRef.current.off("disconnect");
      }
    };
  }, [
    experienceData?.experienceid,
    experienceData?.extraind1,
    experienceData, // depend on object, safer for hot reloads
  ]);

  // Fetch chat messages initially after data is loaded
  useEffect(() => {
    const fetchMessages = async () => {
      if (!experienceData?.experienceid || !experienceData?.extraind1) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getChatMessages?experienceid=${experienceData.experienceid}&crmid=${experienceData.extraind1}`
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
  }, [experienceData?.experienceid, experienceData?.extraind1]);

  // TipTap Editor setup
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
    onTransaction: ({ editor }) => {
      if (
        socketRef.current &&
        experienceData?.experienceid &&
        experienceData?.extraind1
      ) {
        socketRef.current.emit("insert", {
          experienceid: experienceData.experienceid,
          crmid: experienceData.extraind1,
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
  }, [editor, experienceData?.experienceid, experienceData?.extraind1]);

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

  // Defensive: if experienceData is null, show loading
  if (experienceData === null) {
    return <Box>Loading...</Box>;
  }

  // Defensive: buildInitialValues always receives an object
  const buildInitialValues = (data = {}) => ({
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
  });


  // const filenamevalue = experienceData.filename;


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

  const fileUrl = experienceData.imageUrl || "";
  const filename = fileUrl.split("/").pop() || "attachment";

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

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     console.log("Selected file:", file.name);
  //   }
  // };

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
    const cmid = experienceData.cmid || "";
    const msgData = {
      experienceid: experienceData.experienceid,
      crmid: experienceData.extraind1,
      cmid,
      message: newMessage,
      sender: "user",
      crmname: experienceData.extraind2,
    };

    socketRef.current.emit("sendMessage", msgData);

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/v1/chatInsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message.");
    }

    setNewMessage("");
    if (editor) editor.commands.clearContent();
  };

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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Typography
            className="custom-headding-16px"
          >
            Experience Details
          </Typography>
          {/* <Button
                              type="text"
                              startIcon={<CloseOutlined style={{ fontSize: 20 }} />}
                              onClick={() => navigate(-1)}
                              style={{
                                color: "#3e4396",
                                fontWeight: 600,
                                fontSize: 16,
                                alignSelf: "flex-end",
                                marginLeft: 8,
                              }}
                            /> */}
        </div>
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
                  <Typography variant="subtitle2">{values.id}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Organization
                  </Typography>
                  <Typography variant="subtitle2">{values.organization}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Unit
                  </Typography>
                  <Typography variant="subtitle2">{values.branch}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Customer Manager
                  </Typography>
                  <Typography variant="subtitle2">{values.cmname}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Relationship Manager
                  </Typography>
                  <Typography variant="subtitle2">{values.crmname}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Priority
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: getExperienceColor(values.priority) }}
                  >
                    {values.priority}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Status
                  </Typography>
                  <Typography
                    variant="subtitle2"
                  // sx={{ color: getExperienceColor(values.priority) }}
                  >
                    {values.status}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Date
                  </Typography>
                  <Typography variant="subtitle2">{values.date}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Time
                  </Typography>
                  <Typography variant="subtitle2">{values.time}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#000", fontWeight: "600" }}
                  >
                    Experience
                  </Typography>
                  <Typography
                    variant="subtitle2"
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
                  <Typography variant="subtitle2">{values.impact}</Typography>
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
                  <Typography variant="subtitle2">{values.subject}</Typography>
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
                  <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }} variant="subtitle2">
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

                {/* Download Button */}
                {experienceData.filename && (
                  <Box sx={{ display: "flex", gap: 2, }}>
                    {fileUrl && (
                      <MuiButtom
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
                      </MuiButtom>
                    )}
                  </Box>
                )}

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {values.status === "New" && (
                    <Button
                      type="primary"
                      style={{
                        padding: "12px 24px",
                        fontSize: "12px",
                        fontWeight: "600",
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
                          title:
                            "Are you sure you want to delete this experience?",
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
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    experienceid: values.id,
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

        <Typography sx={{ fontSize: "18px", fontWeight: 600 }} >
          Discussions
        </Typography>
        <ChatSection
          messages={messages}
          newMessage={newMessage}
          editor={editor}
          colors={colors}
          isMobile={isMobile}
          experienceData={experienceData}
          handleSendMessage={handleSendMessage}
          addImage={addImage}
          addTable={addTable}
          addYoutubeVideo={addYoutubeVideo}
        />
      </Box>
    </Box>
  );
};

export default CmTicketDetails;