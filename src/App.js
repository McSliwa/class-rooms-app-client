import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import history from "./utils/history";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AppNavBar from './components/AppNavBar.js';
import { getRouterConfig } from "./config/config.js";
import Home from "./pages/Home";
import Classrooms from './pages/Classrooms';
import Reservations from './pages/Reservations';
import ClassroomsAdm from './pages/ClassroomsAdmin';
import ItemsAdm from './pages/ItemsAdmin';
import { getApiConfig } from "./config/config.js";
import CssBaseline from '@mui/material/CssBaseline';

const configRouter = getRouterConfig();
const configApi = getApiConfig();

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
  components: {
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#2E9FE6',
          fontSize: '22px'
        }
      }
    }
  }
});

function App() {
  const [types, setClassTypes] = useState([]);

  useEffect(() => {
    bindDictionary();
  }, []);

  const bindDictionary = async () => {
    const response = await Axios.get(configApi.types, {
      headers: {
        'Access-ConTableRowol-Allow-Origin': true,
      },
    });
    setClassTypes(response.data.map((data) => ({ label: data.typeName, value: data.id })));
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <CssBaseline />
          <AppNavBar />
          <Routes>
            <Route exact path={configRouter.aliasHome} element={<Home />} />
            <Route exact path={configRouter.aliasClassrooms} element={<Classrooms classTypes={types} />} />
            <Route exact path={configRouter.aliasReservations} element={<Reservations />} />
            <Route exact path={configRouter.aliasClassroomsAdm} element={<ClassroomsAdm classTypes={types} />} />
            <Route exact path={configRouter.aliasItemsAdm} element={<ItemsAdm />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;