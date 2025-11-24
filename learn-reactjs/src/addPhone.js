import { useState } from "react";
import InputField from "./inputField";

export default function AddPhone({ onAdd }) {
  const [namePhone, setNamePhone] = useState("");
  const [pricePhone, setPricePhone] = useState("");
  // lưu lỗi theo key: { name: "msg", price: "msg" }
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (field, value) => {
    const v = (value || "").toString().trim();
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (field === "name") {
        if (!v) next.name = "Tên không được để trống";
        else delete next.name;
      }
      if (field === "price") {
        if (!v) next.price = "Giá không được để trống";
        else delete next.price;
      }
      return next;
    });
  };

  const handleNameChange = (e) => {
    const v = e.target.value;
    setNamePhone(v);
    validateField("name", v);
  };

  const handlePriceChange = (e) => {
    const v = e.target.value;
    setPricePhone(v);
    validateField("price", v);
  };

  const validateAll = () => {
    const errors = {};
    if (!namePhone.toString().trim()) errors.name = "Tên không được để trống";
    if (!pricePhone.toString().trim()) errors.price = "Giá không được để trống";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAndAdd = async () => {
    if (!validateAll()) return;
    // onAdd nên trả true/false (xem phần Api)
    const success = await onAdd({ name: namePhone, price: pricePhone });
    if (success) {
      setNamePhone("");
      setPricePhone("");
      setFieldErrors({});
    }
  };

  return (
    <div>
      <h2>Add new phone from user</h2>

      <InputField
        label="Name phone"
        type="text"
        value={namePhone}
        onChange={handleNameChange}
        onBlur={() => validateField("name", namePhone)}
      />
      {fieldErrors.name && (
        <span style={{ color: "red" }}>{fieldErrors.name}</span>
      )}

      <InputField
        label="Price phone"
        type="text"
        value={pricePhone}
        onChange={handlePriceChange}
        onBlur={() => validateField("price", pricePhone)}
      />
      {fieldErrors.price && (
        <span style={{ color: "red" }}>{fieldErrors.price}</span>
      )}

      <br />
      <button
        onClick={validateAndAdd}
        type="button"
        className="btn btn-success"
      >
        Add
      </button>
    </div>
  );
}
