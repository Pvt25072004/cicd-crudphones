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
      console.log(response);
      console.log(response.data);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData([]);
      console.log(err);
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
      console.log("Đã xóa thành công");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>List of phones</h2>
      <ul>
        {data.length === 0 ? (
          <li>Không có dữ liệu</li>
        ) : (
          data.map((item) => (
            <li key={item.id || item._id} className={item._id}>
              <p>{item.name}</p>
              <p>{item.price}</p>
              <button type="submit" onClick={() => deleteData(item._id)}>
                Delete
              </button>
              <button
                type="submit"
                onClick={() => navigate(`/update/${item._id}`)}
              >
                Update
              </button>
            </li>
          ))
        )}
      </ul>
      <AddPhone onAdd={postData} />
    </div>
  );
}
