import React from "react";
import { Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import { Button } from "antd";

const ResolveDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <Typography>Are you sure you want to Resolve this experience?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} className="form-button" style={{ marginRight: 8 }}>
        Cancel
      </Button>
      <Button onClick={onConfirm} type="primary" danger className="form-button">
        Resolve
      </Button>
    </DialogActions>
  </Dialog>
);

export default ResolveDialog; 