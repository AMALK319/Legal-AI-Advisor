import './ActionsBox.css';

interface ActionsBoxProps{
    cancelDisabled: boolean;
    actionDisabled: boolean;
    cancelAction:  () => void;
    handleAction:  () => Promise<void>;
    actionLabel: string;
}


export default function ActionsBox(props:ActionsBoxProps){
    return (
        <div className="actions-box">
        <button
          className="actions-btn btn-light btn-sm"
          onClick={props.cancelAction}
          disabled={props.cancelDisabled}
        >
          Cancel
        </button>
        <button
          className="actions-btn btn-dark btn-sm"
          onClick={props.handleAction}
          disabled={props.actionDisabled}
        >
          {props.actionLabel}
        </button>
      </div>
    )
}