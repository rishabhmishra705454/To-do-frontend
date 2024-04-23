import React, { useState, useEffect } from "react";
import profile from "../images/user.png";
import EditTaskModal from "./EditTaskModal";
import '../App.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editedTask, setEditedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      let apiUrl = `http://localhost:4000/api/tasks?search=${searchQuery}&filter=${filter}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchQuery, filter]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    window.location.href = "/login";
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
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      // Refresh tasks after adding a new one
      fetchTasks();
      // Close modal after adding task
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      // Refresh tasks after updating status
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = (taskId, title, description) => {
    setEditedTask({ taskId, title, description });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveChanges = async (taskId, newTitle, newDescription) => {
    // Update task details functionality
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      // Refresh tasks after updating status
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
    handleCloseEditModal();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      // Refresh tasks after deleting
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (


    <div className="container-fluid">



      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Task Management App
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"></li>
            </ul>

            <div className="nav-item dropdown me-5">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={profile} height={40} width={40} alt="profile"></img>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <section>
      <div className="m-4">

          <div className="row">
            <div className="col-md-6">
              <form className="d-flex" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button className="btn btn-outline-success ms-2" type="submit">
                  Search
                </button>
              </form>
            </div>
            <div className="col-md-6">
              <button className="btn btn-primary rounded-3" onClick={() => setShowModal(true)}>
                Add New Task
              </button>
            </div>
          </div>
        </div>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : !tasks || tasks.length === 0 ? (
            <div>
               <p className="text-center ">No tasks available! Create new one...</p>
            </div>
          ) : (
            <div className="row m-5">
              {tasks.map((task) => (
                <div key={task._id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{task.title}</h5>
                      <p className="card-text">{task.description}</p>
                      <div className="dropdown mb-3">
                        <button className={`btn btn-${getStatusColor(task.status)} dropdown-toggle`} type="button" id={`dropdownMenuButton-${task._id}`} data-bs-toggle="dropdown" aria-expanded="false">
                          {task.status}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${task._id}`}>
                          <li><button className="dropdown-item" onClick={() => handleStatusChange(task._id, 'Pending')}>Pending</button></li>
                          <li><button className="dropdown-item" onClick={() => handleStatusChange(task._id, 'In Progress')}>In Progress</button></li>
                          <li><button className="dropdown-item" onClick={() => handleStatusChange(task._id, 'Done')}>Done</button></li>
                        </ul>
                      </div>
                      <small className="text-muted">Created at: {new Date(task.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="card-footer">
                      {/* Edit button */}
                      <button type="button" className="btn btn-primary btn-sm me-2" onClick={() => handleEditTask(task._id, task.title, task.description)}>
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      {/* Delete button */}
                      <button type="button" className="btn btn-danger btn-sm" onClick={()=>handleDeleteTask(task._id)}> 
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Modal for editing task */}
      {showEditModal && (
          <EditTaskModal
            taskId={editedTask.taskId}
            title={editedTask.title}
            description={editedTask.description}
            onClose={handleCloseEditModal}
            onSave={handleSaveChanges}
          />
        )}

      {/* Modal for adding new task */}
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
                  <label htmlFor="newTaskTitle">Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="newTaskTitle"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newTaskDescription">Description:</label>
                  <textarea
                    className="form-control"
                    id="newTaskDescription"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    style={{ minHeight: "100px" }}
                  ></textarea>
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

export default Dashboard;

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'in progress':
      return 'primary';
    case 'done':
      return 'success';
    default:
      return 'secondary';
  }
}
