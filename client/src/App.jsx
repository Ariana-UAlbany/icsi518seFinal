import { useEffect, useState } from "react";

function App() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("happy");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editMood, setEditMood] = useState("happy");

  // READ
  useEffect(() => {
    fetch("/api/journals")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(console.error);
  }, []);

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mood }),
    });

    const newEntry = await res.json();
    setEntries([newEntry, ...entries]);
    setText("");
    setMood("happy");
  };

  // ENTER EDIT MODE
  const startEdit = (entry) => {
    setEditingId(entry._id);
    setEditText(entry.text);
    setEditMood(entry.mood);
  };

  // UPDATE
  const handleUpdate = async (id) => {
    const res = await fetch(`/api/journals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`/api/journals/${id}`, {
      method: "DELETE",
    });

    setEntries(entries.filter((entry) => entry._id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Digital Journal</h1>

      {/* CREATE FORM */}
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

      {/* JOURNAL LIST */}
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
    </div>
  );
}

export default App;