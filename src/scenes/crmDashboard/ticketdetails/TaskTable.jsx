import React from "react";
import { Box, IconButton } from "@mui/material";
import { Table } from "antd";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskTable = ({ columns, data, onCompleteTask, onDeleteTask }) => {
  // Clone columns to inject action handlers
  const tableColumns = columns.map(col => {
    if (col.key === "actions") {
      return {
        ...col,
        render: (_text, record) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={onCompleteTask(record.id)}
              sx={{ color: "#ffffff", backgroundColor: "#0BDA51", width: "30px", height: "30px" }}
              aria-label="complete"
              disableRipple
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              onClick={onDeleteTask(record.id)}
              sx={{ color: "#ffffff", backgroundColor: "#FF2C2C", width: "30px", height: "30px" }}
              disableRipple
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )
      };
    }
    return col;
  });

  return (
    <Table
      columns={tableColumns}
      dataSource={data}
      rowKey={record => record.id}
      pagination={false}
    />
  );
};

export default React.memo(TaskTable); 