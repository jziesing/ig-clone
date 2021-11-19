import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { updateOneComment } from '../../store/comment';
import { updateOneMainComment } from '../../store/mainComments';


function UpdateMainCommentModal ({comment}) {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState(comment?.content)
    const dispatch = useDispatch();

    const submitUpdateComment = () => (e) => {
        e.preventDefault()
        const payload = {
            content
        }
        setShowModal(false)
        dispatch(updateOneMainComment(payload, comment?.id))

    }

    const handleClose = () => {
        setShowModal(false)
        setContent('')
    }

    return (
        <>
            <div>
                <div onClick={() => setShowModal(true)}>edit comment</div>
            </div>
            {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <div>
                    <form onSubmit={submitUpdateComment()}>
                        <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        >
                        </textarea>
                        <button type="submit">update comment</button>
                    </form>
                </div>
            </Modal>
          )}
        </>
    )
}

export default UpdateMainCommentModal;
