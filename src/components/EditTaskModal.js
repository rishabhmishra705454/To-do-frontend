import React, { useState, useEffect } from "react";

const EditTaskModal = ({ taskId, title, description, onClose, onSave }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    setNewTitle(title);
    setNewDescription(description);
  }, [title, description]);

  const handleSave = () => {
    onSave(taskId, newTitle, newDescription);
  };

  return (
    <div className="modal fade" id="editTaskModal" tabIndex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editTaskModalLabel">Edit Task</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="editTaskTitle" className="form-label">Title</label>
              <input type="text" className="form-control" id="editTaskTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="editTaskDescription" className="form-label">Description</label>
              <textarea className="form-control" id="editTaskDescription" rows="3" value={newDescription} onChange={(e) => setNewDescription(e.target.value)}></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
