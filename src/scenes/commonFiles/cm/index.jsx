import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../../theme";
import {
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import "antd/dist/reset.css"; // Ant Design resets

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
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
    dataIndex: "contact",
    key: "contact",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Created",
    dataIndex: "date",
    key: "date",
    width: 150,
    ellipsis: true,
  },
];

const Cm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();
  const [originalTickets, setOriginalTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");

  // Search filter
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredTickets(originalTickets);
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
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllCm`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          const transformedData = data.data.map((item) => ({
            key: item.cmid || "N/A",
            id: item.cmid || "N/A",
            name: `${item.firstname || ""} ${item.lastname || ""}`.trim(),
            firstname: item.firstname || "N/A",
            lastname: item.lastname || "N/A",
            phonecode: item.phonecode || "N/A",
            mobile: item.mobile || "N/A",
            contact: item.phonecode + " " + item.mobile || "N/A",
            email: item.email || "N/A",
            organizationid: item.organizationid || "N/A",
            organizationname: item.organizationname || "N/A",
            branch: item.branch || "N/A",
            crmid: item.crmid || "N/A",
            crmname: item.crmname || "N/A",
            gender: item.extraind2 || "N/A",
            status: item.extraind3 || "N/A",
            state: item.extraind4 || "N/A",
            city: item.extraind5 || "N/A",
            creater: item.adminid
              ? item.createrrole + item.createrid
              : item.hobid
                ? item.createrrole + item.createrid
                : item.crmid
                  ? item.createrrole + item.createrid
                  : item.createrrole,
            postalcode: item.extraind6 || "N/A",
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
        const transformedCrm = {
          ...newCrm,
          key: newCrm.cmid,
          id: newCrm.cmid,
          name: `${newCrm.firstname || ""} ${newCrm.lastname || ""}`.trim(),
        };

        setOriginalTickets((prev) => [transformedCrm, ...prev]);
        setFilteredTickets((prev) => [transformedCrm, ...prev]);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.warn("WebSocket closed. Reconnecting in 5 seconds...", event);
        setTimeout(connectWebSocket, 5000);
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      ws.close();
    };
  }, []);

  const handleNewTicket = () => {
    Navigate("/cmform");
  };

  const handleRowClick = (record) => {
    Navigate(`/cmdetails/${record.id}`);
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
  };

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
          sx={{background: colors.blueAccent[1000], color: "#ffffff", fontWeight: "600"}}
          startIcon={<AddIcon />}
          onClick={handleNewTicket}
        >
          Create New
        </Button>
      </Box>

      {/* Status Filter Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          mb: "10px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "12px",
        }}
      >
        <Button
          variant={statusFilter === "Active" ? "contained" : "outlined"}
          onClick={() => handleStatusFilter("Active")}
          sx={{
          background: statusFilter === "Active"
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
            background: statusFilter === "Suspend"
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

      {/* Table */}
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
          dataSource={filteredTickets}
          columns={columns}
          pagination={{
            pageSize: 10,          // Always show 10 rows per page
            showSizeChanger: false, // Remove the option to change page size
            position: ["bottomCenter"],
          }}
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
      </Box>

      {/* Custom styles for removing header divider */}
    </Box>
  );
};
export default Cm;