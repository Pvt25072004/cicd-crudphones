function InputField({ label, type, value, onChange, onBlur }) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} onBlur={onBlur} />
    </div>
  );
}
export default InputField;
