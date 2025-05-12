import { useState, useRef } from "react";
import './UploadCard.css';


interface UploadCardProps{
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function UploadCard(props:UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      props.setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      props.setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div
      className={`upload-box flex ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleSelectClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".pdf"
        style={{ display: "none" }}
      />
      <img
        className="upload-box-img"
        src="../../../public/upload-image.png"
        alt="upload-image"
      />
      <p className="upload-box-text">
        {props.files.length > 0
          ? `${props.files.length} file(s) selected`
          : "Select a folder or drop and drag here"}
      </p>
      <button
        className="upload-box-btn btn-light"
        onClick={(e) => e.stopPropagation()}
      >
        Select File
      </button>
    </div>
  );
}
