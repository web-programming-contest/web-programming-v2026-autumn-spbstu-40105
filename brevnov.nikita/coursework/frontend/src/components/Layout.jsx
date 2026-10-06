import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

// Общая обёртка для всех страниц — шапка и подвал реально одинаковы везде
// (4.1), а <Outlet /> подставляет содержимое конкретной страницы,
// определённой в роутере (App.jsx).
export function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
