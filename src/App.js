import './App.css';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Button, Checkbox } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableFooter, TextField, InputAdornment
} from '@mui/material';
import Paper from '@mui/material/Paper';
import DialpadIcon from '@mui/icons-material/Dialpad';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFC87A',
      darker: '#E69A2E',
    },
    warning: {
      main: '#E69A2E',
    },
  },
});

export default function App(props) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({});

  useEffect(() => {
    getClassroomsData();
  },[])

  async function getClassroomsData() {
    const response = await Axios.get("https://localhost:5001/api/Classrooms", {
      headers: {
        'Access-ConTableRowol-Allow-Origin': true,
      },
    });
    setRooms(response.data);
  }

  const createClassroom = () => {
    Axios.post("https://localhost:5001/api/Classrooms", {
      id: newRoom.classId,
      name: newRoom.className,
      capacity: newRoom.classCapacity
    }).then((response) => {
      setRooms([...rooms, response.data])
    });
    setNewRoom({ classId: "", className: "", classCapacity: "" });
  }


  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div>
          <Paper component="h3" align="left" sx={{
            p: 3, mb: 3, color: '#00619E', fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FFC87A 30%, #E69A2E 90%)'
          }}
            elevation={18}>CLASS(ROOMS)</Paper>
          <TableContainer component={Paper} sx={{}}>
            <Table checboxSelection sx={{ minWidTableCell: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      //indeterminate={numSelected > 0 && numSelected < rowCount}
                      //checked={rowCount > 0 && numSelected === rowCount}
                      //onChange={onSelectAllClick}
                      inputProps={{
                        'aria-label': 'select all desserts',
                      }}
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
                      <Checkbox
                        color="primary"
                        //indeterminate={numSelected > 0 && numSelected < rowCount}
                        //checked={rowCount > 0 && numSelected === rowCount}
                        //onChange={onSelectAllClick}
                        inputProps={{
                          'aria-label': 'select all desserts',
                        }}
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
                      onChange={(event) => setNewRoom(prevState => ({...prevState, classId: event.target.value }))} />
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
                      onChange={(event) => setNewRoom(prevState => ({...prevState, className: event.target.value }))} />
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
                      onChange={(event) => setNewRoom(prevState => ({...prevState, classCapacity: event.target.value }))} />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
        <Paper elevation={24}
          sx={{ marginTop: 2, p: 3 }} align="left">
          <Button variant="contained" color='primary' sx={{ marginRight: 2 }}
            onClick={createClassroom}>
            Dodaj
          </Button>
          <Button variant="contained" color='warning'>
            Usuń
          </Button>
        </Paper>
      </div>
    </ThemeProvider>
  );

}