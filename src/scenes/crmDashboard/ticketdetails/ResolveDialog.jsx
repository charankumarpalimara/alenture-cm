import React from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ResolveDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <Typography>Are you sure you want to Resolve this experience?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Yes, Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default ResolveDialog; 