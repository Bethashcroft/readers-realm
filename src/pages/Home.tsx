import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Your reading and social life - connected</h1>
        <p>
          Track your books, share reviews, borrow from readers nearby, and
          explore genre universes with a community that loves reading as much as
          you do.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h2>Organise Your Shelves</h2>
          <p>
            Currently Reading, TBR, DNF, Read. Plus custom shelves like
            Available to Borrow and For Sale.
          </p>
        </div>
        <div className="feature-card">
          <h2>Borrow &amp; Lend</h2>
          <p>
            Find readers within 5 miles who have the book you want. Manage trust
            lists and coordinate through in-app messaging.
          </p>
        </div>
        <div className="feature-card">
          <h2>Genre Universes</h2>
          <p>
            Dive into Fantasy, Romance, Sci-Fi and more. Each universe has
            sub-worlds to explore and discuss with fellow readers.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
