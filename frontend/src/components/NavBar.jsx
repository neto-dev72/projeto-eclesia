// pages/Navbar.jsx
import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Login as LoginIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Work as WorkIcon,
  ExitToApp as ExitToAppIcon,
  ExpandLess,
  ExpandMore,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import api from '../api/axiosConfig';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Desktop
  const [gestaoAnchorEl, setGestaoAnchorEl] = useState(null);
  const [relatoriosAnchorEl, setRelatoriosAnchorEl] = useState(null);
  const [financeiroAnchorEl, setFinanceiroAnchorEl] = useState(null);
  const [administrativoAnchorEl, setAdministrativoAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  // Mobile
  const [gestaoOpenMobile, setGestaoOpenMobile] = useState(false);
  const [relatoriosOpenMobile, setRelatoriosOpenMobile] = useState(false);
  const [financeiroOpenMobile, setFinanceiroOpenMobile] = useState(false);
  const [administrativoOpenMobile, setAdministrativoOpenMobile] = useState(false);
  const [userOpenMobile, setUserOpenMobile] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
  const handleMenuClose = (setter) => () => setter(null);
  const toggleMobile = (setter) => () => setter((prev) => !prev);

  // Submenus de Gestão
  const gestaoSubmenus = [
    { path: '/gestao/membros', label: 'Gestão de Membros', icon: <PeopleIcon /> },
    { path: '/gestao/contribuicoes', label: 'Gestão de Contribuições', icon: <AttachMoneyIcon /> },
    { path: '/gestao/despesas', label: 'Gestão de Despesas', icon: <ReceiptIcon /> },
    { path: '/gestao/cargos', label: 'Gestão de Cargos', icon: <WorkIcon /> },
    { path: '/gestao/departamentos', label: 'Gestão de Departamentos', icon: <WorkIcon /> },
    { path: '/listaCultos', label: 'Registro de Cultos', icon: <EventIcon /> },
  ];

  const relatoriosFinanceiros = [
    { path: '/gestao/relatorioContribuicoes', label: 'Relatório de Contribuições', icon: <AttachMoneyIcon /> },
    { path: '/gestao/relatorioDespesas', label: 'Relatório de Despesas', icon: <ReceiptIcon /> },
    { path: '/gestao/relatorioFinanceiroGeral', label: 'Relatório Financeiro Geral', icon: <AccountBalanceIcon /> },
    { path: '/gestao/relatorioMembros', label: 'Relatório Financeiro de Membros', icon: <PeopleIcon /> },
  ];

  const relatoriosAdministrativos = [
    { path: '/gestao/RelatorioPresencas', label: 'Relatório de Presenças por Cultos', icon: <EventIcon /> },
    { path: '/gestao/relatorioEstatistico', label: 'Relatórios Estatísticos dos Membros', icon: <PeopleIcon /> },
  ];

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await api.get('/usuario/status', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.usuario) {
          setUserRole(res.data.usuario.funcao);
        }
      } catch (err) {
        console.error('Erro ao buscar função do usuário:', err);
      }
    };
    fetchUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    navigate('/login');
  };

  const drawerList = (
    <Box sx={{ width: 260, bgcolor: '#1976d2', height: '100%', color: 'white' }} role="presentation">
      <List>
        <ListItem
          button
          component={Link}
          to="/listaCultos"
          onClick={toggleDrawer(false)}
          sx={{
            mb: 1,
            bgcolor: '#ff9800',
            borderRadius: 2,
            '&:hover': { bgcolor: '#ffb74d', transform: 'scale(1.05)', transition: 'all 0.3s ease' }
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}><EventIcon /></ListItemIcon>
          <ListItemText primary="Registrar Dados" sx={{ color: 'white', fontWeight: 'bold' }} />
        </ListItem>

        <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Início" sx={{ color: 'white' }} />
        </ListItem>

        {userRole && (
          <>
            {userRole === 'super_admin' && (
              <ListItem button component={Link} to="/gestao/gestaoigrejas" onClick={toggleDrawer(false)}>
                <ListItemIcon sx={{ color: 'white' }}><AccountBalanceIcon /></ListItemIcon>
                <ListItemText primary="Gerir Igrejas" sx={{ color: 'white' }} />
              </ListItem>
            )}

            {userRole !== 'super_admin' && (
              <>
                {/* Gestão */}
                <ListItem button onClick={toggleMobile(setGestaoOpenMobile)}>
                  <ListItemIcon sx={{ color: 'white' }}><AccountBalanceIcon /></ListItemIcon>
                  <ListItemText primary="Gestão" sx={{ color: 'white' }} />
                  {gestaoOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                </ListItem>
                <Collapse in={gestaoOpenMobile} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {gestaoSubmenus.map((submenu) => (
                      <ListItem button component={Link} to={submenu.path} key={submenu.path} sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
                        <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                        <ListItemText primary={submenu.label} sx={{ color: 'white' }} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>

                {/* Relatórios */}
                <ListItem button onClick={toggleMobile(setRelatoriosOpenMobile)}>
                  <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
                  <ListItemText primary="Relatórios" sx={{ color: 'white' }} />
                  {relatoriosOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                </ListItem>
                <Collapse in={relatoriosOpenMobile} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {userRole === 'admin' && (
                      <ListItem button onClick={toggleMobile(setFinanceiroOpenMobile)} sx={{ pl: 4 }}>
                        <ListItemText primary="Financeiro" sx={{ color: 'white' }} />
                        {financeiroOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                      </ListItem>
                    )}
                    <Collapse in={financeiroOpenMobile} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {relatoriosFinanceiros.map((submenu) => (
                          <ListItem button component={Link} to={submenu.path} key={submenu.path} sx={{ pl: 8 }} onClick={toggleDrawer(false)}>
                            <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                            <ListItemText primary={submenu.label} sx={{ color: 'white' }} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>

                    <ListItem button onClick={toggleMobile(setAdministrativoOpenMobile)} sx={{ pl: 4 }}>
                      <ListItemText primary="Administrativo" sx={{ color: 'white' }} />
                      {administrativoOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                    </ListItem>
                    <Collapse in={administrativoOpenMobile} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {relatoriosAdministrativos.map((submenu) => (
                          <ListItem button component={Link} to={submenu.path} key={submenu.path} sx={{ pl: 8 }} onClick={toggleDrawer(false)}>
                            <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                            <ListItemText primary={submenu.label} sx={{ color: 'white' }} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </List>
                </Collapse>
              </>
            )}

            <Divider sx={{ bgcolor: 'white', my: 1 }} />

            {/* Usuário */}
            <ListItem button onClick={toggleMobile(setUserOpenMobile)}>
              <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Usuário" sx={{ color: 'white' }} />
              {userOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
            </ListItem>
            <Collapse in={userOpenMobile} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button component={Link} to="/perfil" sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
                  <ListItemText primary="Perfil" sx={{ color: 'white' }} />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => { toggleDrawer(false)(); handleLogout(); }}>
                  <ListItemText primary="Terminar Sessão" sx={{ color: 'white' }} />
                </ListItem>
              </List>
            </Collapse>
          </>
        )}

        {!userRole && (
          <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
            <ListItemIcon sx={{ color: 'white' }}><LoginIcon /></ListItemIcon>
            <ListItemText primary="Login" sx={{ color: 'white' }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: 'linear-gradient(135deg, #6b78ff 0%, #2575fc 100%)', boxShadow: '0 5px 20px rgba(0,0,0,0.4)' }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', textShadow: '2px 2px 5px rgba(0,0,0,0.3)' }}>
            Gestão de Igrejas
          </Typography>

          {!isMobile && (
            <>
              <Button
                component={Link}
                to="/listaCultos"
                startIcon={<EventIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  mx: 1,
                  bgcolor: '#ff5722',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#ff7043', transform: 'scale(1.08)', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }
                }}
              >
                Dados Culto
              </Button>

              <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />} sx={{ textTransform: 'none', mx: 1 }}>
                Início
              </Button>

              {userRole ? (
                <>
                  {userRole === 'super_admin' && (
                    <Button color="inherit" component={Link} to="/gestao/gestaoigrejas" sx={{ textTransform: 'none', mx: 1 }}>
                      Gerir Igrejas
                    </Button>
                  )}

                  {userRole !== 'super_admin' && (
                    <>
                      <Button color="inherit" startIcon={<AccountBalanceIcon />} onClick={handleMenuOpen(setGestaoAnchorEl)} sx={{ textTransform: 'none', mx: 1 }}>
                        Gestão
                      </Button>
                      <Menu anchorEl={gestaoAnchorEl} open={Boolean(gestaoAnchorEl)} onClose={handleMenuClose(setGestaoAnchorEl)}>
                        {gestaoSubmenus.map((submenu) => (
                          <MenuItem key={submenu.path} component={Link} to={submenu.path} onClick={handleMenuClose(setGestaoAnchorEl)}>
                            <ListItemIcon sx={{ minWidth: 32 }}>{submenu.icon}</ListItemIcon>
                            {submenu.label}
                          </MenuItem>
                        ))}
                      </Menu>

                      <Button color="inherit" startIcon={<AssessmentIcon />} onClick={handleMenuOpen(setRelatoriosAnchorEl)} sx={{ textTransform: 'none', mx: 1 }}>
                        Relatórios
                      </Button>
                      <Menu anchorEl={relatoriosAnchorEl} open={Boolean(relatoriosAnchorEl)} onClose={handleMenuClose(setRelatoriosAnchorEl)}>
                        {userRole === 'admin' && (
                          <MenuItem onClick={handleMenuOpen(setFinanceiroAnchorEl)}>
                            <ListItemIcon sx={{ minWidth: 32 }}><AttachMoneyIcon /></ListItemIcon>
                            Financeiro {financeiroAnchorEl ? <ExpandLess /> : <ExpandMore />}
                          </MenuItem>
                        )}
                        <Menu anchorEl={financeiroAnchorEl} open={Boolean(financeiroAnchorEl)} onClose={handleMenuClose(setFinanceiroAnchorEl)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                          {relatoriosFinanceiros.map((submenu) => (
                            <MenuItem key={submenu.path} component={Link} to={submenu.path} onClick={handleMenuClose(setFinanceiroAnchorEl)}>
                              <ListItemIcon sx={{ minWidth: 32 }}>{submenu.icon}</ListItemIcon>
                              {submenu.label}
                            </MenuItem>
                          ))}
                        </Menu>

                        <MenuItem onClick={handleMenuOpen(setAdministrativoAnchorEl)}>
                          <ListItemIcon sx={{ minWidth: 32 }}><AssessmentIcon /></ListItemIcon>
                          Administrativo {administrativoAnchorEl ? <ExpandLess /> : <ExpandMore />}
                        </MenuItem>
                        <Menu anchorEl={administrativoAnchorEl} open={Boolean(administrativoAnchorEl)} onClose={handleMenuClose(setAdministrativoAnchorEl)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                          {relatoriosAdministrativos.map((submenu) => (
                            <MenuItem key={submenu.path} component={Link} to={submenu.path} onClick={handleMenuClose(setAdministrativoAnchorEl)}>
                              <ListItemIcon sx={{ minWidth: 32 }}>{submenu.icon}</ListItemIcon>
                              {submenu.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Menu>
                    </>
                  )}

                  <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={handleMenuOpen(setUserAnchorEl)} sx={{ textTransform: 'none', mx: 1 }}>
                    Usuário
                  </Button>
                  <Menu anchorEl={userAnchorEl} open={Boolean(userAnchorEl)} onClose={handleMenuClose(setUserAnchorEl)}>
                    <MenuItem component={Link} to="/perfil" onClick={handleMenuClose(setUserAnchorEl)}>Perfil</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(setUserAnchorEl)(); handleLogout(); }}>Terminar Sessão</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />} sx={{ textTransform: 'none', mx: 1 }}>
                  Login
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar />
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
}
