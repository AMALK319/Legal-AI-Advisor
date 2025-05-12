import './Progressbar.css'

interface ProgressBarProps {
  uploadProgress: number;
}

export default function ProgressBar(props: ProgressBarProps) {
  return (
    <>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${props.uploadProgress}%` }}
        ></div>
        <span>{props.uploadProgress}%</span>
      </div>
    </>
  );
}
