// MainLayout.jsx
import React from 'react';
import Navbar from './NavBar';
import Home from '../pages/home';
import { useTheme, useMediaQuery } from '@mui/material';

export default function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const spacerHeight = isDesktop ? 128 : 112; // TopBarInfo + AppBar

  return (
    <>
      <Navbar />
      {/* Espaço para TopBarInfo + AppBar */}
      <div style={{ height: spacerHeight }} />
      <main>
        <Home />
      </main>
    </>
  );
}
