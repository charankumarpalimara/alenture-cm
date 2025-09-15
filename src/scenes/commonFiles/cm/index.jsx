import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { tokens } from "../../../theme";
import {
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Table, Input, Button } from "antd";
import "antd/dist/reset.css";
// import TablePagination from '@mui/material/TablePagination';
import CustomTablePagination from '../../../components/CustomPagination';

const columns = [
  { title: "ID", dataIndex: "id", key: "id", width: 100, ellipsis: true },
  { title: "Name", dataIndex: "name", key: "name", width: 200, ellipsis: true },
  { title: "Email", dataIndex: "email", key: "email", width: 150, ellipsis: true },
  { title: "Phone", dataIndex: "contact", key: "contact", width: 150, ellipsis: true },
  { title: "Created", dataIndex: "date", key: "date", width: 150, ellipsis: true },
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

  // Pagination state
  const [page, setPage] = useState(0); // 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for status filter menu
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);

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
    setPage(0); // Reset to first page on search
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
    setPage(0); // Reset to first page on filter change
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
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            prefix={<SearchIcon style={{ color: "rgba(0,0,0,.25)" }} />}
            style={{
              height: "34px",
              borderRadius: "3px",
              border: "none",
              boxShadow: "none",
            }}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            style={{
              background: colors.blueAccent[1000],
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none",
              minWidth: isMobile ? 120 : "",
            }}
            type="primary"
            icon={<ToggleOnIcon />}
            onClick={e => setStatusMenuAnchor(e.currentTarget)}
            className="form-button"
          >
            Status
          </Button>
          <Menu
            anchorEl={statusMenuAnchor}
            open={Boolean(statusMenuAnchor)}
            onClose={() => setStatusMenuAnchor(null)}
            PaperProps={{
              sx: {
                borderRadius: 2.5,
                minWidth: 160,
                boxShadow: '0 4px 24px 0 rgba(62,67,150,0.10)',
                p: 0.5,
                mt: 1,
              }
            }}
            MenuListProps={{
              sx: {
                p: 0,
              }
            }}
          >
            <MenuItem
              selected={statusFilter === "Active"}
              onClick={() => {
                handleStatusFilter("Active");
                setStatusMenuAnchor(null);
              }}
              sx={{
                fontWeight: 500,
                fontSize: 15,
                borderRadius: 1.5,
                m: 0.5,
                backgroundColor: statusFilter === "Active" ? colors.blueAccent[100] : 'transparent',
                '&:hover': {
                  backgroundColor: colors.blueAccent[50],
                },
              }}
            >
              Active
            </MenuItem>
            <MenuItem
              selected={statusFilter === "Suspend"}
              onClick={() => {
                handleStatusFilter("Suspend");
                setStatusMenuAnchor(null);
              }}
              sx={{
                fontWeight: 500,
                fontSize: 15,
                borderRadius: 1.5,
                m: 0.5,
                backgroundColor: statusFilter === "Suspend" ? colors.blueAccent[100] : 'transparent',
                '&:hover': {
                  backgroundColor: colors.blueAccent[50],
                },
              }}
            >
              Suspend
            </MenuItem>
          </Menu>
        </Box>
        <Button
          type="primary"
          icon={<AddIcon />}
          onClick={() => Navigate("/cmform")}
          className="form-button"
          style={{
            background: colors.blueAccent[1000],
            borderColor: colors.blueAccent[1000],
            color: "#fff",
            minWidth: 120,
          }}
        >
          Create New
        </Button>
        {/* <Button
          type="primary"
          onClick={() => Navigate("/cmdetails")}
          className="form-button"
          style={{
            background: colors.blueAccent[1000],
            borderColor: colors.blueAccent[1000],
            color: "#fff",
            minWidth: 120,
          }}
        >
          View Details
        </Button> */}
      </Box>



      {/* Status Filter Button with Popup Menu */}


      {/* <Button
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
              </Button> */}

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

export default Cm;