import React, { useState } from 'react';
import Axios from 'axios';
import {
    Button, Checkbox, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Grid
} from '@mui/material';
import DialpadIcon from '@mui/icons-material/Dialpad';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ArrowDD from '@mui/icons-material/ArrowDropDownCircleOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CancelIcon from '@mui/icons-material/Cancel';
import { pl } from 'date-fns/locale';
import { getApiConfig } from "../config/config.js";
import { useAuth0 } from "@auth0/auth0-react";
//import { useForm } from "react-hook-form";

const configApi = getApiConfig();

function Classrooms(props) {
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [filters, setFilters] = useState({
        dateStart: new Date(Date.now()), dateEnd: new Date(Date.now()),
        capacity: 0, type: "Standard", equipment: ""
    });
    const [numSelected, setNumSelected] = useState(0);

    const {
        getAccessTokenSilently,
    } = useAuth0();

    const getFilteredClassroomsData = async () => {
        try {
            const token = await getAccessTokenSilently();
            await Axios.get(configApi.filtering, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Access-ConTableRowol-Allow-Origin': true,
                },
                params: {
                    start: filters.dateStart.toISOString(),
                    end: filters.dateEnd.toISOString(),
                    capacityMin: filters.capacity,
                    type: props.classTypes.find(c => c.label === filters.type).value,
                    keyWords: filters.equipment
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

    return (
        <>
            <Paper elevation={24} sx={{ p: 2, flexGrow: 1, m: 1 }}>
                <Grid container spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={pl}>
                        <Grid item md={3}>
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
                        <Grid item md={3}>
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
                    <Grid item md={3}>
                        <Autocomplete
                            id="classrooms-types"
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
                    <Grid item md={3}>
                        <TextField id="outlined-basic" label="Minimalna pojemność" variant="outlined"
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
                    <Grid item md={12}>
                        <TextField id="outlined-basic" label="Wyposażenie" variant="outlined"
                            size='small' fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <TextFieldsIcon color='primary' fontSize='small' />
                                    </InputAdornment>)
                            }}
                            value={filters.equipment}
                            onChange={(e) => setFilters(prevState => ({ ...prevState, equipment: e.target.value }))} />
                    </Grid>
                    <Grid item xs={2} md={3}>
                        <Button variant="contained" color='primary' sx={{ mr: 2, color: '#FFFFFF' }}
                            onClick={getFilteredClassroomsData}>
                            Szukaj
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Paper elevation={24} sx={{ p: 2, flexGrow: 1, m: 1 }}>
                <TableContainer component={Paper}>
                    <Table checboxselection="true" sx={{ minWidTableCell: 850 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary"
                                        indeterminate={numSelected > 0 && numSelected < filteredRooms.length}
                                        checked={filteredRooms.length > 0 && numSelected === filteredRooms.length}
                                        onChange={handleSelectAllClick} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Classroom Id</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Capacity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRooms.map(room => <TableRow key={room.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox color="secondary"
                                        checked={room.selected}
                                        onChange={(e) => { handleSelectClick(e, room); }} />
                                </TableCell>
                                <TableCell width='300'>{room.id}</TableCell>
                                <TableCell>{room.name}</TableCell>
                                <TableCell width='300'>{room.typeObject.typeName}</TableCell>
                                <TableCell width='300'>{room.capacity}</TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper elevation={24} sx={{ m: 1, p: 2 }} align="left">
                <Button variant="contained" color='secondary' sx={{ mr: 2, color: '#FFFFFF' }}
                >
                    Zarezerwuj
                </Button>
            </Paper>
        </>
    );
}

export default Classrooms;