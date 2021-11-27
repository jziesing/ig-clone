import { createOneReply } from "../../store/reply"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";
import './Reply.css'

function Reply ({replies, commentId}) {

    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session?.user)
    const [reply, setReply] = useState('')

    const createReply = (e) => {
        e.preventDefault()
        const payload = {
            content: reply,
            commentId,
            userId: sessionUser?.id,
            avatar: sessionUser?.avatar,
            username: sessionUser?.username
        }
        dispatch(createOneReply(payload))

    }


    return (
        <div>
            {replies.map(reply => (

                <div>{reply?.content}</div>
            ))}
            <form onSubmit={createReply}>
                    <input type="text" placeholder="reply" value={reply} onChange={(e) => setReply(e.target.value)}></input>
                    <button type="submit">Reply</button>
                </form>
        </div>
    )
}

export default Reply
