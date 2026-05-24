import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/process",
        formData
      );

      setResults(res.data.results);
    } catch (err) {
      console.log(err);
      alert("Upload gagal");
    }
  };

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>Adobe Stock Metadata AI</h1>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <br />
      <br />

      <button onClick={handleUpload}>
        Process & Generate Metadata
      </button>

      <br />
      <br />

      {results.map((item, index) => (
        <div
          key={index}
          style={{
            background: "#0f172a",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <p>
            <b>File:</b> {item.filename}
          </p>

          <p>
            <b>Title:</b> {item.title}
          </p>

          <p>
            <b>Keywords:</b> {item.keywords}
          </p>

          <p>
            <b>Category:</b> {item.category}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;