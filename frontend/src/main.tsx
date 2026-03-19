import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import App from './App';
import { AdminRoutes } from './pages/admin/AdminRoutes';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/produto/:id" element={<ProductDetailsPage />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </AdminAuthProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
