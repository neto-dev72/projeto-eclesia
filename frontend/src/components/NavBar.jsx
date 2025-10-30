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
  Collapse,
  Divider,
  Menu,
  MenuItem
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
  AccountCircle as AccountCircleIcon,
  Build as BuildIcon,
  ExpandLess,
  ExpandMore,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import api from '../api/axiosConfig';
import logoBernet from "../assets/Logo-Bernet.png";
// ✅ Import do novo componente
import TopBarInfo from '../components/TopBarInfo';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Mobile submenus
  const [gestaoOpenMobile, setGestaoOpenMobile] = useState(false);
  const [relatoriosOpenMobile, setRelatoriosOpenMobile] = useState(false);
  const [financeiroOpenMobile, setFinanceiroOpenMobile] = useState(false);
  const [administrativoOpenMobile, setAdministrativoOpenMobile] = useState(false);
  const [userOpenMobile, setUserOpenMobile] = useState(false);

  // Desktop anchors
  const [gestaoAnchor, setGestaoAnchor] = useState(null);
  const [relatoriosAnchor, setRelatoriosAnchor] = useState(null);
  const [financeiroAnchor, setFinanceiroAnchor] = useState(null);
  const [administrativoAnchor, setAdministrativoAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  

  const gestaoSubmenus = [
    { path: '/gestao/membros', label: 'Gestão de Membros', icon: <PeopleIcon /> },
    { path: '/gestao/contribuicoes', label: 'Gestão de Contribuições', icon: <AttachMoneyIcon /> },
    { path: '/gestao/despesas', label: 'Gestão de Despesas', icon: <ReceiptIcon /> },
    { path: '/gestao/cargos', label: 'Gestão de Cargos', icon: <WorkIcon /> },
    { path: '/gestao/departamentos', label: 'Gestão de Departamentos', icon: <WorkIcon /> },
    { path: '/listaCultos', label: 'Registrar Culto', icon: <EventIcon /> },
  ];

  const relatoriosFinanceiros = [
    { path: '/gestao/relatorioContribuicoes', label: 'Relatório de Contribuições', icon: <AttachMoneyIcon /> },
    { path: '/gestao/relatorioDespesas', label: 'Relatório de Despesas', icon: <ReceiptIcon /> },
    { path: '/gestao/relatorioFinanceiroGeral', label: 'Relatório Financeiro Geral', icon: <AccountBalanceIcon /> }
  ];

  const relatoriosAdministrativos = [
    { path: '/gestao/RelatorioPresencas', label: 'Relatório de Presenças por Cultos', icon: <EventIcon /> },
    { path: '/gestao/relatorioSede', label: 'Relatórios Estatísticos dos Membros', icon: <PeopleIcon /> },
  ];

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('/usuario/status', { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.usuario) setUserRole(res.data.usuario.funcao);
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

  const handleOpenMenu = (setter) => (event) => setter(event.currentTarget);
  const handleCloseMenu = (setter) => () => setter(null);

  const drawerList = (
    <Box sx={{ width: 260, bgcolor: '#1e3a8a', height: '100%', color: 'white' }} role="presentation">
      <List>
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <Box component="img" src={logoBernet} alt="Logo Bernet" sx={{ height: 100 }} />
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.4)', mb: 1 }} />

        {/* Menus visitantes */}
        {!userRole && (
          <>
            <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
              <ListItemText primary="Início" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/sobre-equipe" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Sobre a Equipe" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/planos" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><AccountBalanceIcon /></ListItemIcon>
              <ListItemText primary="Planos" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/testemunhos" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
              <ListItemText primary="Testemunhos" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/contato" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><WorkIcon /></ListItemIcon>
              <ListItemText primary="Contato" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/servicos" onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><BuildIcon /></ListItemIcon>
              <ListItemText primary="Serviços" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/login" sx={{ bgcolor: '#ff9800', borderRadius: 2, my: 1 }} onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Login" sx={{ color: 'white', fontWeight: 'bold' }} />
            </ListItem>
            <ListItem button component={Link} to="/criar-usuarios" sx={{ bgcolor: '#0056d2', borderRadius: 2, my: 1 }} onClick={toggleDrawer(false)}>
              <ListItemIcon sx={{ color: 'white' }}><AccountBalanceIcon /></ListItemIcon>
              <ListItemText primary="Inscreva a Sua Igreja" sx={{ color: 'white', fontWeight: 'bold' }} />
            </ListItem>
          </>
        )}

        {/* Menus usuários logados */}
        {userRole && (
          <>
            {/* Super admin */}
            {userRole === 'super_admin' && (
              <>
                <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
                  <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Início" sx={{ color: 'white' }} />
                </ListItem>
                <ListItem button component={Link} to="/gestao/gestaoigrejas" onClick={toggleDrawer(false)}>
                  <ListItemIcon sx={{ color: 'white' }}><AccountBalanceIcon /></ListItemIcon>
                  <ListItemText primary="Gerir Igrejas" sx={{ color: 'white' }} />
                </ListItem>

                {/* Usuário */}
                <ListItem button onClick={() => setUserOpenMobile(!userOpenMobile)} sx={{ bgcolor: '#ff9800', borderRadius: 2, my: 1 }}>
                  <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
                  <ListItemText primary="Usuário" sx={{ color: 'white' }} />
                  {userOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                </ListItem>
                <Collapse in={userOpenMobile} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button component={Link} to="/perfil" sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
                      <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
                      <ListItemText primary="Perfil" sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button sx={{ pl: 4 }} onClick={() => { toggleDrawer(false)(); handleLogout(); }}>
                      <ListItemIcon sx={{ color: 'white' }}><LoginIcon /></ListItemIcon>
                      <ListItemText primary="Terminar Sessão" sx={{ color: 'white' }} />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}

            {/* Admin */}
            {userRole !== 'super_admin' && (
              <>
                <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
                  <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Início" sx={{ color: 'white' }} />
                </ListItem>

                <ListItem button component={Link} to="/dashboard" onClick={toggleDrawer(false)}>
                  <ListItemIcon sx={{ color: 'white' }}><BarChartIcon /></ListItemIcon>
                  <ListItemText primary="Dashboard" sx={{ color: 'white' }} />
                </ListItem>

                <ListItem button component={Link} to="/listaCultos" sx={{ bgcolor: '#ff4081', borderRadius: 2, my: 1 }}>
                  <ListItemIcon sx={{ color: 'white' }}><EventIcon /></ListItemIcon>
                  <ListItemText primary="Registrar Culto" sx={{ color: 'white', fontWeight: 'bold' }} />
                </ListItem>

                {/* Gestão */}
                <ListItem button onClick={() => setGestaoOpenMobile(!gestaoOpenMobile)}>
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
                <ListItem button onClick={() => setRelatoriosOpenMobile(!relatoriosOpenMobile)}>
                  <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
                  <ListItemText primary="Relatórios" sx={{ color: 'white' }} />
                  {relatoriosOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                </ListItem>
                <Collapse in={relatoriosOpenMobile} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button onClick={() => setFinanceiroOpenMobile(!financeiroOpenMobile)} sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}><AttachMoneyIcon /></ListItemIcon>
                      <ListItemText primary="Financeiro" sx={{ color: 'white' }} />
                      {financeiroOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                    </ListItem>
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

                    <ListItem button onClick={() => setAdministrativoOpenMobile(!administrativoOpenMobile)} sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
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

                {/* Usuário */}
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 1 }} />
                <ListItem button onClick={() => setUserOpenMobile(!userOpenMobile)} sx={{ bgcolor: '#ff9800', borderRadius: 2, my: 1 }}>
                  <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
                  <ListItemText primary="Usuário" sx={{ color: 'white' }} />
                  {userOpenMobile ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                </ListItem>
                <Collapse in={userOpenMobile} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button component={Link} to="/perfil" sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
                      <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
                      <ListItemText primary="Perfil" sx={{ color: 'white' }} />
                    </ListItem>
                    <ListItem button sx={{ pl: 4 }} onClick={() => { toggleDrawer(false)(); handleLogout(); }}>
                      <ListItemIcon sx={{ color: 'white' }}><LoginIcon /></ListItemIcon>
                      <ListItemText primary="Terminar Sessão" sx={{ color: 'white' }} />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
    
      <AppBar
  position="fixed"
  sx={{
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)',
    boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(6px)',
  }}
>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

<Box
  sx={{
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // sempre à esquerda
  }}
>
  <Box
    component="img"
    src={logoBernet}
    alt="Logo Bernet"
    sx={{
      height: { xs: 80, md: 120 }, // menor no mobile, maior no desktop
      width: 'auto',
      transition: '0.3s',
      '&:hover': { transform: 'scale(1.05)' },
    }}
  />
</Box>

          {/* Desktop Navbar */}
          {!isMobile && !userRole && (
            <>
              <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />} sx={{ mx: 1 }}>Início</Button>
              <Button color="inherit" component={Link} to="/sobre-equipe" startIcon={<PeopleIcon />} sx={{ mx: 1 }}>Sobre a Equipe</Button>
              <Button color="inherit" component={Link} to="/planos" startIcon={<AccountBalanceIcon />} sx={{ mx: 1 }}>Planos</Button>
              <Button color="inherit" component={Link} to="/testemunhos" startIcon={<AssessmentIcon />} sx={{ mx: 1 }}>Testemunhos</Button>
              <Button color="inherit" component={Link} to="/contato" startIcon={<WorkIcon />} sx={{ mx: 1 }}>Contato</Button>

              <Button color="inherit" component={Link} to="/servicos" startIcon={<BuildIcon />} sx={{ mx: 1 }}>Serviços</Button>
              
              <Button component={Link} to="/login" startIcon={<AccountCircleIcon />} sx={{ mx: 1, bgcolor: '#ff9800', color: 'white' }}>Login</Button>
              <Button component={Link} to="/criar-usuarios" startIcon={<AccountBalanceIcon />} sx={{ mx: 1, bgcolor: '#0056d2', color: 'white' }}>Inscreva  a Sua Igreja</Button>
            </>
          )}

          {!isMobile && userRole && (
            <>
              {userRole === 'super_admin' && (
                <>
                  <Button component={Link} to="/" startIcon={<HomeIcon />} sx={{ mx: 1, color: 'white' }}>Início</Button>
                  <Button component={Link} to="/gestao/gestaoigrejas" startIcon={<AccountBalanceIcon />} sx={{ mx: 1, bgcolor: '#0056d2', color: 'white' }}>Gerir Igrejas</Button>

                  {/* Usuário */}
                  <Button onClick={handleOpenMenu(setUserAnchor)} startIcon={<AccountCircleIcon />} sx={{ mx: 1, bgcolor: '#ff9800', color: 'white' }}>Usuário</Button>
                  <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={handleCloseMenu(setUserAnchor)} PaperProps={{ sx: { bgcolor: '#1e3a8a', color: 'white' } }}>
                    <MenuItem component={Link} to="/perfil" onClick={handleCloseMenu(setUserAnchor)} sx={{ color: 'white' }}>Perfil</MenuItem>
                    <MenuItem onClick={() => { handleLogout(); handleCloseMenu(setUserAnchor)(); }} sx={{ color: 'white' }}>Terminar Sessão</MenuItem>
                  </Menu>
                </>
              )}

              {userRole !== 'super_admin' && (
                <>
                  <Button component={Link} to="/listaCultos" startIcon={<EventIcon />} sx={{ mx: 1, bgcolor: '#ff4081', color: 'white' }}>Registrar Culto</Button>
                  <Button component={Link} to="/" startIcon={<HomeIcon />} sx={{ mx: 1, color: 'white' }}>Início</Button>
                  <Button component={Link} to="/dashboard" startIcon={<BarChartIcon />} sx={{ mx: 1, color: 'white' }}>Dashboard</Button>

                  {/* Gestão */}
                  <Button onClick={handleOpenMenu(setGestaoAnchor)} startIcon={<AccountBalanceIcon />} sx={{ mx: 1, color: 'white' }}>Gestão</Button>
                  <Menu anchorEl={gestaoAnchor} open={Boolean(gestaoAnchor)} onClose={handleCloseMenu(setGestaoAnchor)} PaperProps={{ sx: { bgcolor: '#1e3a8a', color: 'white' } }}>
                    {gestaoSubmenus.map((submenu) => (
                      <MenuItem component={Link} to={submenu.path} key={submenu.path} onClick={handleCloseMenu(setGestaoAnchor)} sx={{ color: 'white' }}>
                        {submenu.icon}&nbsp;{submenu.label}
                      </MenuItem>
                    ))}
                  </Menu>

                  {/* Relatórios */}
                  <Button onClick={handleOpenMenu(setRelatoriosAnchor)} startIcon={<AssessmentIcon />} sx={{ mx: 1, color: 'white' }}>Relatórios</Button>
                  <Menu anchorEl={relatoriosAnchor} open={Boolean(relatoriosAnchor)} onClose={handleCloseMenu(setRelatoriosAnchor)} PaperProps={{ sx: { bgcolor: '#1e3a8a', color: 'white' } }}>
                    <MenuItem onClick={handleOpenMenu(setFinanceiroAnchor)} sx={{ color: 'white' }}>Financeiro</MenuItem>
                    <MenuItem onClick={handleOpenMenu(setAdministrativoAnchor)} sx={{ color: 'white' }}>Administrativo</MenuItem>
                  </Menu>

                  <Menu anchorEl={financeiroAnchor} open={Boolean(financeiroAnchor)} onClose={handleCloseMenu(setFinanceiroAnchor)} PaperProps={{ sx: { bgcolor: '#1e3a8a', color: 'white' } }}>
                    {relatoriosFinanceiros.map((submenu) => (
                      <MenuItem component={Link} to={submenu.path} key={submenu.path} onClick={handleCloseMenu(setFinanceiroAnchor)} sx={{ color: 'white' }}>
                        {submenu.icon}&nbsp;{submenu.label}
                      </MenuItem>
                    ))}
                  </Menu>

                  <Menu anchorEl={administrativoAnchor} open={Boolean(administrativoAnchor)} onClose={handleCloseMenu(setAdministrativoAnchor)} PaperProps={{ sx: { bgcolor: '#1e3a8a', color: 'white' } }}>
                    {relatoriosAdministrativos.map((submenu) => (
                      <MenuItem component={Link} to={submenu.path} key={submenu.path} onClick={handleCloseMenu(setAdministrativoAnchor)} sx={{ color: 'white' }}>
                        {submenu.icon}&nbsp;{submenu.label}
                      </MenuItem>
                    ))}
                  </Menu>

                  {/* Usuário */}
                  <Button onClick={handleOpenMenu(setUserAnchor)} startIcon={<AccountCircleIcon />} sx={{ mx: 1, bgcolor: '#ff9800', color: 'white' }}>Usuário</Button>
                  <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={handleCloseMenu(setUserAnchor)} PaperProps={{ sx: { bgcolor: '#1e3a8a', color: 'white' } }}>
                    <MenuItem component={Link} to="/perfil" onClick={handleCloseMenu(setUserAnchor)} sx={{ color: 'white' }}>Perfil</MenuItem>
                    <MenuItem onClick={() => { handleLogout(); handleCloseMenu(setUserAnchor)(); }} sx={{ color: 'white' }}>Terminar Sessão</MenuItem>
                  </Menu>
                </>
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

