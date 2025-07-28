import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <Typography
            id="task-modal-title"
            className="custom-headding-16px"
          >
            Assign To Relationship Manager
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#666",
              "&:hover": {
                color: "#333",
                backgroundColor: "#f5f5f5",
              },
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
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