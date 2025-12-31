import axios from "axios";
import React, { useState, useEffect } from "react";
import InputField from "./inputField";
import { useNavigate } from "react-router-dom";
import AddPhone from "./addPhone";
import { useAuth } from "./contexts/AuthContext";
import { useProtectedAction } from "./hooks/useProtectedAction";
import { getApiEndpoint } from "./config/api";

export default function Homepage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(getApiEndpoint("/api/phones"));
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (newData) => {
    try {
      const response = await axios.post(
        getApiEndpoint("/api/phone"),
        newData
      );
      setData([...data, response.data]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(getApiEndpoint(`/api/delete/${id}`));
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Wrap CRUD actions với authentication check
  const protectedPostData = useProtectedAction(postData);
  const protectedDeleteData = useProtectedAction(deleteData);
  const protectedNavigateUpdate = useProtectedAction((id) => {
    navigate(`/update/${id}`);
  });

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        {/* Hiển thị thông tin user */}
        {user && (
          <div
            className="mb-4 p-3"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              )}
              <div>
                <strong style={{ display: "block" }}>Xin chào, {user.name}!</strong>
                <small className="text-muted">{user.email}</small>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn btn-outline-danger btn-sm"
            >
              Đăng xuất
            </button>
          </div>
        )}

        <h2 className="text-center mb-4">List of Phones</h2>

        <ul className="list-group mb-3">
          {data.length === 0 ? (
            <li className="list-group-item text-center text-muted">
              Không có dữ liệu
            </li>
          ) : (
            data.map((item) => (
              <li
                key={item.id || item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.name}</strong>
                  <div className="text-muted">{item.price}₫</div>
                </div>

                <div>
                  <button
                    onClick={() => protectedDeleteData(item._id)}
                    className="btn btn-danger btn-sm me-2"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => protectedNavigateUpdate(item._id)}
                    className="btn btn-primary btn-sm"
                  >
                    Update
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <AddPhone onAdd={protectedPostData} />
      </div>
    </div>
  );
}
