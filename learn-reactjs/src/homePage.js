import axios from "axios";
import React, { useState, useEffect } from "react";
import InputField from "./inputField";
import { useNavigate } from "react-router-dom";
import AddPhone from "./addPhone";

export default function Homepage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/phones`);
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
      const response = await axios.post(`${API_URL}/api/phone`, newData);
      setData([...data, response.data]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/delete/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
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
                    onClick={() => deleteData(item._id)}
                    className="btn btn-danger btn-sm me-2"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => navigate(`/update/${item._id}`)}
                    className="btn btn-primary btn-sm"
                  >
                    Update
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <AddPhone onAdd={postData} />
      </div>
    </div>
  );
}
