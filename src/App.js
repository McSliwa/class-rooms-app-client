import './App.css';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Button, Checkbox, Paper, AppBar, Toolbar, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableFooter, TextField, InputAdornment, Typography
} from '@mui/material';
import DialpadIcon from '@mui/icons-material/Dialpad';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

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

export default function App(props) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({});
  const [numSelected, setNumSelected] = useState(0);

  useEffect(() => {
    getClassroomsData();
  }, []);

  const getClassroomsData = async () => {
    const response = await Axios.get("https://localhost:5001/api/Classrooms", {
      headers: {
        'Access-ConTableRowol-Allow-Origin': true,
      },
    });
    setRooms(response.data.map((data) => ({ ...data, selected: false })));
  }

  const createClassroom = () => {
    Axios.post("https://localhost:5001/api/Classrooms", {
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
      Axios.delete(`https://localhost:5001/api/Classrooms/${rr.id}`)
      .then(() => {getClassroomsData();});
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


  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div>
          <AppBar component={Paper} variant='elevation' align='left' position="sticky" sx={{
            p: 1, mb: 2, color: '#007ECC', fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FFC87A 30%, #E69A2E 90%)'
          }}>
            <Toolbar sx={{ ml: 3 }}>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                Class(ROOM)
              </Typography>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
                aria-haspopup="true" color="inherit" //onClick={handleMenu} 
              >
                <AccountCircle />
              </IconButton>
            </Toolbar>
          </AppBar>
          <TableContainer component={Paper}>
            <Table checboxSelection sx={{ minWidTableCell: 650 }}>
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
                            <DialpadIcon />
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
                            <TextFieldsIcon />
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
                            <TextFieldsIcon />
                          </InputAdornment>)
                      }}
                      value={newRoom.classCapacity} InputLabelProps={{ shrink: true }}
                      onChange={(event) => setNewRoom(prevState => ({ ...prevState, classCapacity: event.target.value }))} />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
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
      </div>
    </ThemeProvider>
  );

}