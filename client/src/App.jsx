import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function App() {
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
    const res = await fetch("http://localhost:8080/auth/google", {
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
  // Fetch user specific journal entries (READ)
  // -----------------------------
  useEffect(() => {
  if (!token) return;

  fetch("/api/journals", {
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

    const res = await fetch("/api/journals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, mood }),
    });

    const newEntry = await res.json();
    setEntries([newEntry, ...entries]);
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
    const res = await fetch(`/api/journals/${id}`, {
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
    await fetch(`/api/journals/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEntries(entries.filter((entry) => entry._id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
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

      {user && <p>Welcome, {user.name} 👋</p>}

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

      {/* -----------------------------
           Journal List
         ----------------------------- */}
      <ul>
        {entries.map((entry) => (
          <li key={entry._id} style={{ marginBottom: "1rem" }}>
            {editingId === entry._id ? (
              <>
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

                <br />
                <button onClick={() => handleUpdate(entry._id)}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <strong>{entry.mood}</strong>: {entry.text}
                <br />
                <button onClick={() => startEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry._id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      </>)}
    </div>
  );
}

export default App;