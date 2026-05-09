import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [operation, setOperation] = useState("uppercase");

  const [tasks, setTasks] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch Tasks
  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTasks(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  // Load tasks automatically
  useEffect(() => {

    fetchTasks();

    // Auto refresh every 3 seconds
    const interval = setInterval(() => {
      fetchTasks();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // Create Task
  const createTask = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          inputText,
          operation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Task Created");

      // Clear input fields
      setTitle("");
      setInputText("");
      setOperation("uppercase");

      fetchTasks();

    } catch (error) {

      console.log(error);

      alert("Task Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <button onClick={handleLogout}>
        Logout
      </button>

      <h1>Dashboard</h1>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Enter Text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <br /><br />

      <select
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
      >
        <option value="uppercase">Uppercase</option>
        <option value="lowercase">Lowercase</option>
        <option value="reverse">Reverse</option>
        <option value="wordcount">Word Count</option>
        <option value="sentiment">Sentiment Analysis</option>
      </select>

      <br /><br />

      <button onClick={createTask}>
        Create Task
      </button>

      <hr />

      <h2>Tasks</h2>

      {
        tasks.map((task) => (

          <div
            key={task._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <h3>{task.title}</h3>

            <p><b>Input:</b> {task.inputText}</p>

            <p><b>Operation:</b> {task.operation}</p>

            <p><b>Status:</b> {task.status}</p>

            <p><b>Result:</b> {task.result}</p>
            <p><b>Logs:</b></p>

<ul>
  {task.logs?.map((log, index) => (
    <li key={index}>{log}</li>
  ))}
</ul>

          </div>
        ))
      }

    </div>
  );
}

export default Dashboard;