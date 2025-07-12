import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
} from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import TablePagination from '@mui/material/TablePagination';
// Columns for DataGrid
const columns = [
  {
    title: "ID",
    dataIndex: "hobid",
    key: "hobid",
    width: 100,
    ellipsis: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
    ellipsis: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Phone",
    dataIndex: "totalNumber",
    key: "totalNumber",
    width: 150,
    ellipsis: true,
  },
  {
    title: "City",
    dataIndex: "city",
    key: "city",
    width: 150,
    ellipsis: true,
  },
];

const Hob = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();

  // State for tickets
  const [originalTickets, setOriginalTickets] = useState([]); // State to store the original data
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");

  // Pagination state
  const [page, setPage] = useState(0); // 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search filter
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredTickets(originalTickets); // Reset to original data when search is cleared
    } else {
      const filtered = originalTickets.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(searchValue) ||
          ticket.email.toLowerCase().includes(searchValue) ||
          ticket.city.toLowerCase().includes(searchValue) ||
          ticket.mobile.toLowerCase().includes(searchValue)
      );
      setFilteredTickets(filtered);
    }
            setPage(0); // Reset to first page on search
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllHob`
          //  `http://127.0.0.1:8080/v1/getAllHob`

        );
        const data = await response.json();
        console.log("API Response:", data); // Log the entire API response
        if (response.ok) {
          if (Array.isArray(data.data)) {
            const transformedData = data.data.map((item) => ({
              key: item.hobid || item.id || Math.random().toString(36),
              hobid: item.hobid || "N/A", // Map hobid to id for unique row identification
              name: `${item.firstname || ""} ${item.lastname || ""}`.trim(),
              firstname: item.firstname || "N/A",
              lastname: item.lastname || "N/A",
              phonecode: item.phonecode || "N/A",
              mobile: item.mobile || "N/A",
              totalNumber: item.phonecode + " " + item.mobile,
              status: item.extraind6 || "N/A",
              email: item.email || "N/A",
              gender: item.extraind2 || "N/A",
              country: item.extraind3 || "N/A",
              state: item.extraind4 || "N/A",
              city: item.extraind5 || "N/A",
              imageUrl: `${item.imageUrl || ""}`,
            }));
            setOriginalTickets(transformedData); // Store the original data
            setFilteredTickets(
              transformedData.filter(
                (item) => (item.status || "").toLowerCase() === "active"
              )
            );
            console.log("Transformed Data:", transformedData); // Log transformed data
          } else {
            console.error("Unexpected data format:", data.data); // Log unexpected format
          }
        } else {
          console.error("Error fetching tickets:", data.error);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const newHob = JSON.parse(event.data);
      console.log("Received WebSocket message:", newHob); // Debugging log

      // Ensure the new row has a unique `id` property and construct the `name` field
      const transformedHob = {
        ...newHob,
        id: newHob.hobid, // Map hobid to id
        name: `${newHob.firstname || ""} ${newHob.lastname || ""}`.trim(), // Construct name
      };

      setOriginalTickets((prev) => [transformedHob, ...prev]);
      setFilteredTickets((prev) => [transformedHob, ...prev]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket closed:", event);
    };

    return () => {
      ws.close(); // Clean up WebSocket connection
    };
  }, []);

  const handleNewTicket = () => {
    Navigate("/hobform");
  };

  const handleRowClick = (record) => {
    Navigate(`/hobdetails/${record.hobid}`);
  };


  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setFilteredTickets(
      originalTickets.filter((item) =>
        status === "Active"
          ? (item.status || "").toLowerCase() === "active"
          : (item.status || "").toLowerCase() === "suspend"
      )
    );
    setPage(0); // Reset to first page on filter change
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginate: Only show current page's data
  const paginatedData = filteredTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box m="10px">
      {/* Toolbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
        flexDirection={isMobile ? "column" : "row"}
      >
        {/* Search Bar */}
        <Box
          display="flex"
          backgroundColor="#ffffff"
          borderRadius="3px"
          flex={1}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          sx={{
            background: colors.blueAccent[1000],
            fontWeight: "600",
            color: "#ffffff",
            whiteSpace: "nowrap",
            textTransform: "none",
          }}
          startIcon={<AddIcon />}
          onClick={handleNewTicket}
        >
          Create New
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "10px",
          mb: "10px",
          justifyContent: "center",
          alignItems: "center",
          // boxShadow: "0 2px 8px rgba(62,67,150,0.10)",
          borderRadius: "12px",
          // p: "10px",
          // background: "#f6f8ff",
          // border: "1px solid #e3e8ff",
        }}
      >
        <Button
          variant={statusFilter === "Active" ? "contained" : "outlined"}
          onClick={() => handleStatusFilter("Active")}
          sx={{
            background:
              statusFilter === "Active"
                ? colors.blueAccent[1000]
                : "#e3e8ff",
            color:
              statusFilter === "Active"
                ? "#ffffff"
                : colors.blueAccent[500],
            borderRadius: "8px",
            boxShadow:
              statusFilter === "Active"
                ? "0 2px 8px rgba(62,67,150,0.10)"
                : "none",
            border: "1px solid #b3c6ff",
            fontWeight: "600",
            minWidth: 120,
          }}
        >
          Active
        </Button>
        <Button
          variant={statusFilter === "Suspend" ? "contained" : "outlined"}
          onClick={() => handleStatusFilter("Suspend")}
          sx={{
            background:
              statusFilter === "Suspend"
                ? colors.blueAccent[1000]
                : "#e3e8ff",
            color:
              statusFilter === "Suspend"
                ? "#ffffff"
                : colors.blueAccent[500],
            borderRadius: "8px",
            boxShadow:
              statusFilter === "Suspend"
                ? "0 2px 8px rgba(62,67,150,0.10)"
                : "none",
            border: "1px solid #b3c6ff",
            fontWeight: "600",
            minWidth: 120,
          }}
        >
          Suspend
        </Button>
      </Box>

      {/* DataGrid */}
      <Box
        sx={{
          margin: "13px 0 0 0",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "100%",
          overflowX: isMobile ? "auto" : "unset", // Enable horizontal scroll on mobile
        }}
      >
     <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
          bordered={false}
          showHeader={true}
          rowClassName={() => "custom-row"}
          className="custom-ant-table-header"
          scroll={isMobile ? { x: 700 } : false} // Force scroll in mobile
        />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
          <TablePagination
            component="div"
            count={filteredTickets.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
            labelRowsPerPage="Rows per page"
            sx={{
              // This will center the content inside the TablePagination root
              ".MuiTablePagination-toolbar": {
                justifyContent: "center",
              }
            }}
          />
        </div>
      </Box>

    </Box>
  );
};
export default Hob;
