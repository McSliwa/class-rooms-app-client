import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Checkbox, Paper, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableFooter, TextField, InputAdornment
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { getApiConfig } from "../config/config.js";
import { useAuth0 } from "@auth0/auth0-react";

const configApi = getApiConfig();

function ItemsAdmin(props) {
    const [items, setItems] = useState([]);
    const [numSelected, setNumSelected] = useState(0);
    const [newItem, setNewItem] = useState({
        name: '', description: ''
    });

    const {
        getAccessTokenSilently,
    } = useAuth0();

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

    const createItem = async () => {
        try {
            const token = await getAccessTokenSilently();
            await Axios.post(configApi.items, {
                name: newItem.name,
                description: newItem.description
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Access-ConTableRowol-Allow-Origin': true,
                    }
                }).then((response) => {
                    setItems([...items, { ...response.data, selected: false }])
                }).catch((error) => {
                    console.log(error);
                });
            setNewItem({ name: '', description: '' });
        } catch (error) {
            console.log(error);
        }
    }

    const deleteItems = async () => {
        try {
            const token = await getAccessTokenSilently();
            items.filter(r => r.selected === true).forEach(rr => {
                Axios.delete(`${configApi.items}/${rr.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Access-ConTableRowol-Allow-Origin': true,
                    }
                }).then(() => {
                    getItemsData();
                }).catch((error) => {
                    console.log(error);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Paper elevation={24} sx={{ p: 2, flexGrow: 1, m: 1 }}>
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
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Nazwa</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Opis</TableCell>
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
                                    <TableCell width='200'>{item.name}</TableCell>
                                    <TableCell width='400'>{item.description}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow sx={{ visibility: 'visible' }}>
                                <TableCell padding="checkbox"></TableCell>
                                <TableCell>
                                    <TextField id="outlined-basic" label='Nazwa nowego przedmiotu' variant="outlined"
                                        required size='small' fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <TextFieldsIcon color='primary' />
                                                </InputAdornment>)
                                        }}
                                        value={newItem.name}
                                        onChange={(e) => setNewItem(prevState => ({ ...prevState, name: e.target.value }))}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField id="outlined-basic" label="Opis" variant="outlined"
                                        size='small' fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <TextFieldsIcon color='primary' />
                                                </InputAdornment>)
                                        }}
                                        value={newItem.description}
                                        onChange={(e) => setNewItem(prevState => ({ ...prevState, description: e.target.value }))}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper elevation={24} sx={{ m: 1, p: 2, pl: 10 }} align="left">
                <Button
                    variant="contained" color='primary'
                    sx={{ mr: 2, color: '#FFFFFF' }}
                    onClick={createItem}
                >
                    Dodaj
                </Button>
                <Button
                    variant="contained" color='secondary'
                    sx={{ mr: 2, color: '#FFFFFF' }}
                    onClick={deleteItems}
                >
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

export default ItemsAdmin;