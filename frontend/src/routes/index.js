import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from '../components/NavBar';

// Importa todas as páginas
import Home from '../pages/home';
import Membros from '../pages/membros';
import Ministerios from '../pages/ministerios';

import Relatorios from '../pages/relatorios';

import Login from '../pages/login';

import GestaoMembros from '../pages/GestaoMembros';

import CriarUsuarios from '../pages/criarUsuario';


import GestaoCargos from '../pages/GestaoCargos';



import GestaoContribuicoes from '../pages/GestaoContribuicoes';



import GestaoDespesas from '../pages/GestaoDespesas';



import RelatorioContribuicoes from '../pages/Relatrios/RelatorioContribuicoes';

export default function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/membros" element={<Membros />} />
        <Route path="/ministerios" element={<Ministerios />} />
        <Route path="/criar-usuarios" element={<CriarUsuarios />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gestao/membros" element={<GestaoMembros />} />
       <Route path="/gestao/cargos" element={<GestaoCargos />} />
        <Route path="/gestao/contribuicoes" element={<GestaoContribuicoes />} />
        <Route path="/gestao/despesas" element={<GestaoDespesas />} />
        <Route path="/gestao/relatorioContribuicoes" element={<RelatorioContribuicoes />} />

      </Routes>
    </Router>
  );
}
