import React, { useState, useEffect } from 'react';
import AssignmentIcon from "@mui/icons-material/Assignment";
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, InputAdornment, IconButton, Tooltip, Button, Modal, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useParams } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";
import { useDeleteUserMutation,useGetAllUsersByClassMutation } from '../view/userApiSlice';

import AddUserForm from '../add/AddUser';
import theme from '../../../theme';
import { ThemeProvider } from '@mui/material/styles';
import './users-list.css';
import LOADING from '../../loadingAnimation/LoadingAnimation';
import useSchoolAndClass from '../../../hooks/useSchoolAndClass';
import CurrentSchoolAndClass from '../../companies/CurrentSchoolAndClass/CurrentSchoolAndClass';

const UsersList = () => {
 
const [getAllUsersByClass,{ data: users, isError, error, isLoading}]=useGetAllUsersByClassMutation()
  // const { data: users, isError, error, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
const {chosenClass}=useSchoolAndClass()
const {class_id}=useParams()
  useEffect(() => {
    let usersData
    if (users) {
      if (!users.data && users.message)
        usersData = []
      else {
        usersData = users.data.map(user => ({
          ...user,
          id: user._id,
          companyName: user.company?.name,
          className: user.class?.name || '--', // Handling potential undefined class
          email:user.email||"--"
        }));
      }
      setRows(usersData);
    }
  }, [users]);
useEffect(()=>{
  //shows all the students after seeing any class
  if(class_id){
    getAllUsersByClass({chosenClass:class_id})
  }
  //shows the students from the chosen class
 else if(chosenClass){
   getAllUsersByClass({chosenClass})
  }
},[chosenClass,showAddUserForm,class_id])
  const deleteClick = (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser({ _id: user._id });
    }
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };
  let filteredRows
  if (rows) {
    console.log(rows, "ee");
    filteredRows = rows?.filter((row) => {
      return row.fullname.toLowerCase().includes(searchText.toLowerCase());
    });
  }
  else
    filteredRows = []
  const columns = [
    { field: 'username', headerName: 'שם משתמש', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'fullname', headerName: 'שם מלא', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'className', headerName: 'כיתה', flex: 1, headerAlign: 'center', align: 'center' }, // Changed field name to 'className'
    { field: 'email', headerName: 'מייל', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'marks', headerName: 'ציונים', flex: 1, headerAlign: 'center', align: 'center', sortable: false,
      renderCell: (params) => (
        <>
          <Link to={`/dash/users/markbystudent/${params.row.id}`} className='users-list-marks'>
            <Tooltip title="mark">
              <IconButton aria-label="mark">
              <AssignmentIcon />
               </IconButton>
            </Tooltip>
          </Link>

        </>
      ),
    },
    {
      field: 'actions',
      headerName: 'פעולות',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <>
          <Link to={`/dash/users/update/${params.row.id}`} className='users-list-button users-list-view'>
            <Tooltip title="update">
              <IconButton aria-label="update">
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Link>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={() => deleteClick(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        setShowThankYou(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showThankYou]);

  if (isLoading) return <LOADING/>
  if (isError) return <h1>Error: {JSON.stringify(error)}</h1>;
  if(!chosenClass&&!class_id)return <CurrentSchoolAndClass/>
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '75vh' }}>
        <Box className='user-list-top' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px',overflowX: 'auto', 
 }}>
          <Button
            className="users-list-add-button"
            onClick={() => setShowAddUserForm(true)}
            startIcon={<IoPersonAddSharp />}
            sx={{
              backgroundColor: '#9B153B',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#7a0f29',
              },
              fontSize: '0.75rem',
              padding: '4px 8px',
            }}
          >
            הוספת תלמידה
          </Button>
          <TextField
            label="חיפוש"
            variant="outlined"
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            // sx={{ margin: '4px', fontSize: '0.75rem', flexGrow: 1 }} // Ensure search field grows to fit available space
            sx={{ width: "20%", margin: '9px' }} // Ensure the search input takes full width

          />
        </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
{/* <Box
  sx={{
    flex: 1,
    overflowY: "auto",
    position: "relative", // תומך במיקום יחסי
    bottom: 0, // שומר אותו בקצה התחתון של הקונטיינר
  }}
>
  <DataGrid
    rows={filteredRows}
    columns={columns}
    pageSize={5}
    rowsPerPageOptions={[5]}
    checkboxSelection
    disableSelectionOnClick
    sx={{
      height: "100%", // מבטיח שהגובה יתפוס את כל השטח הזמין
      width: "100%",
      "& .MuiDataGrid-columnHeader": {
        fontWeight: "bolder", // טקסט כותרת בולט
        fontSize: "larger",
      },
      "& .MuiDataGrid-cell": {
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    }}
  />
</Box> */}
<Box sx={{ 
  flex: 1, 
  overflowY: 'auto', 
  paddingBottom: '20vh', 
  display: 'flex', 
  flexDirection: 'column', 
  minHeight: '85vh', // מאפשר ל-Box להתכווץ ולהתממש בהתאם לתוכן,
  minWidth:'800px'
}}>
  <DataGrid
    rows={filteredRows}
    columns={columns}
    pageSize={10}
    rowsPerPageOptions={[10, 20, 50]}
    disableSelectionOnClick
    sx={{
      height: "100%", // ייקח את כל השטח הפנוי ב-Box
      width: "100%",
      "& .MuiDataGrid-columnHeader": {
        fontWeight: "bolder", // Bold header text
        fontSize: "larger",
      },
      "& .MuiDataGrid-cell": {
        // overflow: "hidden",
        textOverflow: "ellipsis",
      },
    }}
  />
</Box>

 
</Box>

        <Modal
          open={showAddUserForm}
          onClose={() => setShowAddUserForm(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Paper sx={{ padding: '16px', width: '400px', margin: 'auto', marginTop: '20vh' }}>
            <Typography id="modal-title" variant="h6" fontWeight='bold' display='flex' justifyContent='center' component="h2">
              הוספת תלמידה חדשה
            </Typography>
            <AddUserForm
              setShowThankYou={setShowThankYou}
              setOpenModal={setShowAddUserForm}
            />
          </Paper>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default UsersList;

