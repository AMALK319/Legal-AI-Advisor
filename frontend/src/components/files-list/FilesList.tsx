import './FilesList.css';

interface FilesListProps{
    files: File[]; 
    setFiles:  React.Dispatch<React.SetStateAction<File[]>>;
}


export default function FilesList(props: FilesListProps){
    const removeFile = (index: number) => {
    props.setFiles((prev) => prev.filter((_, i) => i !== index));
  };
    return (
      <>
        {props.files.length > 0 && (
          <div className="file-list">
            {props.files.map((file, index) => (
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
      </>
    )
}