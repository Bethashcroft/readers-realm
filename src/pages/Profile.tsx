import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateProfile } from "../api/profile";
import type { ProfileResponse } from "../api/profile";
import { getUserBooks } from "../api/books";
import type { BookResponse } from "../api/books";
import BookCard from "../components/BookCard";
import "../styles/forms.css";
import "./Profile.css";

function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(username);
        setProfile(data);
        setDisplayName(data.displayName);
        setBio(data.bio);
        const userBooks = await getUserBooks(username);
        setBooks(userBooks);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleSave = async () => {
    setError("");

    try {
      const updated = await updateProfile({ displayName, bio });
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return <p>Profile not found</p>;
  }

  const isOwnProfile = user?.userName === profile.userName;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">{profile.displayName.charAt(0)}</div>
        <div className="profile-info">
          {editing ? (
            <div className="edit-profile-form">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
              {error && <p className="form-error">{error}</p>}
              <div className="edit-profile-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    setDisplayName(profile.displayName);
                    setBio(profile.bio);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1>{profile.displayName}</h1>
              <p className="profile-username">@{profile.userName}</p>
              <p className="profile-bio">{profile.bio || "No bio yet"}</p>
              {isOwnProfile && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-detail-card">
          <h2>Member Since</h2>
          <p>
            {new Date(profile.joinedDate).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <section className="profile-books">
        <h2>
          {isOwnProfile ? "My Books" : `${profile.displayName}'s Books`} (
          {books.length})
        </h2>
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        {books.length === 0 && <p>No books added yet.</p>}
      </section>
    </div>
  );
}

export default Profile;
