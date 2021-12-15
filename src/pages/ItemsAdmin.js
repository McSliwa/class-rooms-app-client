import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Checkbox, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableFooter, TextField, InputAdornment
} from '@mui/material';
import DialpadIcon from '@mui/icons-material/Dialpad';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { getApiConfig } from "../config/config.js";
//import { useForm } from "react-hook-form";

const configApi = getApiConfig();

function ItemsAdmin(props) {
    const [items, setItems] = useState([]);
    const [numSelected, setNumSelected] = useState(0);

    useEffect(() => {
        getItemsData();
    }, []);

    const getItemsData = async () => {
        const response = await Axios.get(configApi.items, {
            headers: {
                'Access-ConTableRowol-Allow-Origin': true,
            },
        });
        setItems(response.data.map((data) => ({ ...data, selected: false })));
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setNumSelected(items.length);
            setItems(items.map((room) => ({ ...room, selected: true })));
        }
        else {
            setNumSelected(0);
            setItems(items.map((room) => ({ ...room, selected: false })));
        }
    }

    const handleSelectClick = (event, room) => {
        room.selected = event.target.checked;
        setItems([...items]);
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
                                <Checkbox color="primary"
                                    indeterminate={numSelected > 0 && numSelected < items.length}
                                    checked={items.length > 0 && numSelected === items.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item =>
                            <TableRow key={item.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox color="secondary"
                                        inputProps={{ 'aria-label': 'select all desserts', }}
                                        checked={item.selected}
                                        onChange={(e) => { handleSelectClick(e, item) }}
                                    />
                                </TableCell>
                                <TableCell width='300'>{item.name}</TableCell>
                                <TableCell width='300'>{item.quantity}</TableCell>
                                <TableCell>{item.description}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow sx={{ visibility: 'visible' }}>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>
                                <TextField id="outlined-basic" label='New Item name' variant="outlined"
                                    required size='small' fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <TextFieldsIcon color='primary' />
                                            </InputAdornment>)
                                    }}
                                //value={newRoom.classId}
                                //onChange={(event) => setNewRoom(prevState => ({ ...prevState, classId: event.target.value }))}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField id="outlined-basic" label="Quantity" variant="outlined" required
                                    size='small' fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <DialpadIcon color='primary' />
                                            </InputAdornment>)
                                    }}
                                //value={newRoom.className}
                                //onChange={(event) => setNewRoom(prevState => ({ ...prevState, className: event.target.value }))}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField id="outlined-basic" label="Description" variant="outlined" required
                                    size='small' fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <TextFieldsIcon color='primary' />
                                            </InputAdornment>)
                                    }}
                                //value={newRoom.classCapacity} InputLabelProps={{ shrink: true }}
                                //onChange={(event) => setNewRoom(prevState => ({ ...prevState, classCapacity: event.target.value }))}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    )
}

export default ItemsAdmin;