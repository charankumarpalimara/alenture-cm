import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCreaterRole } from "../../../config";
import { Table } from "antd";
import CustomTablePagination from '../../../components/CustomPagination';
// import { Country } from "country-state-city";

// const initialTickets = [
//   { id: 1, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Wipro" },
//   { id: 2, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Infosys" },
//   { id: 3, name: "Rambabu bade", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "TCS" },
//   { id: 4, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "HCL" },
//   { id: 5, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Tech Mahindra" },
//   { id: 6, name: "John Doe", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", Organization: "HCL" },
//   { id: 7, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Infosys" },
//   { id: 8, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Wipro" },
//   { id: 9, name: "John Doe", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "TCS" },
// ];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    ellipsis: true,
  },
  {
    title: "Organization",
    dataIndex: "name",
    key: "name",
    width: 200,
    ellipsis: true,
  },
  {
    title: "Phone",
    dataIndex: "mobile",
    key: "mobile",
    width: 150,
    ellipsis: true,
  },
  {
    title: "City",
    dataIndex: "district",
    key: "district",
    width: 150,
    ellipsis: true,
  },
  // {
  //   title: "Branch Type",
  //   dataIndex: "branchtype",
  //   key: "branchtype",
  //   width: 150,
  //   ellipsis: true,
  // },
];

const AdminANDHobOrganization = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();
  const [originalTickets, setOriginalTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0); // 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredTickets(originalTickets); // Reset to original data when search is cleared
    } else {
      const filtered = originalTickets.filter(
        (ticket) =>
          (ticket.id || "").toLowerCase().includes(searchValue) ||
          (ticket.name || "").toLowerCase().includes(searchValue) ||
          (ticket.city || "").toLowerCase().includes(searchValue) ||
          (ticket.mobile || "").toLowerCase().includes(searchValue)
      );
      setFilteredTickets(filtered);
    }
    setPage(0); // Reset to first page on search
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllOrgs`
        );
        const data = await response.json();
        console.log("API Response:", data);
        if (response.ok) {
          if (Array.isArray(data.data)) {
            const transformedData = data.data.map((item) => ({
              key: item.organizationid || item.id || "N/A",
              id: item.organizationid || "N/A",
              name: item.organizationname || "N/A",
              phonenocode: item.phonecode || "N/A",
              branchtype: item.branchtype || "N/A",
              brachname: item.branch || "N/A",
              phonecode: item.phonecode || "N/A",
              mobile: item.mobile || "N/A",
              email: item.email || "N/A",
              country: item.country || "N/A",
              state: item.state || "N/A",
              address: item.address || "N/A",
              postalcode: item.postalcode || "N/A",
              district: item.district || "N/A",
            }));
            setOriginalTickets(transformedData);
            setFilteredTickets(transformedData);
            console.log("Transformed Data:", transformedData);
          } else {
            console.error("Unexpected data format:", data.data);
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
      const newOrg = JSON.parse(event.data);
      console.log("Received WebSocket message:", newOrg);

      const transformedOrg = {
        id: newOrg.organizationid || "N/A",
        name: newOrg.organizationname || "N/A",
        phonenocode: newOrg.phonecode || "N/A",
        mobile: newOrg.mobile || "N/A",
        email: newOrg.email || "N/A",
        district: newOrg.district || "N/A",
      };

      setOriginalTickets((prev) => [transformedOrg, ...prev]);
      setFilteredTickets((prev) => [transformedOrg, ...prev]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket closed:", event);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleNewTicket = () => {
    Navigate("/organizationform");
  };

  const handleRowClick = (record) => {
    Navigate("/organizationdetails", { state: { ticket: record } });
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
        flexDirection={isMobile ? "column" : "row"}
      >
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
        {(getCreaterRole() === "admin" || getCreaterRole() === "hob") && (
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
        )}
      </Box>
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
export default AdminANDHobOrganization;
