import {Outlet} from 'react-router-dom';

import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
