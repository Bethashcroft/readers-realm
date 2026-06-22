import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
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
                <Link to="/requests">
                  Requests
                  {pendingCount > 0 && (
                    <span className="nav-badge">{pendingCount}</span>
                  )}
                </Link>
              </li>
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
