import { useRef, useState } from "react";
import "../../styles/DocumentUploader.css";
import axios from "axios";


function DocumentUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Trigger file input
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  // Upload files to backend
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);  


      await axios.post("http://localhost:8000/upload_document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      setUploadStatus("success");
      setFiles([]);
      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Cancel upload
  const handleCancel = () => {
    setFiles([]);
    setUploadStatus("idle");
    setUploadProgress(0);
  };

  return (
    <>
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
          {files.length > 0
            ? `${files.length} file(s) selected`
            : "Select a folder or drop and drag here"}
        </p>
        <button
          className="upload-box-btn btn-light"
          onClick={(e) => e.stopPropagation()}
        >
          Select File
        </button>
      </div>
      {/* File list preview */}
      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <span>{file.name}</span>
              <span className="file-size">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
              <button onClick={() => removeFile(index)} className="remove-btn">
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Progress bar */}
      {uploadStatus === "uploading" && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <span>{uploadProgress}%</span>
        </div>
      )}

      {/* Status messages */}
      {uploadStatus === "success" && (
        <div className="status-message success">
          Files uploaded successfully!
        </div>
      )}
      {uploadStatus === "error" && (
        <div className="status-message error">
          Upload failed. Please try again.
        </div>
      )}
      <div className="actions-box">
        <button
          className="actions-btn btn-light btn-sm"
          onClick={handleCancel}
          disabled={uploadStatus === "uploading"}
        >
          Cancel
        </button>
        <button
          className="actions-btn btn-dark btn-sm"
          onClick={handleUpload}
          disabled={files.length === 0 || uploadStatus === "uploading"}
        >
          {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
        </button>
      </div>
    </>
  );
}

export default DocumentUploader;
