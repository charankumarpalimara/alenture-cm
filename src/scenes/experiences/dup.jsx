import React, { useState, useEffect } from "react";
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
import { tokens } from "../../theme";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ImportExport as ImportExportIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Initial ticket data
// const initialTickets = [
//   { id: 1, subject: "Issue A Issue A  Issue A Issue A", priority: "High", status: "Open", date: "2024-03-19", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan", department:"technical", experience : "Extremely Frustrated", organization: "Wipro", requestdetails:"revenue department having issue please , solve that issue" },
//   { id: 2, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", time: "23:15:00" , updated: "2 hours ago",cmname: "satya", crmname:"charan",  department:"technical", experience : "Frustrated", organization: "Infosys", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 3, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan",  department:"technical", experience : "Happy", organization: "TCS", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 4, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", time: "23:15:00" , updated: "2 hours ago",cmname: "satya", crmname:"charan",  department:"technical", experience : "Extremely Happy", organization: "HCL", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 5, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", time: "23:15:00" , updated: "2 hours ago",cmname: "satya", crmname:"charan",  department:"technical", experience : "Extremely Frustrated", organization: "Tech Mahindra", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 6, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", time: "23:15:00" , updated: "2 hours ago",cmname: "satya", crmname:"charan",  department:"technical", experience : "Extremely Frustrated", organization: "Tech Mahindra", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 7, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", time: "23:15:00" , updated: "2 hours ago",cmname: "satya", crmname:"charan",  department:"technical", experience : "Happy", organization: "HCL", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 8, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", time: "23:15:00" , updated: "2 hours ago",cmname: "satya", crmname:"charan",  department:"technical", experience : "Extremely Frustrated", organization: "Infosys", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 9, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan",  department:"technical" , experience :  "Extremely Happy", organization: "Wipro", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 10, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan",  department:"technical" , experience : "Happy", organization: "Infosys", requestdetails:"revenue department having issue please , solve that issue"   },
//   { id: 11, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan",  department:"technical", experience : "Extremely Frustrated", organization: "TCS", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 12, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan",  department:"technical", experience : "Happy", organization: "Tech Mahindra" , requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 13, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan",  department:"technical", experience : "Extremely Frustrated", organization: "HCL", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 14, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan",  department:"technical", experience : "Extremely Happy", organization: "Wipro", requestdetails:"revenue department having issue please , solve that issue"  },
//   { id: 15, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", time: "23:15:00" , updated: "2 hours ago", cmname: "satya", crmname:"charan",  department:"technical", experience : "Extremely Happy", organization: "TCS", requestdetails:"revenue department having issue please , solve that issue"  },
// ];


