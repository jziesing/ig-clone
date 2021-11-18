import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { useSelector} from 'react-redux';
import { deleteOneComment } from '../../store/comment';
import { deleteMainFeedComment } from '../../store/mainComments';

function DeleteCommentModal ({comment}) {
    const [showModal, setShowModal] = useState(false);

    // const user = useSelector((state) => state.session?.user)

    const dispatch = useDispatch()

    const deleteComment = (e) => {
        e.preventDefault()
        setShowModal(false)
        dispatch(deleteOneComment(comment?.id))

    }

    return (
        <>
        <div onClick={() => setShowModal(true)}>
          delete comment
        </div>
        {showModal && (
        <Modal  onClose={() => setShowModal(false)}>
            <form onSubmit={deleteComment}>
                <button type="submit">Delete</button>
                <div>Cancel</div>
            </form>
        </Modal>
      )}
    </>
    )
}

export default DeleteCommentModal;
