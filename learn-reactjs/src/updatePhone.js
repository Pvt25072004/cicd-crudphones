import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import InputField from "./inputField";
import axios from "axios";

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [namePhone, setNamePhone] = useState("");
  const [pricePhone, setPricePhone] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  useEffect(() => {
    fetchPhone();
  }, [id]);
  const fetchPhone = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/phones`);
      const phone = res.data.find((p) => p._id === id);
      if (phone) {
        setNamePhone(phone.name);
        setPricePhone(phone.price);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/api/update/${id}`, {
        name: namePhone,
        price: pricePhone,
      });
      navigate("/"); // quay lại danh sách sau khi update
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Update Phone</h2>
      <InputField
        label="Name phone"
        type="text"
        value={namePhone}
        onChange={(e) => setNamePhone(e.target.value)}
      />
      <InputField
        label="Price phone"
        type="text"
        value={pricePhone}
        onChange={(e) => setPricePhone(e.target.value)}
      />
      <button onClick={handleUpdate} className="btn btn-success">
        Update
      </button>
    </div>
  );
}
