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
import {
  Search as SearchIcon,
  Add as AddIcon,
  // PostAdd,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import "antd/dist/reset.css"; // Ant Design resets
// import { first } from "lodash";
import CustomTablePagination from '../../../components/CustomPagination';

// Columns for DataGrid
const columns = [
  {
    title: "ID",
    dataIndex: "crmid",
    key: "crmid",
    width: 100,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 150,
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    key: "mobile",
    width: 150,
  },
  {
    title: "City",
    dataIndex: "city",
    key: "city",
    width: 150,
  },
  {
    title: "Created",
    dataIndex: "date",
    key: "date",
    width: 150,
  },
];

const Crm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();
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
          `${process.env.REACT_APP_API_URL}/v1/getAllCrm`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          const transformedData = data.data.map((item) => ({
            key: item.crmid || item.id || Math.random().toString(36), // fallback for key
            // ...rest of your mapping
            crmid: item.crmid || "N/A",
            name: `${item.firstname || ""} ${item.lastname || ""}`.trim(),
            firstname: item.firstname || "N/A",
            lastname: item.lastname || "N/A",
            phonecode: item.phonecode || "N/A",
            mobile: item.mobile || "N/A",
            email: item.email || "N/A",
            gender: item.extraind2 || "N/A",
            country: item.extraind3 || "N/A",
            state: item.extraind4 || "N/A",
            city: item.extraind5 || "N/A",
            postalcode: item.extraind6 || "N/A",
            status: item.extraind7 || "N/A",
            date: item.date || "N/A",
            time: item.time || "N/A",
            imageUrl: `${item.imageUrl || ""}`,
          }));
          setOriginalTickets(transformedData);
          setFilteredTickets(
            transformedData.filter(
              (item) => (item.status || "").toLowerCase() === "active"
            )
          );
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();

    const connectWebSocket = () => {
      const ws = new WebSocket(process.env.REACT_APP_WS_URL);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const newCrm = JSON.parse(event.data);
        console.log("Received WebSocket message:", newCrm); // Debugging log

        // Ensure the new row has a unique `id` property and construct the `name` field
        const transformedCrm = {
          ...newCrm,
          crmid: newCrm.crmid, // Map crmid to id
          name: `${newCrm.firstname || ""} ${newCrm.lastname || ""}`.trim(), // Construct name
        };

        setOriginalTickets((prev) => [transformedCrm, ...prev]);
        setFilteredTickets((prev) => [transformedCrm, ...prev]);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.warn("WebSocket closed. Reconnecting in 5 seconds...", event);
        setTimeout(connectWebSocket, 5000); // Attempt reconnection after 5 seconds
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      ws.close(); // Clean up WebSocket connection
    };
  }, []);

  const handleNewTicket = () => {
    Navigate("/crmform");
  };

  const handleRowClick = (record) => {
    Navigate(`/crmdetails/${record.crmid}`);
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
        // setPage(0); // Reset to first page on filter change
  };


  //   const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

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
          className="form-button"
          sx={{
            background: colors.blueAccent[1000],
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
                className="form-button"
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
            minWidth: 120,
          }}
        >
          Active
        </Button>
        <Button
          className="form-button"
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
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "20px" }}>
          <CustomTablePagination
            count={filteredTickets.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={newPage => setPage(newPage)}
            onRowsPerPageChange={newRpp => {
              setRowsPerPage(newRpp);
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </Box>

    </Box>
  );
};

export default Crm;
