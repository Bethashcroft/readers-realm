import { useState, useEffect } from "react";
import { Outlet, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyRequests } from "../api/borrow";
import "./Layout.css";

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setPendingCount(0);
      return;
    }

    const fetchCount = async () => {
      try {
        const requests = await getMyRequests();
        const incomingPending = requests.filter(
          (r) => r.toUserId === user.userId && r.status === "pending",
        );
        setPendingCount(incomingPending.length);
      } catch (err) {
        console.error("Failed to load request count:", err);
      }
    };

    fetchCount();
  }, [user, location.pathname]);

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
          {user ? (
            <>
              <li>
                <NavLink to="/shelves">My Shelves</NavLink>
              </li>
              <li>
                <NavLink to="/add-book">Add Book</NavLink>
              </li>
              <li>
                <NavLink to="/browse">Browse</NavLink>
              </li>
              <li>
                <NavLink to="/requests">
                  Requests
                  {pendingCount > 0 && (
                    <span className="nav-badge">{pendingCount}</span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to={`/profile/${user.userName}`}>
                  {user.displayName}
                </NavLink>
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
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register">Register</NavLink>
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
