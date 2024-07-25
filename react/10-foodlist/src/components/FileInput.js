import React, { useEffect, useState } from "react";
import placeholderImg from "../assets/preview-placeholder.png";
import resetImg from "../assets/ic-reset-white.png";
import "./FileInput.css";

function FileInput({ name, value, onChange, initialPreview }) {
  const [preview, setPreview] = useState(initialPreview);
  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
  };

  const handleClearClick = () => {
    onChange(name, null);
  };

  useEffect(() => {
    if (!value) return;
    const nextPreview = URL.createObjectURL(value);
    // 어디서든 사용하고 블록 타입의 이미지를 받는다
    setPreview(nextPreview);

    return () => {
      setPreview(null);
      URL.revokeObjectURL(nextPreview);
    };
  }, [value]);
  return (
    <div className="FileInput">
      <img
        className={`FileInput-preview ${preview ? "selected" : ""}`}
        src={preview || placeholderImg}
      />
      <input
        className="FileInput-hidden-overlay"
        type="file"
        // 하나의 input에서 여러개의 파일을 선택하게 하는 것 multiple
        onChange={handleChange}
      />
      <button
        className="FileInput-clear-button"
        onClick={handleClearClick}
        type="button"
      >
        <img src={resetImg} />
      </button>
    </div>
  );
}

export default FileInput;
