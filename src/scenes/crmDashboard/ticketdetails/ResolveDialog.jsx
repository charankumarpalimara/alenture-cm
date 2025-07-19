import React from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ResolveDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <Typography>Are you sure you want to Resolve this experience?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" className="form-button">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained" className="form-button">
        Resolve
      </Button>
    </DialogActions>
  </Dialog>
);

export default ResolveDialog; 