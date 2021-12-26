import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
    Button, Checkbox, Paper, Box, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Grid
} from '@mui/material';
import DialpadIcon from '@mui/icons-material/Dialpad';
import ArrowDD from '@mui/icons-material/ArrowDropDownCircleOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CancelIcon from '@mui/icons-material/Cancel';
import { pl } from 'date-fns/locale';
import { getApiConfig } from "../config/config.js";
import { useAuth0 } from "@auth0/auth0-react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const configApi = getApiConfig();

function Classrooms(props) {
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [filters, setFilters] = useState({
        dateStart: new Date(Date.now()), dateEnd: new Date(Date.now()),
        capacity: 0, type: "", minEquipment: []
    });
    const [numSelected, setNumSelected] = useState(0);
    const [types, setTypes] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        setTypes(props.classTypes);
        getItemsData();
    }, [props.classTypes]);

    const {
        getAccessTokenSilently,
    } = useAuth0();

    const getItemsData = async () => {
        await Axios.get(configApi.items, {
            headers: {
                'Access-ConTableRowol-Allow-Origin': true,
            },
        }).then((response) => {
            setItems(response.data.map((data) => ({ ...data, quantity: 1 })));
        });
    }

    const getFilteredClassroomsData = async () => {
        try {
            const token = await getAccessTokenSilently();
            await Axios.post(configApi.filtering,
                {
                    start: filters.dateStart.toISOString(),
                    end: filters.dateEnd.toISOString(),
                    capacityMin: filters.capacity,
                    type: filters.type !== ''
                        ? types.find(c => c.label === filters.type).value
                        : '',
                    minEquipment: filters.minEquipment.map(i => ({ itemId: i.id, quantity: i.quantity }))
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Access-ConTableRowol-Allow-Origin': true,
                    }
                }).then((response) => {
                    setFilteredRooms(response.data.map((data) => ({ ...data, selected: false })));
                });
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectClick = (e, room) => {
        room.selected = e.target.checked;
        setFilteredRooms([...filteredRooms]);
        if (e.target.checked) {
            setNumSelected(numSelected + 1);
        }
        else {
            setNumSelected(numSelected - 1);
        }
    }

    const handleSelectAllClick = (e) => {
        if (e.target.checked) {
            setNumSelected(filteredRooms.length);
            setFilteredRooms(filteredRooms.map((room) => ({ ...room, selected: true })));
        }
        else {
            setNumSelected(0);
            setFilteredRooms(filteredRooms.map((room) => ({ ...room, selected: false })));
        }
    }

    const addReservation = async () => {
        try {
            const token = await getAccessTokenSilently();
            await Axios.post(configApi.reservations, {
                start: filters.dateStart.toISOString(),
                end: filters.dateEnd.toISOString(),
                classroomId: filteredRooms.find(r => r.selected).id
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Access-ConTableRowol-Allow-Origin': true,
                    }
                }).then(() => {
                    getFilteredClassroomsData();
                }).catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }

    const handleChipClick = (e, option) => {
        let tmpRoomItems = [...filters.minEquipment];
        let index = tmpRoomItems.indexOf(option);
        tmpRoomItems[index].quantity += 1;
        setFilters(prevState => ({ ...prevState, minEquipment: tmpRoomItems }));
    };

    const handleChipDelete = (e, option) => {
        let tmpRoomItems = [...filters.minEquipment];
        let index = tmpRoomItems.indexOf(option);
        if (option.quantity === 1) {
            tmpRoomItems.splice(index, 1);
        } else {
            tmpRoomItems[index].quantity -= 1;
        }
        setFilters(prevState => ({ ...prevState, minEquipment: tmpRoomItems }));
    };

    return (
        <>
            <Paper elevation={24} sx={{ p: 2, flexGrow: 1, m: 1 }}>
                <Grid container spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={pl}>
                        <Grid item md={2}>
                            <DateTimePicker OpenPickerButtonProps={{ color: 'primary' }}
                                showTodayButton todayText='Now' fullWidth
                                label="Data i godzina rozpoczęcia"
                                value={filters.dateStart}
                                onChange={(e) => setFilters(prevState => ({ ...prevState, dateStart: e }))}
                                renderInput={(params) => <TextField size='small' {...params} />}
                                disableMaskedInput
                                minDate={new Date(Date.now())}
                                minDateTime={new Date(Date.now())}
                            />
                        </Grid>
                        <Grid item md={2}>
                            <DateTimePicker OpenPickerButtonProps={{ color: 'primary' }}
                                showTodayButton todayText='Now' fullWidth
                                label="Data i godzina zakończenia"
                                value={filters.dateEnd}
                                onChange={(e) => setFilters(prevState => ({ ...prevState, dateEnd: e }))}
                                renderInput={(params) => <TextField size='small' {...params} />}
                                disableMaskedInput
                                minDate={new Date(Date.now())}
                                minDateTime={new Date(Date.now())}
                            />
                        </Grid>
                    </LocalizationProvider>
                    <Grid item md={2}>
                        <Autocomplete
                            disablePortal size='small' fullWidth
                            popupIcon={<ArrowDD color='primary' fontSize='small' />}
                            clearIcon={<CancelIcon color='primary' fontSize='small' />}
                            options={props.classTypes}
                            inputValue={filters.type}
                            onInputChange={(e, newValue) => {
                                setFilters(prevState => ({ ...prevState, type: newValue }));
                            }}
                            isOptionEqualToValue={(option, value) => option.label === value.label}
                            renderInput={(params) =>
                                <TextField {...params} label="Typ" variant='outlined' />}
                        />
                    </Grid>
                    <Grid item md={2}>
                        <TextField label="Minimalna pojemność" variant="outlined"
                            size='small' sx={{ mr: 2 }} fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <DialpadIcon color='primary' fontSize='small' />
                                    </InputAdornment>)
                            }}
                            value={filters.capacity} InputLabelProps={{ shrink: true }}
                            onChange={(e) => setFilters(prevState => ({ ...prevState, capacity: e.target.value }))} />
                    </Grid>
                    <Grid item md={3}>
                        <Autocomplete
                            variant="outlined" size='small'
                            fullWidth multiple
                            disableCloseOnSelect disablePortal filterSelectedOptions
                            popupIcon={<ArrowDD color='primary' fontSize='small' />}
                            clearIcon={<CancelIcon color='primary' fontSize='small' />}
                            options={items}
                            value={filters.minEquipment}
                            onChange={(e, values) => setFilters(prevState => ({ ...prevState, minEquipment: values }))}
                            getOptionLabel={(option) => `${option.name}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Wyposażenie: minimalna ilość"
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
                    </Grid>
                    <Grid item md={1}>
                        <Button variant="contained" color='primary'
                            sx={{ mr: 2, color: '#FFFFFF' }}
                            onClick={getFilteredClassroomsData}>
                            Szukaj
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Paper elevation={24} sx={{ p: 2, flexGrow: 1, m: 1 }}>
                <TableContainer component={Paper}>
                    <Table checboxselection="true" sx={{ minWidTableCell: 1000 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary"
                                        indeterminate={numSelected > 0 && numSelected < filteredRooms.length}
                                        checked={filteredRooms.length > 0 && numSelected === filteredRooms.length}
                                        onChange={handleSelectAllClick} />
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
                                filteredRooms.map(room =>
                                    <TableRow key={room.id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox color="secondary"
                                                checked={room.selected}
                                                onChange={(e) => { handleSelectClick(e, room); }}
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
                    </Table>
                </TableContainer>
            </Paper>
            <Paper elevation={24} sx={{ m: 1, p: 2, pl: 10 }} align="left">
                <Button variant="contained" color='secondary' sx={{ mr: 2, color: '#FFFFFF' }}
                    disabled={numSelected !== 1}
                    onClick={addReservation}
                >
                    Zarezerwuj
                </Button>
            </Paper>
        </>
    );
}

export default Classrooms;