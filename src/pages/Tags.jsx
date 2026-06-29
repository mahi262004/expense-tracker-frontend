import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTags, deleteTag } from "../api";
import AddTagModal from "../components/AddTagModal";
import "../styles/dashboard.css";

const TAG_COLORS = [
  "#c9a24b",
  "#e0944a",
  "#b4694f",
  "#6f9c87",
  "#6f87a8",
  "#97698c",
];

function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [error, setError] = useState("");
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
      .then((res) => {
        setTags(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleAddClick = () => {
    setEditingTag(null);
    setModalOpen(true);
  };

  const handleEditClick = (t) => {
    setEditingTag(t);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTag(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this tag? Transactions using it may show 'No tag' afterwards."
    );
    if (!confirmed) return;

    try {
      await deleteTag(id, token);
      loadTags();
    } catch (err) {
      setError("Failed to delete tag");
    }
  };

  if (loading) {
    return <div className="dash-loading">Loading...</div>;
  }

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <div className="dash-welcome">Categories</div>
          <h1 className="dash-title">Tags</h1>
        </div>
        <button className="dash-add-btn" onClick={handleAddClick}>
          <span className="dash-add-plus">+</span> Add tag
        </button>
      </div>

      {error && <div className="modal-error">{error}</div>}

      <div className="dash-panel tag-panel">
        <div className="dash-panel-title">Your tags</div>

        {tags.length === 0 ? (
          <p className="dash-empty">
            No tags yet. Add one above (e.g. "Food", "Rent", "Salary").
          </p>
        ) : (
          tags.map((t, i) => (
            <div key={t._id} className="tag-row">
              <span
                className="tag-dot"
                style={{ background: TAG_COLORS[i % TAG_COLORS.length] }}
              ></span>
              <span className="tag-name">{t.name}</span>

              <div className="tx-actions">
                <button
                  className="tx-action-btn"
                  onClick={() => handleEditClick(t)}
                  aria-label="Edit tag"
                  type="button"
                >
                  <i className="ti ti-pencil" aria-hidden="true"></i>
                </button>
                <button
                  className="tx-action-btn tx-action-btn-danger"
                  onClick={() => handleDelete(t._id)}
                  aria-label="Delete tag"
                  type="button"
                >
                  <i className="ti ti-x" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <AddTagModal
          tagItem={editingTag}
          onClose={handleCloseModal}
          onSaved={() => {
            handleCloseModal();
            loadTags();
          }}
        />
      )}
    </div>
  );
}

export default Tags;