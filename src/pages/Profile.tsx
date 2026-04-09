import { useParams } from "react-router-dom";
import type { User } from "../types/user";
import "./Profile.css";

const mockUser: User = {
  id: "1",
  name: "Beth Ashcroft",
  email: "bethashcroft1998@gmail.com",
  bio: "Thriller reader. Dog person. Will always have my Kindle.",
  favouriteGenres: ["Thriller", "Mystery", "Romance"],
  joinedDate: "2026-04-09",
};

function Profile() {
  const { username } = useParams();

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">{mockUser.name.charAt(0)}</div>
        <div className="profile-info">
          <h1>{mockUser.name}</h1>
          <p className="profile-username">@{username}</p>
          <p className="profile-bio">{mockUser.bio}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-detail-card">
          <h2>Favourite Genres</h2>
          <div className="genre-tags">
            {mockUser.favouriteGenres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="profile-detail-card">
          <h2>Member Since</h2>
          <p>
            {new Date(mockUser.joinedDate).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
