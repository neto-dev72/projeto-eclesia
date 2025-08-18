import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  Menu,
  MenuItem,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WorkIcon from '@mui/icons-material/Work'; // Ícone para Gestão de Cargos
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const menuItems = [
  { path: '/', label: 'Início', icon: <HomeIcon /> },
  { path: '/membros', label: 'Membros', icon: <PeopleIcon /> },
  { path: '/ministerios', label: 'Ministérios', icon: <GroupsIcon /> },
  { path: '/eventos', label: 'Eventos', icon: <EventIcon /> },
  { path: '/gestao/relatorioContribuicoes', label: 'Relatórios', icon: <AssessmentIcon /> },
  { path: '/criar-usuarios', label: 'Criar Usuários', icon: <PersonAddIcon /> },
  { path: '/login', label: 'Login', icon: <LoginIcon /> },
];

const gestaoSubmenus = [
  {
    path: '/gestao/membros',
    label: 'Gestão de Membros',
    icon: <PeopleIcon />,
  },
  {
    path: '/gestao/contribuicoes',
    label: 'G.. de Contribuições',
    icon: <AttachMoneyIcon />,
  },
  {
    path: '/gestao/despesas',
    label: 'Gestão de Despesas',
    icon: <ReceiptIcon />,
  },
  {
    path: '/gestao/cargos',
    label: 'Gestão de Cargos',
    icon: <WorkIcon />,
  },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gestaoAnchorEl, setGestaoAnchorEl] = useState(null);
  const [gestaoOpenMobile, setGestaoOpenMobile] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Abrir menu Gestão no desktop
  const handleGestaoMenuOpen = (event) => {
    setGestaoAnchorEl(event.currentTarget);
  };

  const handleGestaoMenuClose = () => {
    setGestaoAnchorEl(null);
  };

  // Toggle submenus no mobile
  const handleGestaoClickMobile = () => {
    setGestaoOpenMobile(!gestaoOpenMobile);
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}

        {/* Gestão no mobile com submenus */}
        <ListItem button onClick={handleGestaoClickMobile}>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Gestão" />
          {gestaoOpenMobile ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={gestaoOpenMobile} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {gestaoSubmenus.map((submenu) => (
              <ListItem
                button
                component={Link}
                to={submenu.path}
                key={submenu.path}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>{submenu.icon}</ListItemIcon>
                <ListItemText primary={submenu.label} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Gestão de Igrejas
          </Typography>

          {/* Menu desktop */}
          {!isMobile && (
            <>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ textTransform: 'none', mx: 1 }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Menu Gestão Desktop */}
              <Button
                color="inherit"
                startIcon={<AccountBalanceIcon />}
                onClick={handleGestaoMenuOpen}
                sx={{ textTransform: 'none', mx: 1 }}
              >
                Gestão
              </Button>
              <Menu
                anchorEl={gestaoAnchorEl}
                open={Boolean(gestaoAnchorEl)}
                onClose={handleGestaoMenuClose}
              >
                {gestaoSubmenus.map((submenu) => (
                  <MenuItem
                    key={submenu.path}
                    component={Link}
                    to={submenu.path}
                    onClick={handleGestaoMenuClose}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {submenu.icon}
                    </ListItemIcon>
                    {submenu.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* para empurrar conteúdo */}

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
}
