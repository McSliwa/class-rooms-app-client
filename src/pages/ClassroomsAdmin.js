import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Button, Checkbox, Paper, Box, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableFooter, TextField, InputAdornment
} from '@mui/material';
import DialpadIcon from '@mui/icons-material/Dialpad';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Autocomplete from '@mui/material/Autocomplete';
import { getApiConfig } from "../config/config.js";
import { useAuth0 } from "@auth0/auth0-react";
import ArrowDD from '@mui/icons-material/ArrowDropDownCircleOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const configApi = getApiConfig();

function ClassroomsAdmin(props) {
    const [allRooms, setAllRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({
        classId: "", className: "",
        classType: "", classCapacity: 0
    });
    const [numSelected, setNumSelected] = useState(0);
    const [types, setTypes] = useState([]);
    const [items, setItems] = useState([]);
    const [roomItems, setRoomItems] = useState([])

    useEffect(() => {
        setTypes(props.classTypes);
        getClassroomsData();
        getItemsData();
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

    const getItemsData = async () => {
        await Axios.get(configApi.items, {
            headers: {
                'Access-ConTableRowol-Allow-Origin': true,
            },
        }).then((response) => {
            setItems(response.data.map((data) => ({ ...data, quantity: 1 })));
        });
    }

    const createClassroom = async () => {
        try {
            const token = await getAccessTokenSilently();
            Axios.post(configApi.classrooms,
                {
                    id: newRoom.classId,
                    name: newRoom.className,
                    typeObjectId: types.find(t => t.label === newRoom.classType).value,
                    capacity: newRoom.classCapacity,
                    classroomItems: roomItems.map(i => ({ itemId: i.id, quantity: i.quantity }))
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
            setRoomItems([]);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteClassroom = async () => {
        try {
            const token = await getAccessTokenSilently();
            allRooms.filter(r => r.selected === true).forEach(rr => {
                Axios.delete(`${configApi.classrooms}/${rr.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Access-ConTableRowol-Allow-Origin': true,
                    }
                }).then(() => {
                    getClassroomsData();
                });
            });
        } catch (error) {
            console.log(error);
        }
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

    const handleChipClick = (e, option) => {
        let tmpRoomItems = [...roomItems];
        let index = tmpRoomItems.indexOf(option);
        tmpRoomItems[index].quantity += 1;
        setRoomItems(tmpRoomItems);
    };

    const handleChipDelete = (e, option) => {
        let tmpRoomItems = [...roomItems];
        let index = tmpRoomItems.indexOf(option);
        if (option.quantity === 1) {
            tmpRoomItems.splice(index, 1);
        } else {
            tmpRoomItems[index].quantity -= 1;
        }
        setRoomItems(tmpRoomItems);
    };

    return (
        <>
            <Paper elevation={24} sx={{ p: 2, flexGrow: 1, m: 1 }}>
                <TableContainer component={Paper}>
                    <Table checboxselection="true" sx={{ minWidTableCell: 1000 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary"
                                        indeterminate={numSelected > 0 && numSelected < allRooms.length}
                                        checked={allRooms.length > 0 && numSelected === allRooms.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Numer</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Nazwa</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Typ</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Pojemność</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Wyposażenie: ilość</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                allRooms.map(room =>
                                    <TableRow key={room.id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox color="secondary"
                                                checked={room.selected}
                                                onChange={(e) => { handleSelectClick(e, room) }}
                                            />
                                        </TableCell>
                                        <TableCell width={150}>{room.id}</TableCell>
                                        <TableCell width={200}>{room.name}</TableCell>
                                        <TableCell width={100}>{
                                            props.classTypes.length > 0
                                                ? props.classTypes.find(t => t.value === room.typeObjectId).label
                                                : room.typeObjectId
                                        }
                                        </TableCell>
                                        <TableCell width={100}>{room.capacity}</TableCell>
                                        <TableCell width={450}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {room.classroomItems.map((item) => (
                                                    <Chip key={item.itemId}
                                                        label={`${items.length > 0 ? items.find(i => i.id === item.itemId).name : item.itemId}: ${item.quantity}`}
                                                        size='small'
                                                    />
                                                ))}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell padding="checkbox">
                                </TableCell>
                                <TableCell>
                                    <TextField id="outlined-basic" label='Nowy numer' variant="outlined"
                                        required size='small' fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <DialpadIcon color='primary' />
                                                </InputAdornment>)
                                        }}
                                        value={newRoom.classId}
                                        onChange={(event) => setNewRoom(prevState => ({
                                            ...prevState, classId: event.target.value
                                        }))}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField id="outlined-basic" label="Nazwa" variant="outlined" required
                                        size='small' fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <TextFieldsIcon color='primary' />
                                                </InputAdornment>)
                                        }}
                                        value={newRoom.className}
                                        onChange={(event) => setNewRoom(prevState => ({
                                            ...prevState, className: event.target.value
                                        }))}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Autocomplete
                                        id="classrooms-types"
                                        disablePortal size='small' fullWidth
                                        popupIcon={<ArrowDD color='primary' fontSize='small' />}
                                        clearIcon={<CancelIcon color='primary' fontSize='small' />}
                                        options={props.classTypes}
                                        inputValue={newRoom.classType}
                                        onInputChange={(e, newValue) => {
                                            setNewRoom(prevState => ({ ...prevState, classType: newValue }));
                                        }}
                                        isOptionEqualToValue={(option, value) => option.label === value.label}
                                        renderInput={(params) =>
                                            <TextField {...params} label="Typ" variant='outlined' required />}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField id="outlined-basic" label="Pojemność" variant="outlined" required
                                        size='small' fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <DialpadIcon color='primary' />
                                                </InputAdornment>)
                                        }}
                                        value={newRoom.classCapacity}
                                        onChange={(event) => setNewRoom(prevState => ({
                                            ...prevState, classCapacity: event.target.value
                                        }))}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Autocomplete
                                        variant="outlined" size='small'
                                        fullWidth multiple
                                        disableCloseOnSelect disablePortal filterSelectedOptions
                                        popupIcon={<ArrowDD color='primary' fontSize='small' />}
                                        clearIcon={<CancelIcon color='primary' fontSize='small' />}
                                        options={items}
                                        value={roomItems}
                                        onChange={(e, values) => setRoomItems(values)}
                                        getOptionLabel={(option) => `${option.name}`}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.name}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Wyposażenie"
                                                placeholder='Więcej' />
                                        )}
                                        renderTags={(values, getTagProps) =>
                                            values.map((option, index) => (
                                                <Chip {...getTagProps({ index })}
                                                    variant="filled" size='small' clickable
                                                    label={`${option.name}: ${option.quantity}`}
                                                    icon={<AddCircleIcon color='secondary' />}
                                                    deleteIcon={<RemoveCircleIcon color='secondary' />}
                                                    onDelete={(e) => { handleChipDelete(e, option) }}
                                                    onClick={(e) => { handleChipClick(e, option) }}
                                                />
                                            ))
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper elevation={24} sx={{ m: 1, p: 2, pl: 10 }} align="left">
                <Button variant="contained" color='primary' sx={{ mr: 2, color: '#FFFFFF' }}
                    onClick={createClassroom}>
                    {numSelected === 0 ? 'Dodaj' : 'Zapisz'}
                </Button>
                <Button variant="contained" color='secondary' sx={{ mr: 2, color: '#FFFFFF' }}
                    disabled={numSelected === 0}
                    onClick={deleteClassroom}>
                    Usuń
                </Button>
                <Button
                    variant="contained" color='primary'
                    sx={{ mr: 2, color: '#FFFFFF' }}
                    disabled={numSelected !== 1}
                //onClick={createClassroom}
                >
                    Edytuj
                </Button>
            </Paper>
        </>
    )
}

export default ClassroomsAdmin;