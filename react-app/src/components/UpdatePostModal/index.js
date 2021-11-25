import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { updateOnePost } from '../../store/post';
import { useHistory } from 'react-router';
import "./UpdatePostModal.css"


function UpdatePostModal ({ setShowMenu, post, showModal, setShowModal}) {

    let history = useHistory()

    // const [showModal, setShowModal] = useState(false);
    const [body, setBody] = useState(post?.body)
    const dispatch = useDispatch();

    const submitUpdatePost = (e) => {
        e.preventDefault()
        const payload = {
            body
        }
        dispatch(updateOnePost(payload, post?.id))
        setShowModal(false)
        setShowMenu(false)

        // history.push(`/${post?.id}`)
        // dispatch(getMyPosts(post?.id))

    }

    return (
        <>
            <div>
                <button className="edit-post-button" onClick={() => setShowModal(true)}>update post</button>
            </div>
            {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <div>
                    <img className="update-post-image" alt="" src={post?.imageUrl}></img>
                    <form onSubmit={submitUpdatePost}>
                        <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        >
                        </textarea>
                        <button type="submit">update post</button>
                    </form>
                </div>
            </Modal>
          )}
        </>
    )
}

export default UpdatePostModal;
