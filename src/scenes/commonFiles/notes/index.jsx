// http://localhost:8080/api/v1/createNote

//http://localhost:8080/api/v1/noteGetByid/id

import {
  Box,
  Typography,
  useMediaQuery,
  Button as MuiButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { tokens } from "../../../theme";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import {
  Input,
  Button,
  Modal as AntdModal,
  Typography as AntdTypography,
  message,
  Spin,
} from "antd";
// import { Formik } from "formik";
// import * as yup from "yup";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { getCreaterRole, getCreaterId } from "../../../config";

const { TextArea } = Input;

const Notes = () => {
  // Responsive breakpoints
  const isDesktop = useMediaQuery("(min-width: 1024px)"); // Desktop (5 columns)
  const isTablet = useMediaQuery("(min-width: 768px)"); // Tablet (3 columns)
  //  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const colors = tokens("light");
  const [openModal, setOpenModal] = useState(false);
  // const [openTaskModal, setTaskopenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setName(""); // Reset input field
    setIsLoading(false); // Reset loading state
  };

  const fetchNotes = async () => {
    // setIsLoading(true);
    try {

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1/noteGetByid/${getCreaterId()}`
      );
      setNotes(res.data.notes || []);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleEditClick = (note) => {
    setEditNote(note);
    setEditName(note.name);
    setEditDescription(note.description);
    setEditModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      message.warning("Please enter both name and description.");
      return;
    }
    try {
      setIsLoading(true);
      // const sessionData = JSON.parse(sessionStorage.getItem("CmDetails"));
      const createrid = getCreaterId();
      const createrrole = getCreaterRole();

      const payload = {
        createrid,
        createrrole,
        name,
        description,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/createNote`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200 || res.status === 201) {
        message.success(res.data?.message || "Note created successfully");
        setIsLoading(false);
        setOpenModal(false); // Close modal on success
        setName("");
        setDescription("");
        fetchNotes();
      }
    } catch (err) {
      message.error("Failed to create note");
      console.error("Failed to create note", err);
    }
  };

  const handleEditSubmit = async () => {
    if (!editName.trim() || !editDescription.trim()) {
      message.warning("Please enter both name and description.");
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        name: editName,
        description: editDescription,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/UpdateNoteDetails/${editNote.id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        message.success(res.data?.message || "Note updated successfully");
        setEditModalOpen(false);
        setEditNote(null);
        setEditName("");
        setEditDescription("");
        fetchNotes();
      }
    } catch (err) {
      message.error("Failed to update note");
      console.error("Failed to update note", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/v1/NoteDelete/${editNote.id}`
      );
      if (res.status === 200) {
        message.success(res.data?.message || "Note deleted successfully");
        setEditModalOpen(false);
        setEditNote(null);
        setEditName("");
        setEditDescription("");
        fetchNotes();
      }
    } catch (err) {
      message.error("Failed to delete note");
      console.error("Failed to delete note", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.name.toLowerCase().includes(searchTerm.toLowerCase())
    // note.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const StyledTextField = ({ label, name, value, handleChange, handleBlur, error, multiline = false, rows = 1 }) => {
  //   return (
  //     <TextField
  //       fullWidth
  //       variant="outlined"
  //       label={label}
  //       name={name}
  //       value={value}
  //       onChange={handleChange}
  //       onBlur={handleBlur}
  //       error={!!error}
  //       helperText={error}
  //       multiline={multiline}
  //       rows={rows}
  //       sx={{ marginBottom: "15px" }}
  //     />
  //   );
  // };

  // Dynamic columns based on screen size
  const columns = isDesktop ? 5 : isTablet ? 3 : 1;

  // const sections = [
  //   { title: "Aliquam ut iste est aperiam quis.", text: "Inventore ut dolor illum quidem corporis..." },
  //   { title: "Autem aliquam occaecati voluptatibus...", text: "Dicta voluptas dolor ut labore ture culpa..." },
  //   { title: "Dolores aut atque deserunt blanditiis...", text: "Id amet inventore eius labore exercitationem..." },
  //   { title: "Et at rem nobis assumenda rem non...", text: "Quia autem occaecati dolores et id explicabo..." },
  //   { title: "Magni accusantium iusto neque et rerum...", text: "Laborum et vitae deserunt voluptas..." },
  //   { title: "15th March, 2025", isDate: true },
  //   { title: "Necessitatibus sed officiis rerum omnis...", text: "Quia tempore corporis tempora asperiores..." },
  //   { title: "Qui rem dolores veniam vero qui.", text: "Impedit impedit necessitatibus quis ad..." },
  //   { title: "Quod eum dolore facilis optio modi...", text: "Est corporis explicabo necessitatibus..." },
  //   { title: "15th March, 2025", isDate: true },
  // ];

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            color: "#fff",
            fontSize: "20px",
          }}
        >
          <Spin size="large" fullscreen />
          {/* <div style={{ position: 'absolute', top: '60%', width: '100%', textAlign: 'center', color: '#fff', fontSize: 18 }}>
                    Loading... Please wait while we process your request.
                  </div> */}
        </div>
      )}
      <Box sx={{ padding: 3 }}>
        {/* {isMobile ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            gap={2}
          >
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              prefix={<SearchIcon style={{ color: "rgba(0,0,0,.25)" }} />}
              style={{
                background: "#ffffff",
                flexGrow: 1,
                minWidth: "50px",
                maxWidth: "600px",
                padding: "5px 20px",
                borderRadius: "8px",
                border: "none",
              }}
            />
            <Button
              type="primary"
              onClick={handleOpenModal}
              className="form-button"
              style={{
                background: colors.blueAccent[1000],
                color: "#fff",
                width: "40%",
                height: "55px",
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Create New
            </Button>
          </Box>
        ) : ( */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="center"
          alignItems="center"
          paddingX={10}
          p={3}
          gap={2}
        >
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            prefix={<SearchIcon style={{ color: "rgba(0,0,0,.25)" }} />}
            style={{
              height: "34px",
              width: isMobile ? "100%" : "50%",
              borderRadius: "3px",
              border: "none",
              boxShadow: "none",
            }}
          />
          <Button
            type="primary"
            onClick={handleOpenModal}
            className="form-button"
            icon={<AddIcon />}
            style={{
              background: colors.blueAccent[1000],
              color: "#fff",
              // width: "15%",
              height: "34px",
              borderRadius: "4px",
              textTransform: "none",
            }}
          >
            Create New
          </Button>
        </Box>
        {/* )} */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 2,
          }}
        >
          {filteredNotes.map((note, index) => (
            <Box
              key={note.id || index}
              sx={{
                padding: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                position: "relative",
                minHeight: 220, // Set a fixed minimum height for all cards
                maxHeight: 220, // Set a fixed maximum height for all cards
                height: 220, // Set a fixed height for all cards
                width: "100%", // Make sure card takes full column width
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                overflow: "hidden", // Prevent content overflow
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: "500", marginBottom: 1, fontSize: "16px" }}
                >
                  {note.name}
                </Typography>
                <Typography sx={{ marginBottom: 2, fontSize: "14px" }}>
                  {note.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {note.date}
                </Typography>
                <Button
                  type="text"
                  size="small"
                  onClick={() => handleEditClick(note)}
                  style={{ minWidth: 0, padding: "4px" }}
                  icon={<EditIcon fontSize="small" />}
                />
              </Box>
            </Box>
          ))}
        </Box>

        <AntdModal
          open={editModalOpen}
          onCancel={() => setEditModalOpen(false)}
          footer={null}
          centered
        >
          <AntdTypography.Title level={5} style={{ marginBottom: 16 }}>
            Edit Note
          </AntdTypography.Title>
          <Input
            placeholder="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ marginBottom: 16 }}
            size="large"
          />
          <AntdTypography.Title level={5} style={{ marginBottom: 16 }}>
            Description
          </AntdTypography.Title>
          <TextArea
            placeholder="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={4}
            style={{ marginBottom: 24 }}
          />
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Button
                type="primary"
                onClick={handleEditSubmit}
                className="form-button"
                style={{
                  padding: "8px 32px",
                  background: colors.blueAccent[1000],
                  color: "#fff",
                  // fontWeight: "600",
                }}
                loading={isLoading}
              >
                Save
              </Button>

            <MuiButton
              variant="outlined"
              color="error"
                onClick={() => setEditModalOpen(false)}
                className="form-button"
                // style={{
                //   padding: "8px 32px",
                //   background: "#475569",
                //   color: "#fff",
                // }}
              >
                Cancel
              </MuiButton>
            </div>
            <MuiButton
              variant="outlined"
              color="error"
              onClick={handleDeleteNote}
              className="form-button"
              // style={{
              //   padding: "8px 32px",
              //   background: "#e53935",
              //   color: "#fff",
              // }}
              loading={isLoading}
              // icon={<DeleteIcon />}
                     startIcon={<DeleteIcon />}
            >
              Delete
            </MuiButton>
          </div>
        </AntdModal>

        <AntdModal
          open={openModal}
          onCancel={handleCloseModal}
          footer={null}
          centered
        >
          <AntdTypography.Title level={5} style={{ marginBottom: 16 }}>
            Enter Name
          </AntdTypography.Title>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: 16 }}
            size="large"
          />
          <AntdTypography.Title level={5} style={{ marginBottom: 16 }}>
            Description
          </AntdTypography.Title>
          <TextArea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ marginBottom: 24 }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="form-button"
              style={{
                padding: "8px 32px",

                background: colors.blueAccent[1000],
                color: "#fff",
                // fontWeight: "600",
              }}
            >
              Submit
            </Button>
            <MuiButton
              variant="outlined"
              color="error"
              onClick={handleCloseModal}
              className="form-button"
              style={{
                // padding: "8px 32px",
                // background: "#475569",
                // color: "#fff",
              }}
            >
              Cancel
            </MuiButton>
          </div>
        </AntdModal>
      </Box>
    </>
  );
};

export default Notes;
