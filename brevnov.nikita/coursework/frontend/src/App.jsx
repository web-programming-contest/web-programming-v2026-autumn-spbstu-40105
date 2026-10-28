import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { Layout } from './components/Layout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';

// Раздел 4.2 методички: неавторизованному пользователю доступны только
// главная и логин, каталог и корзина — только вошедшему. Поэтому именно
// эти два роута обёрнуты в <ProtectedRoute>, а Home и Login — нет.
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/catalog"
                element={
                  <ProtectedRoute>
                    <CatalogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
