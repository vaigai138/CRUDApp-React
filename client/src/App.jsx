import axios from "axios";
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({ id: null, name: "", age: "", city: "" });

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search Function
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchText) ||
      user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  // Delete Function
  const handleDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete the user?");
    if (isConfirm) {
      try {
        const res = await axios.delete(`http://localhost:8000/users/${id}`);
        setUsers(res.data);
        setFilterUsers(res.data);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Add or Edit Record
  const handleAddRecord = () => {
    setUserData({ id: null, name: "", age: "", city: "" });
    setIsModelOpen(true);
  };

  const handleCloseModal = () => {
    setIsModelOpen(false);
  };

  // Handle Data Change
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      try {
        const res = await axios.patch(`http://localhost:8000/users/${userData.id}`, userData);
        setUsers(res.data);
        setFilterUsers(res.data);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      try {
        const res = await axios.post("http://localhost:8000/users", userData);
        setUsers(res.data);
        setFilterUsers(res.data);
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
    handleCloseModal();
  };

  // Handle Edit
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModelOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD Application</h3>
        <hr />
        <div className="input-search">
          <input type="search" placeholder="Search Here" onChange={handleSearch} />
          <button className="btn green" onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td><button className="btn green" onClick={() => handleUpdateRecord(user)}>Edit</button></td>
                <td><button className="btn red" onClick={() => handleDelete(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="model">
            <div className="model-content">
              <span className="close" onClick={handleCloseModal}>&times;</span>
              <h2>{userData.id ? "Edit User Record" : "Add User Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" name="name" id="name" value={userData.name} onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" name="age" id="age" value={userData.age} onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city" value={userData.city} onChange={handleData} />
              </div>
              <button className="btn green" onClick={handleSubmit}>
                {userData.id ? "Update Record" : "Add Record"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
