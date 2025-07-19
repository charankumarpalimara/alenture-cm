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
import CustomTablePagination from '../../../components/CustomPagination';
// import { date } from "yup";

// Columns for DataGrid
const columns = [
  { title: "ID", dataIndex: "experienceid", key: "experienceid", width: 100, ellipsis: true },
  { title: "Subject", dataIndex: "subject", key: "subject", width: 200, ellipsis: true },
  { title: "Priority", dataIndex: "priority", key: "priority", width: 150, ellipsis: true },
  { title: "Status", dataIndex: "status", key: "status", width: 150, ellipsis: true },
  { title: "Created", dataIndex: "date", key: "date", width: 150, ellipsis: true },
  { title: "Updated", dataIndex: "time", key: "time", width: 150, ellipsis: true },
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

  // Pagination state
  const [page, setPage] = useState(0); // 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch from API on mount
  const fetchTickets = async () => {
    try {
      const role = getCreaterRole();
      let url = "";
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
          key: item.experienceid || item.id,
          id: item.experienceid || idx,
          experienceid: item.experienceid || "N/A",
          experience: item.experience || "N/A",
          experiencedetails: item.experiencedetails || "N/A",
          impact: item.impact || "N/A",
          subject: item.subject || "N/A",
          priority: item.priority || "N/A",
          status: item.status || "N/A",
          updated: item.updated || "N/A",
          organizationid: item.organizationid,
          organizationname: item.organizationname || "N/A",
          branch: item.branch || "N/A",
          cmid: item.cmid || "N/A",
          crmid: item.extraind1 || "N/A",
          crmname: item.extraind2 || "N/A",
          cmname: item.cmname || "N/A",
          time: item.time || "N/A",
          date: item.date || "N/A",
          processtime: item.extraind3 || "N/A",
          processdate: item.extraind4 || "N/A",
          resolvedtime: item.extraind5 || "N/A",
          resolveddate: item.extraind6 || "N/A",
          filename : item.filename || "N/A",
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
    setPage(0); // Reset to first page on search
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
    setPage(0); // Reset to first page on filter change
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

  // Get Unique Values for Filters
  const getUniqueValues = (key) => [
    ...new Set(tickets.map((ticket) => ticket[key])),
  ];

  const handleNewTicket = () => {
    Navigate('/experienceRegistrationform')
  };


  // Only display rows for the current page
  const paginatedData = filteredTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleRowClick = (record) => {
    if (getCreaterRole() === "cm" || getCreaterRole() === "crm" ) {
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
            textTransform: "none",
          }}
          variant="contained"
          startIcon={<ImportExportIcon />}
          onClick={() => alert("Export Data!")}
          className="form-button"
        >
          Export
        </Button>

        {/* Filter Button */}
        <Button
          sx={{
            background: colors.blueAccent[1000],
            color: "#ffffff",
            whiteSpace: "nowrap",
            textTransform: "none",
          }}
          variant="contained"
          startIcon={<FilterIcon />}
          onClick={handleFilterClick}
          className="form-button"
        >
          Filter
        </Button>

        {getCreaterRole() === "cm" && (
          <Button
            variant="contained"
            sx={{
              background: colors.blueAccent[1000],
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none"
            }}
            startIcon={<AddIcon />}
            onClick={handleNewTicket}
            className="form-button"
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
      </Box>

      {/* Table and Pagination */}
      <Box
        sx={{
          margin: "13px 0 0 0",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "100%",
          overflowX: isMobile ? "auto" : "unset",
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
          scroll={isMobile ? { x: 700 } : false}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "10px" }}>
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

export default AllExperiences;