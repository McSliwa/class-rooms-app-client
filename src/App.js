import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
  Button, Checkbox, Paper, AppBar, Toolbar, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableFooter, TextField, InputAdornment
} from '@mui/material';
import DialpadIcon from '@mui/icons-material/Dialpad';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { unstable_styleFunctionSx } from '@mui/system';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Autocomplete from '@mui/material/Autocomplete';
//import { useForm } from "react-hook-form";

const Div = styled('div')(unstable_styleFunctionSx);

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2E9FE6',
    },
    secondary: {
      main: '#E69A2E',
    },
  },
});

const URL_BASE = 'https://localhost:5001/api'
//const URL_BASE = 'https://89.71.112.170:6969/api'
const URL_API_CLASS = `${URL_BASE}/Classrooms`
const URL_API_TYPE = `${URL_BASE}/ClassroomType`

export default function App(props) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ classId: "", className: "", classType: "", classCapacity: 0 });
  const [numSelected, setNumSelected] = useState(0);
  const [value, setValue] = useState(3);
  const [classTypes, setClassTypes] = useState([]);

  useEffect(() => {
    bindDictionary();
    getClassroomsData();
  }, []);

  const getClassroomsData = async () => {
    const response = await Axios.get(URL_API_CLASS, {
      headers: {
        'Access-ConTableRowol-Allow-Origin': true,
      },
    });
    setRooms(response.data.map((data) => ({ ...data, selected: false })));
  }

  const bindDictionary = async () => {
    const response = await Axios.get(URL_API_TYPE, {
      headers: {
        'Access-ConTableRowol-Allow-Origin': true,
      },
    });
    setClassTypes(response.data.map((data) => ({ label: data.typeName, value: data.id })));
  }

  const createClassroom = () => {
    Axios.post(URL_API_CLASS, {
      id: newRoom.classId,
      name: newRoom.className,
      typeObjectId: classTypes.find(c => c.label === newRoom.classType).value,
      capacity: newRoom.classCapacity
    }).then((response) => {
      setRooms([...rooms, { ...response.data, selected: false }])
    });
    setNewRoom({ classId: "", className: "", classCapacity: 0, classType: "" });
  }

  const deleteClassroom = () => {
    rooms.filter(r => r.selected === true).forEach(rr => {
      Axios.delete(`${URL_API_CLASS}/${rr.id}`)
        .then(() => { getClassroomsData(); });
    });
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setNumSelected(rooms.length);
      setRooms(rooms.map((room) => ({ ...room, selected: true })));
    }
    else {
      setNumSelected(0);
      setRooms(rooms.map((room) => ({ ...room, selected: false })));
    }
  }

  const handleSelectClick = (event, room) => {
    room.selected = event.target.checked;
    setRooms([...rooms]);
    if (event.target.checked) {
      setNumSelected(numSelected + 1);
    }
    else {
      setNumSelected(numSelected - 1);
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const nextTab = (event) => {
    const nextValue = value === 4 ? 1 : (value + 1);
    setValue(nextValue);
  };


  return (
    <ThemeProvider theme={theme}>
      <Div sx={{ backgroundColor: '#282c34', minHeight: '100vh' }}>
        <TabContext value={value}>
          <AppBar component={Paper} variant='elevation' align='left' position="sticky" sx={{
            p: 1, color: '#007ECC', fontWeight: 'bold',
            background: 'linear-gradient(45deg, #E69A2E 20%,#FFC87A 90%)'
          }}>
            <Toolbar>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <DoubleArrowIcon onClick={nextTab} />
              </IconButton>
              <TabList onChange={handleChange} aria-label="lab API tabs example"
                sx={{ flexGrow: 1 }} variant='scrollable' scrollButtons='auto'
                allowScrollButtonsMobile>
                <Tab label="Searching" value={1} />
                <Tab label="Reservations" value={2} />
                <Tab label="Classrooms" value={3} />
                <Tab label="Equipment" value={4} />
              </TabList>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
                aria-haspopup="true" color="inherit" edge='end' //onClick={handleMenu} 
              >
                <AccountCircle />
              </IconButton>
            </Toolbar>
          </AppBar>
          <TabPanel value={1}>
            <Paper elevation={24} sx={{ marginTop: 2, p: 3 }} align="left">TO DO</Paper>
          </TabPanel>
          <TabPanel value={2}>
            <Paper elevation={24} sx={{ marginTop: 2, p: 3 }} align="left">TO DO</Paper>
          </TabPanel>
          <TabPanel value={3}>
            <TableContainer component={Paper}>
              <Table checboxSelection sx={{ minWidTableCell: 850 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" inputProps={{ 'aria-label': 'select all desserts', }}
                        indeterminate={numSelected > 0 && numSelected < rooms.length}
                        checked={rooms.length > 0 && numSelected === rooms.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Classroom Id</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Capacity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map(room =>
                    <TableRow key={room.id}>
                      <TableCell padding="checkbox">
                        <Checkbox color="secondary" inputProps={{ 'aria-label': 'select all desserts', }}
                          checked={room.selected}
                          onChange={(e) => { handleSelectClick(e, room) }}
                        />
                      </TableCell>
                      <TableCell width='300'>{room.id}</TableCell>
                      <TableCell>{room.name}</TableCell>
                      <TableCell width='300'>{room.typeObject.typeName}</TableCell>
                      <TableCell width='300'>{room.capacity}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell padding="checkbox">
                    </TableCell>
                    <TableCell>
                      <TextField id="outlined-basic" label='New Classroom id' variant="outlined"
                        required size='small' fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <DialpadIcon color='primary' />
                            </InputAdornment>)
                        }}
                        value={newRoom.classId}
                        onChange={(event) => setNewRoom(prevState => ({ ...prevState, classId: event.target.value }))} />
                    </TableCell>
                    <TableCell>
                      <TextField id="outlined-basic" label="Name" variant="outlined" required
                        size='small' fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <TextFieldsIcon color='primary' />
                            </InputAdornment>)
                        }}
                        value={newRoom.className}
                        onChange={(event) => setNewRoom(prevState => ({ ...prevState, className: event.target.value }))} />
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        disablePortal size='small' fullWidth variant='outlined'
                        id="combo-box-demo"
                        options={classTypes}
                        value={newRoom.classType}
                        onChange={(e) => setNewRoom(prevState => ({ ...prevState, classType: e.target.textContent }))}
                        renderInput={(params) =>
                          <TextField {...params} label="Type" value={newRoom.classType}
                            onChange={(e) => setNewRoom(prevState => ({ ...prevState, classType: e.target.textContent }))} />}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField id="outlined-basic" label="Capacity" variant="outlined" required
                        size='small' fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <DialpadIcon color='primary' />
                            </InputAdornment>)
                        }}
                        value={newRoom.classCapacity} InputLabelProps={{ shrink: true }}
                        onChange={(event) => setNewRoom(prevState => ({ ...prevState, classCapacity: event.target.value }))} />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <Paper elevation={24} sx={{ marginTop: 2, p: 3 }} align="left">
              <Button variant="contained" color='primary' sx={{ ml: 4, mr: 2, color: '#FFFFFF' }}
                onClick={createClassroom}>
                Dodaj
              </Button>
              <Button variant="contained" color='secondary' sx={{ mr: 2, color: '#FFFFFF' }}
                onClick={deleteClassroom}>
                Usuń
              </Button>
            </Paper>
          </TabPanel>
          <TabPanel value={4}>
            <Paper elevation={24} sx={{ marginTop: 2, p: 3 }} align="left">TO DO</Paper>
          </TabPanel>
        </TabContext>
      </Div>
    </ThemeProvider>
  );

}