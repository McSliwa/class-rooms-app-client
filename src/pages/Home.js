import { Paper } from '@mui/material'
import React from 'react'

function Home() {
    return (
        <Paper elevation={24} sx={{ m: 2, p: 2 }} align="center">
            Witaj w aplikacji do wyszukiwania i zarządzania salami zajęciowymi.
        </Paper>
    )
}

export default Home
