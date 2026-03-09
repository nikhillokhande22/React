import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useState, useEffect } from "react";

function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStudents([
        { name: "Nikhil", email: "nikhil@gmail.com", age: 22 },
        { name: "Rahul", email: "rahul@gmail.com", age: 21 },
        { name: "Om", email: "om@gmail.com", age: 23 },
        { name: "Divyam", email: "divyam@gmail.com", age: 22 }
       
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !age) {
      alert("All fields required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      alert("Invalid email");
      return;
    }

    const newStudent = { name, email, age };

    if (editingIndex !== null) {
      const updated = [...students];
      updated[editingIndex] = newStudent;
      setStudents(updated);
      setEditingIndex(null);
    } else {
      setStudents([...students, newStudent]);
    }

    setName("");
    setEmail("");
    setAge("");
  };

  const handleEdit = (index) => {
    const student = students[index];
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const updated = students.filter((_, i) => i !== index);
      setStudents(updated);
    }
  };

  // Excel Download Function
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(data, "students.xlsx");
  };

  if (loading) {
    return <h2>Loading students...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Students Table</h2>

      {/* Excel Download Button */}
      <button onClick={downloadExcel}>Download Excel</button>

      <br /><br />

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button type="submit">
          {editingIndex !== null ? "Update Student" : "Add Student"}
        </button>
      </form>

      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default App;