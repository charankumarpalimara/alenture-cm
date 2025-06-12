import { Box, IconButton, Button, InputBase } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const mockDataContacts = [
  { id: 1, key: "#525464", subject: "Quo cupiditate quis dolores.", priority: "Urgent", status: "Pending", date: "3 hours ago", updated: "3 hours ago" },
  { id: 2, key: "#466763", subject: "Et consequatur voluptatem et dolor modi.", priority: "Less Urgent", status: "Waiting for confirmation", date: "3 hours ago", updated: "3 hours ago" },
  { id: 3, key: "#470049", subject: "Dolores est molestias beatae temporibus aspernatur delectus adipisci.", priority: "Urgent", status: "Processing", date: "3 hours ago", updated: "3 hours ago" },
  { id: 4, key: "#606794", subject: "Fuga commodi aut rerum sed modi.", priority: "Generally Urgent", status: "Resolved", date: "3 hours ago", updated: "3 hours ago" },
  { id: 5, key: "#525464", subject: "Quo cupiditate quis dolores.", priority: "Very Urgent", status: "Pending", date: "3 hours ago", updated: "3 hours ago" },
  { id: 6, key: "#466763", subject: "Et consequatur voluptatem et dolor modi.", priority: "Urgent", status: "Waiting for confirmation", date: "3 hours ago", updated: "3 hours ago" },
  { id: 7, key: "#470049", subject: "Dolores est molestias beatae temporibus aspernatur delectus adipisci.", priority: "Urgent", status: "Processing", date: "3 hours ago", updated: "3 hours ago" },
  { id: 8, key: "#606794", subject: "Fuga commodi aut rerum sed modi.", priority: "Generally Urgent", status: "Resolved", date: "3 hours ago", updated: "3 hours ago" },
];

const Crm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "key", headerName: "Key" },
    { field: "subject", headerName: "Subject", flex: 1, cellClassName: "name-column--cell" },
    { field: "priority", headerName: "Priority", headerAlign: "left", align: "left" },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => {
        let color = "";
        switch (params.value) {
          case "Pending":
            color = "red";
            break;
          case "Waiting for confirmation":
            color = "grey"; // You can change this to any suitable color
            break;
          case "Processing":
            color = "#b8860b";
            break;
          case "Resolved":
            color = "green";
            break;
          default:
            color = "black";
        }
        return <span style={{ color, fontWeight: "bold" }}>{params.value}</span>;
      }
    },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "updated", headerName: "Updated", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Your Experiences" subtitle="List of your experiences" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/crmform")}
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: "#fff",
          padding: "10px 20px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          width: { xs: "100%", sm: "auto" },
          marginLeft: { xs: "0", sm: "auto" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#fff",
            color: "#6870fa",
          },
        }}
      >
        + Add New Experience
      </Button>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none", color: "#fff" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
        }}
      >
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <DataGrid rows={mockDataContacts} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Crm;
