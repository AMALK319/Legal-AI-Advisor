import './Message.css'
import { ChatMessage, ChatRole } from '../../pages/Public/Chat';

export default function Message(props: ChatMessage){
    return(
        <>
            <p className={props.role === ChatRole.USER ? "user-message" : "system-message"}>{props.data}</p>
        </>
    )
}