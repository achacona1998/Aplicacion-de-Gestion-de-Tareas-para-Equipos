import { memo } from "react";

const Input = memo(({ label, value, onChange, ...props }) => {
  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">{label}</label>
      <input value={value} onChange={onChange} {...props}  />
    </div>
  );
});

export default Input;