// Columns for DataGrid
const columns = [
  { field: "experienceid", headerName: "ID", flex: 0.4, headerClassName: "bold-header", disableColumnMenu: false, minWidth: 100 },
  { field: "subject", headerName: "Subject", flex: 2, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 200 },
  { field: "priority", headerName: "Priority", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
  { field: "status", headerName: "Status", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
  { field: "date", headerName: "Created", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
  // { field: "updated", headerName: "Updated", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
];

const AllExperiences = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();

  // State for tickets
  // const [tickets] = useState(initialTickets); // Removed setTickets since it's unused
  // const [filteredTickets, setFilteredTickets] = useState(initialTickets);
  const [originalTickets, setOriginalTickets] = useState([]); // State to store the original data
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Search filter
  // const handleSearchChange = (event) => {
  //   const searchValue = event.target.value.toLowerCase();
  //   setSearchTerm(searchValue);

  //   if (searchValue === "") {
  //     setFilteredTickets(originalTickets); // Reset to original data when search is cleared
  //   } else {
  //     const filtered = originalTickets.filter(ticket =>
  //       (ticket.experienceid && String(ticket.experienceid).toLowerCase().includes(searchValue)) ||
  //       (ticket.subject && ticket.subject.toLowerCase().includes(searchValue)) ||
  //       (ticket.status && ticket.status.toLowerCase().includes(searchValue)) ||
  //       (ticket.date && ticket.date.toLowerCase().includes(searchValue))
  //     );
  //     setFilteredTickets(filtered);
  //   }
  // };

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({ priority: [], status: [] });


   const userDetails = JSON.parse(sessionStorage.getItem('userDetails')) || {}; // Retrieve user details from sessionStorage
   const cmid = userDetails.cmid; // Construct username or fallback to 'Guest'

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/getTicketsbycmId/${cmid}`);
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          const transformedData = data.data.map(item => ({
            experienceid: item.experienceid || "N/A",
            subject: item.subject || "N/A",
            priority: item.priority || "N/A", // Add priority from backend
            status: item.extraind7 || item.status || "N/A", // Use extraind7 or status
            date: item.date || "N/A",
            organizationid: item.organizationid ,
            organizationname: item.organizationname || "N/A",
            branch: item.branch || "N/A",
            crmname: item.crmname || "N/A",
            cmname: item.cmname || "N/A",
            state: item.extraind4 || "N/A",
            city: item.extraind5 || "N/A",
            postalcode: item.extraind6 || "N/A",
            time: item.time || "N/A",
            imageUrl: `${item.imageUrl || ""}`,
          }));
          setOriginalTickets(transformedData);
          setFilteredTickets(transformedData);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [cmid]);

  // Get Unique Values for Filters
  const getUniqueValues = (key) => [...new Set(originalTickets.map((ticket) => ticket[key]).filter(Boolean))];

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

  // Apply Filters (updated to use all relevant fields for search and filter)
  const applyFilters = (search, filters) => {
    let filtered = originalTickets;
    if (search.trim()) {
      filtered = filtered.filter((ticket) =>
        (ticket.experienceid && String(ticket.experienceid).toLowerCase().includes(search.toLowerCase())) ||
        (ticket.subject && ticket.subject.toLowerCase().includes(search.toLowerCase())) ||
        (ticket.status && ticket.status.toLowerCase().includes(search.toLowerCase())) ||
        (ticket.date && ticket.date.toLowerCase().includes(search.toLowerCase())) ||
        (ticket.priority && ticket.priority.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (filters.priority.length) {
      filtered = filtered.filter((ticket) => filters.priority.includes(ticket.priority));
    }
    if (filters.status.length) {
      filtered = filtered.filter((ticket) => filters.status.includes(ticket.status));
    }
    setFilteredTickets(filtered);
  };

  const handleNewTicket = () => {
    Navigate('/cmform')
  };

  const handleRowClick = (params) => {
    Navigate('/ticketdetails', { state: { ticket: params.row } });
  };

  // Update search to use applyFilters
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    applyFilters(searchValue, selectedFilters);
  };

  // Open & Close Filter Menu
  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  return (
    <Box m="20px">
      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2} flexDirection={isMobile ? "column" : "row"}>
        {/* Search Bar */}
        <Box display="flex" backgroundColor="#ffffff" borderRadius="3px" flex={1}>
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Export Button */}
        <Button
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: "#ffffff",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            textTransform: "none"
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
            backgroundColor: colors.blueAccent[500],
            color: "#ffffff",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            textTransform: "none"
          }}
          variant="contained"
          startIcon={<FilterIcon />}
          onClick={handleFilterClick}
        >
          Filter
        </Button>

        {/* Filter Menu */}
        <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
          <Box p={2}>
            <Typography variant="h6">Priority</Typography>
            {getUniqueValues("priority").map((priority) => (
              <MenuItem key={priority}>
                <FormControlLabel
                  control={<Checkbox checked={selectedFilters.priority.includes(priority)} onChange={() => handleFilterSelect("priority", priority)} />}
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
                  control={<Checkbox checked={selectedFilters.status.includes(status)} onChange={() => handleFilterSelect("status", status)} />}
                  label={status}
                />
              </MenuItem>
            ))}
          </Box>
        </Menu>
        <Button
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
        </Button>
      </Box>

      {/* DataGrid */}
      <Box height="70vh" width="100%" minWidth={600}
        m="13px 0 0 0"
        sx={{
          minWidth: 600,
          width: "100%",
          // "& .MuiDataGrid-root": {
          //   border: "none",
          //   overflowX: "auto", // Enable horizontal scrolling
          // },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: "16px",
            whiteSpace: "nowrap", // Prevent text wrapping
            overflow: "visible", // Prevent text truncation
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none", // Remove the border below the header
            fontWeight: "bold !important",
            fontSize: "16px !important",
            color: "#ffffff",
          },
          // "& .MuiDataGrid-root::-webkit-scrollbar-thumb":{
          //    width: "2px !important",
          //    height: "6px !important"
          //  },
          // "& .MuiDataGrid-columnSeparator": {
          //   display: "none", // Hide the column separator
          // },
          "& .MuiDataGrid-columnSeparator": {
            display: "none", // Hide the column separator
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important", // Ensure header text is bold
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-root::-webkit-scrollbar": {
            display: "none !important",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            display: "none !important",
          },
          "& .MuiDataGrid-root": {
            // scrollbarWidth: "none", // Hides scrollbar in Firefox
          },
          "& .MuiDataGrid-row": {
            borderBottom: `0.5px solid ${colors.grey[300]}`, // Add border to the bottom of each row
            "&:hover": {
              cursor: "pointer",
              backgroundColor:"#D9EAFD"
            },
          },
          "& .MuiTablePagination-root": {
            color: "#ffffff !important", // Ensure pagination text is white
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
            color: "#ffffff !important", // Ensure select label and input text are white
          },
          "& .MuiTablePagination-displayedRows": {
            color: "#ffffff !important", // Ensure displayed rows text is white
          },
          "& .MuiSvgIcon-root": {
            color: "#ffffff !important", // Ensure pagination icons are white
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            color: "#ffffff",
          },
        }}>
        <DataGrid
          rows={filteredTickets.map((row, idx) => ({ id: row.experienceid && row.experienceid !== 'N/A' ? row.experienceid : `row-${idx}`, ...row }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowClick={handleRowClick}
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "16px",
              whiteSpace: "nowrap", // Prevent text wrapping
              overflow: "visible", // Prevent text truncation
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none", // Remove the border below the header
              fontWeight: "bold !important",
              fontSize: "16px !important",
              color: "#ffffff",
            },
            // "& .MuiDataGrid-root::-webkit-scrollbar-thumb":{
            //    width: "2px !important",
            //    height: "6px !important"
            //  },
            "& .MuiDataGrid-columnSeparator": {
              display: "none", // Hide the column separator
            },
            // "& .MuiDataGrid-root::-webkit-scrollbar": {
            //   display: "none", // Hides scrollbar in Chrome, Safari
            // },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold !important", // Ensure header text is bold
            },
            // "& .MuiDataGrid-virtualScroller": {
            //   backgroundColor: "#ffffff",
            // },
            "& .MuiDataGrid-root::-webkit-scrollbar": {
              display: "none !important",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
              display: "none !important",
            },
            "& .MuiDataGrid-root": {
              // scrollbarWidth: "none !important", // Hides scrollbar in Firefox
            },
            "& .MuiDataGrid-virtualScroller": {
              // scrollbarWidth: "none !important",
              backgroundColor: "#ffffff",
            },
            "& .MuiDataGrid-row": {
              borderBottom: `0.5px solid ${colors.grey[300]}`, // Add border to the bottom of each row
              "&:hover": {
                cursor: "pointer",
                backgroundColor:"#D9EAFD"
              },
            },
            "& .MuiTablePagination-root": {
              color: "#ffffff !important", // Ensure pagination text is white
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
              color: "#ffffff !important", // Ensure select label and input text are white
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#ffffff !important", // Ensure displayed rows text is white
            },
            "& .MuiSvgIcon-root": {
              color: "#ffffff !important", // Ensure pagination icons are white
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
              color: "#ffffff",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AllExperiences;
