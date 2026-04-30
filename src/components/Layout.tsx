import { Outlet, Link } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          Readers Realm
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/shelves">My Shelves</Link>
          </li>
          <li>
            <Link to="/add-book">Add Book</Link>
          </li>
          <li>
            <Link to="/browse">Browse</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
