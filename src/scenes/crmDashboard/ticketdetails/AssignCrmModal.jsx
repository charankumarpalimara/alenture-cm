import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import AssignCrmForm from "./AssignCrmForm";

const AssignCrmModal = ({ open, onClose, crmNameList, experienceid, existcrmid }) => {
  const assignmodel = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="task-modal-title"
      aria-describedby="task-modal-description"
    >
      <Box sx={assignmodel}>
        <Typography
          id="task-modal-title"
              className="custom-headding-16px"
              sx={{ marginBottom: 5 }}
        >
          Assign To Relationship Manager
        </Typography>
        <AssignCrmForm
          crmNameList={crmNameList}
          onClose={onClose}
          experienceid={experienceid}
          existcrmid={existcrmid}
        />
      </Box>
    </Modal>
  );
};

export default AssignCrmModal; 