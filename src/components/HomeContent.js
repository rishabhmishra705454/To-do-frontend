import { useState, useEffect } from "react";
import React from "react";
import GirlImg from "../images/girl.png";

const fullName = localStorage.getItem("fullName");

const HomeContent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editedTask, setEditedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");


  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      // Refresh tasks after updating status
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      // Refresh tasks after deleting
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = (task) => {
    setEditedTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setShowEditModal(true);
  };

  const saveEditedTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tasks/${editedTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editedTitle,
            description: editedDescription,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      // Refresh tasks after updating
      fetchTasks();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <h6 className="ms-2 mt-2">Dashboard</h6>
      </div>
      <div class="m-5 p-4 bg-light text-danger rounded">
        <img src={GirlImg} class="float-end img-fluid" />
        <h1>Welcome {fullName} !</h1>
        <p>What do you want to do today?</p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <form className="d-flex" role="search">
            <input
              className="form-control me-2 rounded-5"
              type="search"
              placeholder="Search Tasks     "
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="form-select rounded-5"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button
              className="btn btn-outline-danger rounded-5 ms-2"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : !tasks || tasks.length === 0 ? (
          <div>
            <p className="text-center ">
              No tasks available! Create new one...
            </p>
          </div>
        ) : (
          <div className="row m-2">
            <h6 className="my-3">All Tasks</h6>
            {tasks.map((task) => {
              const createdAt = new Date(task.createdAt);
              const currentTime = new Date();
              const timeDifference = currentTime - createdAt;
              let timeAgo;

              // Calculate time ago
              if (timeDifference < 60000) {
                timeAgo = "just now";
              } else if (timeDifference < 3600000) {
                const minutes = Math.floor(timeDifference / 60000);
                timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
              } else {
                const hours = Math.floor(timeDifference / 3600000);
                timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
              }

              return (
                <div key={task._id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <p className="h5 mb-0">{task.title}</p>
                      <small className="text-muted mb-5">
                        Created {timeAgo}
                      </small>

                      <p className="h6 mt-2">Description</p>
                      <p className="card-text">{task.description}</p>
                      <div className="dropdown mb-3">
                        <button
                          className={`btn btn-${getStatusColor(
                            task.status
                          )} dropdown-toggle`}
                          type="button"
                          id={`dropdownMenuButton-${task._id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {task.status}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`dropdownMenuButton-${task._id}`}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleStatusChange(task._id, "Pending")
                              }
                            >
                              Pending
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleStatusChange(task._id, "In Progress")
                              }
                            >
                              In Progress
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleStatusChange(task._id, "Done")
                              }
                            >
                              Done
                            </button>
                          </li>
                        </ul>
                      </div>
                      {task.dueDate && (
                  <small className="text-muted mb-4">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </small>
                )}
                    </div>
                    <div className="card-footer">
                      {/* Edit button */}
                      <button
  type="button"
  className="btn btn-primary btn-sm me-2"
  onClick={() => handleEditTask(task)}
>
  <i className="bi bi-pencil-square"></i> Edit
</button>
                      {/* Delete button */}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showEditModal && (
         <div className={`modal fade ${showEditModal ? 'show' : ''}`} tabIndex="-1" role="dialog">
         <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editedTitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editedTitle"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editedDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="editedDescription"
                    rows="3"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveEditedTask}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeContent;

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "warning";
    case "in progress":
      return "primary";
    case "done":
      return "success";
    default:
      return "secondary";
  }
}
