import { useState } from "react";
import axios from "axios";

import ProgressBar from '../../components/progress-bar/ProgressBar.tsx';
import UploadCard from "../../components/upload-card/UploadCard.tsx";
import ActionsBox from "../../components/actions-box/ActionsBox.tsx";

import "../../styles/DocumentUploader.css";
import FilesList from "../../components/files-list/FilesList.tsx";



function DocumentUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");


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

  

 
  const handleCancel = () => {
    setFiles([]);
    setUploadStatus("idle");
    setUploadProgress(0);
  };

  return (
    <>
      <UploadCard files={files} setFiles={setFiles}/>

      <FilesList files={files} setFiles={setFiles}/>
  
      {uploadStatus === "uploading" && <ProgressBar uploadProgress={uploadProgress}/>}
      
      {uploadStatus === "success" && ( <div className="status-message success">Files uploaded successfully!</div>)}
      {uploadStatus === "error" && ( <div className="status-message error">Upload failed. Please try again.</div> )}

      <ActionsBox 
        cancelDisabled={uploadStatus === "uploading"} 
        actionDisabled={files.length === 0 || uploadStatus === "uploading"}
        cancelAction={handleCancel}
        handleAction={handleUpload}
        actionLabel={uploadStatus === "uploading" ? "Uploading..." : "Upload"}/>
    </>
  );
}

export default DocumentUploader;
