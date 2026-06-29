import { useState } from "react";
import { createTag, updateTag } from "../api";
import "../styles/dashboard.css";

function AddTagModal({ onClose, onSaved, tagItem }) {
  const isEditing = Boolean(tagItem);
  const [name, setName] = useState(tagItem?.name || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Tag name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateTag(tagItem._id, { name }, token);
      } else {
        await createTag({ name }, token);
      }
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      const fallback = isEditing ? "Failed to update tag" : "Failed to add tag";
      const message =
        data?.errors?.map((e) => e.message).join(", ") ||
        data?.message ||
        fallback;
      setError(message);
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-card-small"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? "Edit tag" : "Add tag"}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-field">
            <label className="modal-label">Name</label>
            <input
              className="modal-input"
              type="text"
              placeholder="e.g. Food, Rent, Salary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {error && <div className="modal-error">{error}</div>}

          <button className="modal-save-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Update tag" : "Save tag"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTagModal;