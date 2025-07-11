import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
  MenuItem,
  Menu,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ImportExport as ImportExportIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCreaterRole, getCreaterId } from "../../../config";
import { Table } from "antd";

// Columns for DataGrid
const columns = [
  {
    title: "ID",
    dataIndex: "experienceid",
    key: "experienceid",
    width: 100,
    ellipsis: true,
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
    width: 200,
    ellipsis: true,
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
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
  {
    title: "Updated",
    dataIndex: "time",
    key: "time",
    width: 150,
    ellipsis: true,
  },
];

const AllExperiences = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();

  // State for tickets
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    priority: [],
    status: [],
  });

  // Fetch from API on mount
  const fetchTickets = async () => {
    try {
      const role = getCreaterRole();
      let url = "";
      console.log("Current role:", getCreaterRole());
      if (role === "crm") {
        url = `${process.env.REACT_APP_API_URL}/v1/getTicketsbycrmId/${getCreaterId()}`;
      } else if (role === "cm") {
        url = `${process.env.REACT_APP_API_URL}/v1/getTicketsbyCmid/${getCreaterId()}`;
      } else if (role === "hob" || role === "admin") {
        url = `${process.env.REACT_APP_API_URL}/v1/getAllExperiences`;
      } else {
        console.error("Invalid user role");
        return;
      }

      const response = await fetch(url);
      const data = await response.json();

      // FIX: Use data.data instead of data.updatedData
      if (response.ok && Array.isArray(data.data)) {
        const transformedData = data.data.map((item, idx) => ({
          key: item.experienceid || item.id, // Use experienceid or index as key
          id: item.experienceid || idx,
          experienceid: item.experienceid || "N/A",
          experience: item.experience || "N/A",
          experiencedetails: item.experiencedetails || "N/A",
          impact: item.impact || "N/A",
          subject: item.subject || "N/A",
          priority: item.priority || "N/A",
          status: item.status || "N/A",
          date: item.date || "N/A",
          updated: item.updated || "N/A",
          organizationid: item.organizationid,
          organizationname: item.organizationname || "N/A",
          branch: item.branch || "N/A",
          cmid: item.cmid || "N/A",
          crmid: item.extraind1 || "N/A",
          crmname: item.extraind2 || "N/A",
          cmname: item.cmname || "N/A",
          state: item.extraind4 || "N/A",
          city: item.extraind5 || "N/A",
          postalcode: item.extraind6 || "N/A",
          time: item.time || "N/A",
          imageUrl: `${item.imageUrl || ""}`,
        }));
        const uniqueData = [];
        const seen = new Set();
        for (const row of transformedData) {
          if (!seen.has(row.experienceid)) {
            uniqueData.push(row);
            seen.add(row.experienceid);
          }
        }

        setTickets(uniqueData);
        setFilteredTickets(uniqueData);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  React.useEffect(() => {
    fetchTickets();
  }, []);

  // Live update: refetch tickets on relevant notification
  React.useEffect(() => {
    const WS_URL = process.env.REACT_APP_WS_URL || "ws://161.35.54.196:8080";
    const ws = new window.WebSocket(WS_URL);
    ws.onmessage = (event) => {
      try {
        if (getCreaterRole() === "crm") {
          const data = JSON.parse(event.data);
          if (data.type === "notification" && data.crmid === getCreaterId()) {
            // Refetch tickets for this CRM
            fetchTickets();
          }
        }
      } catch (e) { }
    };
    return () => ws.close();
  }, []);

  // Search filter
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    applyFilters(event.target.value, selectedFilters);
  };

  // Open & Close Filter Menu
  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  // Handle Filter Selection
  const handleFilterSelect = (filterType, value) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      updatedFilters[filterType] = updatedFilters[filterType].includes(value)
        ? updatedFilters[filterType].filter((item) => item !== value)
        : [...updatedFilters[filterType], value];
      applyFilters(searchTerm, updatedFilters);
      return updatedFilters;
    });
  };

  // Apply Filters
  const applyFilters = (search, filters) => {
    let filtered = tickets;
    if (search.trim()) {
      filtered = filtered.filter((ticket) =>
        Object.values(ticket).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    if (filters.priority.length) {
      filtered = filtered.filter((ticket) =>
        filters.priority.includes(ticket.priority)
      );
    }
    if (filters.status.length) {
      filtered = filtered.filter((ticket) =>
        filters.status.includes(ticket.status)
      );
    }
    setFilteredTickets(filtered);
  };

  // const handleNewTicket = () => {
  //   Navigate('/crmform')
  // };
  // Get Unique Values for Filters
  const getUniqueValues = (key) => [
    ...new Set(tickets.map((ticket) => ticket[key])),
  ];

  const handleNewTicket = () => {
    Navigate('/experienceRegistrationform')
  };



  const handleRowClick = (record) => {
    if (getCreaterRole() === "cm") {
      Navigate(`/ticketdetails/${record.experienceid}`);
    } else {
      Navigate("/ticketdetails", { state: { ticket: record } });
    }
  }

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

        {/* Export Button */}
        <Button
          sx={{
            background: colors.blueAccent[1000],
            color: "#ffffff",
            whiteSpace: "nowrap",
            fontWeight: "600",
            textTransform: "none",
          }}
          variant="contained"
          startIcon={<ImportExportIcon />}
          onClick={() => alert("Export Data!")}
        >
          Export
        </Button>

        {/* Filter Button */}
        <Button
          sx={{
            background: colors.blueAccent[1000],
            color: "#ffffff",
            whiteSpace: "nowrap",
            fontWeight: "600",
            textTransform: "none",
          }}
          variant="contained"
          startIcon={<FilterIcon />}
          onClick={handleFilterClick}
        >
          Filter
        </Button>

        {getCreaterRole() === "cm" && (
          <Button
            variant="contained"
            sx={{
              background: colors.blueAccent[1000],
              fontWeight: "600",
              color: "#ffffff",
              whiteSpace: "nowrap",
              // paddingX: "15px"
              // padding: "12px 18px ",
              // fontSize: "14px",
              textTransform: "none"
            }}
            startIcon={<AddIcon />}
            onClick={handleNewTicket}
          >
            New Experience
          </Button>
        )}

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <Box p={2}>
            <Typography variant="h6">Priority</Typography>
            {getUniqueValues("priority").map((priority) => (
              <MenuItem key={priority}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFilters.priority.includes(priority)}
                      onChange={() => handleFilterSelect("priority", priority)}
                    />
                  }
                  label={priority}
                />
              </MenuItem>
            ))}
          </Box>

          <Box p={2}>
            <Typography variant="h6">Status</Typography>
            {getUniqueValues("status").map((status) => (
              <MenuItem key={status}>
                <FormControlLabel
                  sx={{ backgroundColor: "#ffffff" }}
                  control={
                    <Checkbox
                      checked={selectedFilters.status.includes(status)}
                      onChange={() => handleFilterSelect("status", status)}
                    />
                  }
                  label={status}
                />
              </MenuItem>
            ))}
          </Box>
        </Menu>

        {/* <Button
          variant="contained"
          sx={{
            background: colors.blueAccent[500],
            fontWeight: "bold",
            color: "#ffffff",
            whiteSpace: "nowrap",
            // paddingX: "15px"
            // padding: "12px 18px ",
            // fontSize: "14px",
            textTransform: "none"
          }}
          startIcon={<AddIcon />}
          onClick={handleNewTicket}
        >
          New Experience
        </Button> */}
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
    </Box>
  );
};

export default AllExperiences;
