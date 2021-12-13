import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Button, Checkbox, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableFooter, TextField, InputAdornment,
} from '@mui/material';
import DialpadIcon from '@mui/icons-material/Dialpad';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Autocomplete from '@mui/material/Autocomplete';
import { getApiConfig } from "../config/config.js";
import { useAuth0 } from "@auth0/auth0-react";
//import { useForm } from "react-hook-form";

const configApi = getApiConfig();

function ClassroomsAdmin(props) {
    const [allRooms, setAllRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ classId: "", className: "", classType: "Standard", classCapacity: 0 });
    const [numSelected, setNumSelected] = useState(0);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        setTypes(props.classTypes);
        getClassroomsData();
    }, [props.classTypes]);

    const {
        getAccessTokenSilently,
    } = useAuth0();

    const getClassroomsData = async () => {
        const response = await Axios.get(configApi.classrooms, {
            headers: {
                'Access-ConTableRowol-Allow-Origin': true,
            },
        });
        setAllRooms(response.data.map((data) => ({ ...data, selected: false })));
    }

    const createClassroom = async () => {
        try {
            const token = await getAccessTokenSilently();
            await Axios.post(configApi.classrooms, {
                id: newRoom.classId,
                name: newRoom.className,
                typeObjectId: types.find(t => t.label === newRoom.classType).value,
                capacity: newRoom.classCapacity
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Access-ConTableRowol-Allow-Origin': true,
                    }
                }).then((response) => {
                    setAllRooms([...allRooms, { ...response.data, selected: false }])
                }).catch((error) => {
                    console.log(error);
                });
            setNewRoom({ classId: "", className: "", classCapacity: 0, classType: "" });
        } catch (error) {
            console.log(error);
        }
    }

    const deleteClassroom = () => {
        allRooms.filter(r => r.selected === true).forEach(rr => {
            Axios.delete(`${configApi.classrooms}/${rr.id}`)
                .then(() => { getClassroomsData(); });
        });
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setNumSelected(allRooms.length);
            setAllRooms(allRooms.map((room) => ({ ...room, selected: true })));
        }
        else {
            setNumSelected(0);
            setAllRooms(allRooms.map((room) => ({ ...room, selected: false })));
        }
    }

    const handleSelectClick = (event, room) => {
        room.selected = event.target.checked;
        setAllRooms([...allRooms]);
        if (event.target.checked) {
            setNumSelected(numSelected + 1);
        }
        else {
            setNumSelected(numSelected - 1);
        }
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table checboxselection="true" sx={{ minWidTableCell: 850 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox color="primary" inputProps={{ 'aria-label': 'select all desserts', }}
                                    indeterminate={numSelected > 0 && numSelected < allRooms.length}
                                    checked={allRooms.length > 0 && numSelected === allRooms.length}
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
                        {allRooms.map(room =>
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
                                    required size='small' fullwidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <DialpadIcon color='primary' />
                                            </InputAdornment>)
                                    }}
                                    value={newRoom.classId}
                                    onChange={(event) => setNewRoom(prevState => ({ ...prevState, classId: event.target.value }))}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField id="outlined-basic" label="Name" variant="outlined" required
                                    size='small' fullwidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <TextFieldsIcon color='primary' />
                                            </InputAdornment>)
                                    }}
                                    value={newRoom.className}
                                    onChange={(event) => setNewRoom(prevState => ({ ...prevState, className: event.target.value }))}
                                />
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    disablePortal size='small' fullwidth variant='outlined'
                                    id="combo-box-demo"
                                    options={props.classTypes}
                                    value={newRoom.classType}
                                    onChange={(e) => setNewRoom(prevState => ({ ...prevState, classType: e.target.textContent }))}
                                    renderInput={(params) =>
                                        <TextField {...params} label="Type" value={newRoom.classType}
                                            onChange={(e) => setNewRoom(prevState => ({ ...prevState, classType: e.target.textContent }))}
                                        />}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField id="outlined-basic" label="Capacity" variant="outlined" required
                                    size='small' fullwidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <DialpadIcon color='primary' />
                                            </InputAdornment>)
                                    }}
                                    value={newRoom.classCapacity} InputLabelProps={{ shrink: true }}
                                    onChange={(event) => setNewRoom(prevState => ({ ...prevState, classCapacity: event.target.value }))}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <Paper elevation={24} sx={{ mt: 2, p: 3 }} align="left">
                <Button variant="contained" color='primary' sx={{ ml: 4, mr: 2, color: '#FFFFFF' }}
                    onClick={createClassroom}>
                    Dodaj
                </Button>
                <Button variant="contained" color='secondary' sx={{ mr: 2, color: '#FFFFFF' }}
                    onClick={deleteClassroom}>
                    Usuń
                </Button>
            </Paper>
        </>
    )
}

export default ClassroomsAdmin;