import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import InputField from "./inputField";
import axios from "axios";
import { useAuth } from "./contexts/AuthContext";
import { useProtectedAction } from "./hooks/useProtectedAction";
import { getApiEndpoint } from "./config/api";

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, requireAuth, loading } = useAuth();
  const [namePhone, setNamePhone] = useState("");
  const [pricePhone, setPricePhone] = useState("");

  useEffect(() => {
    // Kiểm tra authentication khi component mount
    if (user) {
      fetchPhone();
    } else if (!user && !loading) {
      // Chỉ redirect nếu đã kiểm tra xong và không có user
      requireAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, loading]);

  const fetchPhone = async () => {
    try {
      const res = await axios.get(getApiEndpoint("/api/phones"));
      const phone = res.data.find((p) => p._id === id);
      if (phone) {
        setNamePhone(phone.name);
        setPricePhone(phone.price);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateData = async () => {
    try {
      await axios.put(getApiEndpoint(`/api/update/${id}`), {
        name: namePhone,
        price: pricePhone,
      });
      navigate("/"); // quay lại danh sách sau khi update
    } catch (err) {
      console.error(err);
    }
  };

  // Wrap action với authentication check
  const handleUpdate = useProtectedAction(updateData);

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
