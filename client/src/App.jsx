import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Projetos from './pages/Projetos.jsx';
import ProjetoDetalhe from './pages/ProjetoDetalhe.jsx';
import Contactos from './pages/Contactos.jsx';
import Login from './admin/Login.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminProjetos from './admin/AdminProjetos.jsx';
import ProjetoForm from './admin/ProjetoForm.jsx';
import AdminTextos from './admin/AdminTextos.jsx';
import AdminLeads from './admin/AdminLeads.jsx';
import { api } from './api.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SiteLayout() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="projetos/:slug" element={<ProjetoDetalhe />} />
          <Route path="contactos" element={<Contactos />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProjetos />} />
          <Route path="projetos" element={<AdminProjetos />} />
          <Route path="projetos/novo" element={<ProjetoForm />} />
          <Route path="projetos/:id" element={<ProjetoForm />} />
          <Route path="textos" element={<AdminTextos />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
