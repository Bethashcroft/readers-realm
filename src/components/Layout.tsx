import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
          {user ? (
            <>
              <li>
                <Link to={`/profile/${user.userName}`}>{user.displayName}</Link>
              </li>
              <li>
                <button className="nav-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
