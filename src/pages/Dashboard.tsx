import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const actions = [
  {
    to: "/shelves",
    title: "My Shelves",
    text: "Organise everything you're reading, want to read, and have read.",
  },
  {
    to: "/browse",
    title: "Browse Nearby",
    text: "Discover books to borrow or buy from readers around you.",
  },
  {
    to: "/add-book",
    title: "Add a Book",
    text: "Put a new book on your shelves in seconds.",
  },
  {
    to: "/requests",
    title: "Requests",
    text: "See who wants your books and track your own requests.",
  },
];

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <p className="dashboard-eyebrow">Welcome back</p>
        <h1>{user?.displayName}</h1>
        <p className="dashboard-sub">Where would you like to go?</p>
      </header>

      <div className="dashboard-grid">
        {actions.map((action) => (
          <Link key={action.to} to={action.to} className="dashboard-card">
            <h2>{action.title}</h2>
            <p>{action.text}</p>
            <span className="dashboard-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
