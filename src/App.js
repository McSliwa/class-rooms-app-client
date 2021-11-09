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
import { useForm } from "react-hook-form";

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

const URL_API = 'https://localhost:5001/api/Classrooms'
//const URL_API = 'https://89.71.112.170:6969/api/Classrooms'

export default function App(props) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({});
  const [numSelected, setNumSelected] = useState(0);
  const [value, setValue] = React.useState(3);

  useEffect(() => {
    getClassroomsData();
  }, []);

  const getClassroomsData = async () => {
    const response = await Axios.get(URL_API, {
      headers: {
        'Access-ConTableRowol-Allow-Origin': true,
      },
    });
    setRooms(response.data.map((data) => ({ ...data, selected: false })));
  }

  const createClassroom = () => {
    Axios.post(URL_API, {
      id: newRoom.classId,
      name: newRoom.className,
      capacity: newRoom.classCapacity
    }).then((response) => {
      setRooms([...rooms, { ...response.data, selected: false }])
    });
    setNewRoom({ classId: "", className: "", classCapacity: "" });
  }

  const deleteClassroom = () => {
    rooms.filter(r => r.selected === true).forEach(rr => {
      Axios.delete(`${URL_API}/${rr.id}`)
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
            background: 'linear-gradient(45deg, #FFC87A 30%, #E69A2E 90%)'
          }}>
            <Toolbar>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <DoubleArrowIcon onClick={nextTab} />
              </IconButton>
              <TabList onChange={handleChange} aria-label="lab API tabs example"
                sx={{ flexGrow: 1 }} variant='scrollable' scrollButtons='auto'
                allowScrollButtonsMobile>
                <Tab label="Searching" value={1} />
                <Tab label="Reservatins" value={2} />
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
                    <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 16 }}>Classroom Id</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 16 }}>Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 16 }}>Capacity</TableCell>
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
                      <TableCell align="left">{room.id}</TableCell>
                      <TableCell align="right">{room.name}</TableCell>
                      <TableCell align="right">{room.capacity}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell padding="checkbox">
                    </TableCell>
                    <TableCell>
                      <TextField id="outlined-basic" label='New Classroom id' variant="outlined"
                        required size='small' margin="normal" fullWidth
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
                        size='small' margin="normal" fullWidth
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
                      <TextField id="outlined-basic" label="Capacity" variant="outlined" required
                        size='small' margin="normal" fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <TextFieldsIcon color='primary' />
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