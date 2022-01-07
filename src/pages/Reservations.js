import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Button, Checkbox, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Grid, FormControlLabel
} from '@mui/material';
import { getApiConfig } from "../config/config.js";
import { useAuth0 } from "@auth0/auth0-react";

const configApi = getApiConfig();

function Reservations(props) {
    const [reservations, setReservations] = useState([]);
    const [numSelected, setNumSelected] = useState(0);
    const [onlyMyRes, setOnlyMyRes] = useState();


    useEffect(() => {
        getReservationsData();
    }, []);

    const {
        getAccessTokenSilently,
    } = useAuth0();

    const getReservationsData = async () => {
        const response = await Axios.get(configApi.reservations, {
            headers: {
                'Access-ConTableRowol-Allow-Origin': true,
            },
        });
        setReservations(response.data.map((data) => ({ ...data, selected: false })));
    }

    const getReservationsUserOnlyData = async () => {
        try {
            const token = await getAccessTokenSilently();
            await Axios.get(configApi.reservationsUserOnly, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Access-ConTableRowol-Allow-Origin': true,
                }
            }).then((response) => {
                setReservations(response.data.map((data) => ({ ...data, selected: false })));
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setNumSelected(reservations.length);
            setReservations(reservations.map((room) => ({ ...room, selected: true })));
        }
        else {
            setNumSelected(0);
            setReservations(reservations.map((room) => ({ ...room, selected: false })));
        }
    }

    const handleSelectClick = (event, room) => {
        room.selected = event.target.checked;
        setReservations([...reservations]);
        if (event.target.checked) {
            setNumSelected(numSelected + 1);
        }
        else {
            setNumSelected(numSelected - 1);
        }
    }

    const handleCheckUserOnly = (e) => {
        setOnlyMyRes(e.target.checked);
        if (e.target.checked) {
            getReservationsUserOnlyData();
        }
        else {
            getReservationsData();
        }
    }

    const deleteReservation = async () => {
        try {
            const token = await getAccessTokenSilently();
            reservations.filter(r => r.selected === true).forEach(rr => {
                Axios.delete(`${configApi.reservations}/${rr.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Access-ConTableRowol-Allow-Origin': true,
                    }
                }).then(() => {
                    getReservationsUserOnlyData();
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Paper elevation={24} sx={{ p: 2, flexGrow: 1, m: 1 }}>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <FormControlLabel label="Moje rezerwacje"
                            control={
                                <Checkbox checked={onlyMyRes}
                                    onChange={handleCheckUserOnly}
                                    color='primary'
                                />
                            } />
                    </Grid>
                    <Grid item md={3}>
                    </Grid>
                </Grid>
            </Paper>
            <Paper elevation={24} sx={{ p: 2, flexGrow: 1, m: 1 }}>
                <TableContainer component={Paper}>
                    <Table checboxselection="true" sx={{ minWidTableCell: 500 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary"
                                        indeterminate={numSelected > 0 && numSelected < reservations.length}
                                        checked={reservations.length > 0 && numSelected === reservations.length}
                                        onChange={handleSelectAllClick} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Numer pomieszczenia</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Rozpoczęcie</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>Zakończenie</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map(reservation => <TableRow key={reservation.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox color="secondary"
                                        checked={reservation.selected}
                                        onChange={(e) => { handleSelectClick(e, reservation); }} />
                                </TableCell>
                                <TableCell width='300'>{reservation.classroomId}</TableCell>
                                <TableCell>{reservation.start}</TableCell>
                                <TableCell width='300'>{reservation.end}</TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper elevation={24} sx={{ m: 1, p: 2 }} align="left">
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <Button
                            variant="contained" color='secondary'
                            sx={{ mr: 2, color: '#FFFFFF' }}
                            onClick={deleteReservation}
                            disabled={!onlyMyRes}
                        >
                            {!onlyMyRes ? 'Zaznacz "Moje rezerwacje", aby usunąć.' : 'Usuń'}
                        </Button>
                    </Grid>
                    <Grid item md={3}>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}

export default Reservations
