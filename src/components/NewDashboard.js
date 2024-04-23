import React, { useState } from "react";
import "./Dashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HomeContent from "./HomeContent";

const NewDashboard = () => {
  // State to track which content should be displayed
  const [selectedContent, setSelectedContent] = useState("Home");
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editedTask, setEditedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [newDueDate, setDueDate] =useState(null);

  const renderContent = () => {
    switch (selectedContent) {
      case "Home":
        return <HomeContent />;
      
      default:
        return null;
    }
  };

   // Function to handle sidebar item click
   const handleSidebarItemClick = (content) => {
    setSelectedContent(content);
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          dueDate : newDueDate,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      // Refresh tasks after adding a new one
     // fetchTasks();
     
      // Close modal after adding task
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    window.location.href = "/login";
  };


 
  // Render content based on selectedContent state
 

  return (
    <div>
      <div className="sidebar">
        {/* Sidebar items with onClick handlers */}

        <h2 className="text-center text-danger my-4">To Do App</h2>

        <button className="btn btn-warning  rounded-5 btn-lg mx-auto d-block" onClick={() => setShowModal(true)}>
        <i className="fas fa-plus"></i> Add New Task
      </button>

        <a 
          className={selectedContent === "Home" ? "active" : ""  }
         
          onClick={() => handleSidebarItemClick("Home")}
        >
          Dashboard
        </a>
       

       <button className="btn btn-danger rounded-5 btn-lg mt-5 mx-auto d-block" onClick={handleLogout}><i className="fas fa-sign-out-alt"> </i>
 Logout</button>
       
      </div>

      <div className="content">
        {/* Render content based on selectedContent state */}
        {renderContent()}
      </div>


      {showModal && (
  <div className="modal-wrapper">
    <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content" style={{ padding: "20px", margin: "auto", maxWidth: "400px", backgroundColor: "#fff", borderRadius: "5px" }}>
        <span className="close" onClick={() => setShowModal(false)}>
          &times;
        </span>
        <h2 style={{ marginBottom: "20px" }}>Add New Task</h2>
        <form>
          <div className="form-group">
           
            <input
            placeholder="Enter Title"
              type="text"
              className="form-control"
              id="newTaskTitle"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
          </div>
          <div className="form-group mt-4">
           
            <textarea
            placeholder="Enter Description"
              className="form-control"
              id="newTaskDescription"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              style={{ minHeight: "100px" }}
            ></textarea>
          </div>
          <div className="form-group">
           
            <br />
            <DatePicker
              selected={newDueDate}
              placeholderText="Select due Date"
              onChange={(date) => setDueDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              id="dueDate"
            />
          </div>
          <button type="button" className="btn btn-primary mt-3" onClick={handleAddTask}>
            Add Task
          </button>
        </form>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default NewDashboard;
