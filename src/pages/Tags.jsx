import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTags, createTag, updateTag, deleteTag } from "../api";

function Tags() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    loadTags();
  }, []);

  const loadTags = () => {
    getTags(token)
      .then((res) => setTags(res.data))
      .catch((err) => console.log(err));
  };

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Tag name cannot be empty");
      return;
    }

    try {
      if (editingId) {
        await updateTag(editingId, { name }, token);
      } else {
        await createTag({ name }, token);
      }
      resetForm();
      loadTags();
    } catch (err) {
      setError(editingId ? "Failed to update tag" : "Failed to add tag");
    }
  };

  const handleEditClick = (t) => {
    setEditingId(t._id);
    setName(t.name);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this tag? Transactions using this tag may show 'no tag' afterwards."
    );
    if (!confirmed) return;

    try {
      await deleteTag(id, token);
      loadTags();
    } catch (err) {
      setError("Failed to delete tag");
    }
  };

  return (
    <div>
      <h1>Tags</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tag name (e.g. Food, Rent, Salary)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Update Tag" : "Add Tag"}</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Your Tags</h2>
      {tags.length === 0 ? (
        <p>No tags yet. Add one above (e.g. "Food", "Rent", "Salary").</p>
      ) : (
        <ul>
          {tags.map((t) => (
            <li key={t._id} style={{ marginBottom: "6px" }}>
              {t.name}
              <button onClick={() => handleEditClick(t)} style={{ marginLeft: "10px" }}>
                Edit
              </button>
              <button onClick={() => handleDelete(t._id)} style={{ marginLeft: "4px" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tags;