import { useState } from "react";

const useToast = () => {
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const Toast = () =>
    message.text ? (
      <div
        className={`fixed top-5 right-5 z-50 px-5 py-3 rounded shadow-lg text-white text-sm font-medium transition-all ${
          message.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {message.text}
      </div>
    ) : null;

  return { showMessage, Toast };
};

export default useToast;
