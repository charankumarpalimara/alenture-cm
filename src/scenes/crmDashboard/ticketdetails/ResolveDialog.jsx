import React from "react";
import { Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import { Button } from "antd";
import {Button as MuiButtom} from "@mui/material";

const ResolveDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <Typography>Are you sure you want to Resolve this experience?</Typography>
    </DialogContent>
    <DialogActions>
      <MuiButtom onClick={onClose} variant="outlined" color="error" className="form-button" style={{ marginRight: 8 }}>
        Cancel
      </MuiButtom>
      <Button onClick={onConfirm} type="primary" style={{ backgroundColor: "#af3f3b", borderColor: "#af3f3b" }} className="form-button">
        Resolve
      </Button>
    </DialogActions>
  </Dialog>
);

export default ResolveDialog; 