import React, { useEffect, useState } from 'react';
import './DataTable.css';
import Box from '@mui/material/Box';
import { Button, Checkbox, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination } from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import axios from 'axios';
import EditDialog from './EditDialog';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedRowData, setEditedRowData] = useState(null);

  // Function to open the edit dialog
  const handleEdit = (rowID) => {
    const rowToEdit = data.find((row) => row.id === rowID);
    setEditedRowData(rowToEdit);
    setIsEditDialogOpen(true);
  };

  // Function to save the edited data
  const saveEditedData = () => {
    // Update the data state with the edited data
    if (editedRowData) {
      setData((prevData) =>
        prevData.map((row) =>
          row.id === editedRowData.id ? { ...row, ...editedRowData } : row
        )
      );
    }
    setIsEditDialogOpen(false);
    setEditedRowData(null);
  };

  // Function to close the edit dialog without saving
  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditedRowData(null);
  };

  const columns = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 250,
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 250,
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 200,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 200,
    },
  ];

  const handleDelete = (rowID) => {
    const updatedData = data.filter((row) => rowID !== (row.id));
    const updatedFilteredData = filteredData.filter((row) => rowID !== (row.id));
    setData(updatedData);
    setFilteredData(updatedFilteredData);
    setSearch('');
    setPage(1);
    setSelectedRows([]);
  };

  const deleteSelected = () => {
    const updatedData = data.filter((row) => !selectedRows.includes(row.id));
    const updatedFilteredData = filteredData.filter((row) => !selectedRows.includes(row.id));
    setData(updatedData);
    setFilteredData(updatedFilteredData);
    setSearch('');
    setPage(1);
    setSelectedRows([]);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let searchData = data.filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm) ||
        row.email.toLowerCase().includes(searchTerm) ||
        row.role.toLowerCase().includes(searchTerm)
    );
    if (searchTerm.trim().length)
      setFilteredData(searchData);
    else {
      setFilteredData([]);
    }
    setSearch(searchTerm);
    setPage(1);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const isAllPageRowsSelected = () => {
    if (filteredData.length > 0) {
      const currentPageRows = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
      return currentPageRows.length > 0 && currentPageRows.every(row => selectedRows.includes(row.id));
    } else {
      const currentPageRows = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
      return currentPageRows.length > 0 && currentPageRows.every(row => selectedRows.includes(row.id));
    }
  };

  const toggleAllRows = () => {
    if (isAllPageRowsSelected()) {
      // If all rows on the current page are selected, unselect them
      if (filteredData.length > 0) {
        const currentPageRows = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
        setSelectedRows(selectedRows.filter(id => !currentPageRows.map(row => row.id).includes(id)));
      } else {
        const currentPageRows = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
        setSelectedRows(selectedRows.filter(id => !currentPageRows.map(row => row.id).includes(id)));
      }
    } else {
      // If not all rows on the current page are selected, select them
      if (filteredData.length > 0) {
        const currentPageRows = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
        const selectedIds = currentPageRows.map(row => row.id);
        setSelectedRows(selectedRows.concat(selectedIds));
      } else {
        const currentPageRows = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
        const selectedIds = currentPageRows.map(row => row.id);
        setSelectedRows(selectedRows.concat(selectedIds));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRowCount = search.trim().length ? filteredData.length : data.length;
  const totalPages = Math.ceil(filteredRowCount / rowsPerPage);

  const handleChangePage = (value) => {
    setPage(value);
  };

  return (
    <Box>
      <TextField
        variant="outlined"
        label="Search by name, email, or role"
        value={search}
        onChange={handleSearch}
        fullWidth
        style={{ marginBottom: '16px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  color="primary"
                  checked={isAllPageRowsSelected()}
                  onChange={toggleAllRows}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell style={{
                  color: 'black', fontWeight: '700',
                }} key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(search.trim().length > 0 ? filteredData : data)
              .slice((page - 1) * rowsPerPage, (page) * rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} className={selectedRows.includes(row.id) ? 'selected-row' : ''}>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows([...selectedRows, row.id]);
                        } else {
                          setSelectedRows(selectedRows.filter((id) => id !== row.id));
                        }
                      }}
                    />
                  </TableCell>
                  {columns.map((column, idx) => {
                    if (column.id !== 'actions')
                      return <TableCell key={`${idx}${column.id}`}>{row[column.id]}</TableCell>
                    else
                      return <TableCell key={`${idx}${column.id}`}>
                        <IconButton
                          onClick={() => handleEdit(row.id)}
                          color="success"
                          variant="outlined"
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(row.id)}
                          sx={{ color: red[500] }}
                          variant="outlined"
                        >
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>

                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="grid-container">
        <Button
          variant="contained"
          onClick={deleteSelected}
          style={{ backgroundColor: 'red', color: 'white' }}
        >
          Delete Selected
        </Button>
        <Button
          color="primary"
          onClick={() => handleChangePage(1)}
        >
          go to first page
        </Button>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Pagination
          className='paginationContainer'
          page={page}
          count={totalPages}
          onChange={(_, value) => handleChangePage(value)}
        />
        </Box>
        <Button
          color="primary"
          onClick={() => handleChangePage(totalPages)}
        >
          go to last page
        </Button>
      </div>
      <EditDialog
        isEditDialogOpen={isEditDialogOpen}
        closeEditDialog={closeEditDialog}
        editedRowData={editedRowData}
        setEditedRowData={setEditedRowData}
        saveEditedData={saveEditedData}
      />
    </Box>
  );
};

export default DataTable;
