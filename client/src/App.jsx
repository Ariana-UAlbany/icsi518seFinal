import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import JournalCalendar from "./components/JournalCalendar";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  };

  // -----------------------------
  // Auth state
  // -----------------------------
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  // -----------------------------
  // Journal state
  // -----------------------------
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("happy");

  // -----------------------------
  // Edit state
  // -----------------------------
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editMood, setEditMood] = useState("happy");

  // -----------------------------
  // Google Login handler
  // -----------------------------
  const handleLogin = async (credentialResponse) => {
    //const res = await fetch("http://localhost:8080/auth/google", {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credential: credentialResponse.credential,
      }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      console.log("Logged in user:", data.user);
    } else {
      console.error("Login failed", data);
    }
  };

  // -----------------------------
  // Logout handler
  // -----------------------------
  const handleLogout = () => {
  localStorage.removeItem("token");
  setUser(null);
  setEntries([]);
};


//bugifx login
useEffect(() => {
  if (!token) return;

  fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    })
    .then((user) => setUser(user))
    .catch(() => {
      localStorage.removeItem("token");
      setUser(null);
    });
}, [token]);



  // -----------------------------
  // Fetch user specific journal entries (READ)
  // -----------------------------
  useEffect(() => {
  if (!token) return;

  fetch(`${API_URL}/api/journals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => setEntries(data))
    .catch(console.error);
}, [token]);

  // -----------------------------
  // Create journal entry (CREATE)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/journals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, mood }),
    });

    const newEntry = await res.json();
    setEntries(prev => [newEntry, ...prev]);
    setText("");
    setMood("happy");
  };

  // -----------------------------
  // Enter edit mode
  // -----------------------------
  const startEdit = (entry) => {
    setEditingId(entry._id);
    setEditText(entry.text);
    setEditMood(entry.mood);
  };

  // -----------------------------
  // Update journal entry (UPDATE)
  // -----------------------------
  const handleUpdate = async (id) => {
    const res = await fetch(`${API_URL}/api/journals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: editText,
        mood: editMood,
      }),
    });

    const updatedEntry = await res.json();

    setEntries(
      entries.map((entry) =>
        entry._id === id ? updatedEntry : entry
      )
    );

    setEditingId(null);
  };

  // -----------------------------
  // Delete journal entry (DELETE)
  // -----------------------------
  const handleDelete = async (id) => {
  // Add visual removal first
  setEntries((prev) =>
    prev.map((e) =>
      e._id === id ? { ...e, _removing: true } : e
    )
  );

  // Wait for animation
  setTimeout(async () => {
    await fetch(`${API_URL}/api/journals/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEntries((prev) => prev.filter((e) => e._id !== id));
  }, 250);
};

  return (
    <div className="app-container">
      <h1>MoodLog – Digital Journal & Mood Tracker</h1>

      {/* -----------------------------
           Google Login
         ----------------------------- */}
      {!user && (
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => console.log("Login Failed")}
        />
      )}

  {user && (
  <div className="welcome-section">
    <div>
      <h2>Hello, {user.name} 👋</h2>
      <p className="welcome-subtitle">
        Take a moment to reflect and log how you’re feeling today.
      </p>
    </div>

    <button className="secondary" onClick={handleLogout}>
      Logout
    </button>
  </div>
)}

      <hr />
      {/*Journal UI only visible when logged in*/}
      {user && (<>
      {/* -----------------------------
           Create Form
         ----------------------------- */}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your journal entry..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <br />

        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="neutral">Neutral</option>
          <option value="stressed">Stressed</option>
          <option value="excited">Excited</option>
        </select>

        <br />
        <button type="submit">Add Entry</button>
      </form>

      <hr />

        <JournalCalendar
  entries={entries}
  selectedDate={selectedDate}
  onSelect={setSelectedDate}
/>

      <hr />


      {/* -----------------------------
           Journal List
         ----------------------------- */}
      <ul>
        {entries
  .filter(entry => {
    if (!selectedDate) return true
    const entryDate = new Date(entry.createdAt)
    return entryDate.toDateString() === selectedDate.toDateString()
  })
  .map(entry =>  (
    // existing card UI here
  
          <li key={entry._id} className={`journal-card ${entry._removing ? "removing" : ""}`}>
            {editingId === entry._id ? (
              <div key={`edit-${entry._id}`} className="edit-panel">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <br />

                <select
                  value={editMood}
                  onChange={(e) => setEditMood(e.target.value)}
                >
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="neutral">Neutral</option>
                  <option value="stressed">Stressed</option>
                  <option value="excited">Excited</option>
                </select>

                <div className="edit-actions">
                <button onClick={() => handleUpdate(entry._id)}>
                  Save
                </button>
                <button className="secondary" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
              </div>
            ) : (
              <div key={`view-${entry._id}`} className="view-panel">
                {/*<strong>{entry.mood}</strong>: {entry.text}*/}
                <span className={`mood-badge mood-${entry.mood}`}>
                  {entry.mood}
                </span>
                <p className="journal-text">{entry.text}</p>
                <div className="sentiment"> {/*Uses external API */}
                {entry.sentiment?.label === "POSITIVE" && "😊 Positive"}
                 {entry.sentiment?.label === "NEGATIVE" && "😔 Negative"}
                 {entry.sentiment?.label === "UNKNOWN" && "😐 Neutral / Unclear"}
                </div>  

                <p className="journal-timestamp">
                  {entry.updatedAt !== entry.createdAt
                  ? `Updated ${formatDateTime(entry.updatedAt)}`
                  : `Created ${formatDateTime(entry.createdAt)}`}
                </p>
                <div className="entry-actions">
                <button onClick={() => startEdit(entry)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(entry._id)}>
                  Delete
                </button>
              </div>
              </div>
            )}
          </li>
        )
        )}
      </ul>
      </>)}
    </div>
  );
}

export default App;