import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error connecting to backend");
      });
  }, []);

  return (
    <div>
      <h1>React + Express Integration</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;