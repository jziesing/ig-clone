import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router'
import { useState, useEffect} from 'react';
import { getMyPosts } from '../../store/post';

import { deleteOnePost } from '../../store/post';
import { getComments } from '../../store/comment';
import "./Post.css"

function Post () {

    let history = useHistory()

    const params = useParams()
    const {postId} = params

    const [showMenu, setShowMenu] = useState(false);
    const user = useSelector((state) => state.session?.user)
    const comments = useSelector((state) => Object.values(state.comments))


    const post = useSelector((state) => state.myPosts[postId])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getComments(postId))
    }, [dispatch])


    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };

    const deletePost = () => {
        dispatch(deleteOnePost(postId))
        history.push('/profile')
    }

    return (
        <div className="post-outer-container">
            <div onClick={() => history.push('/profile')}>exit</div>
            <div className="post-modal-container">
                        <div className="left-image">
                            <img className="image-modal" src={post?.imageUrl}></img>
                        </div>
                        <div className="post-modal-right">
                            <div className="upper-right-modal">
                                <div>{user?.username}</div>

                                <div onClick={openMenu} >edit</div>
                                    {showMenu && (
                                        <ul className="edit-post-dropdown">
                                        <li></li>
                                        <button onClick={deletePost}>delete post</button>
                                        </ul>
                                    )}

                            </div>
                            <div className="middle-right-modal">
                                <div>
                                    {user?.username}
                                </div>
                                <div>
                                    {post?.body}
                                </div>
                            </div>
                            <div className="bottom-right-comments">
                                {comments ?
                                comments.map((comment) => (
                                    <div>{comment.content}</div>
                                )) :
                                <div>There are currently no comments for this post</div>}
                            </div>
                        </div>
                    </div>




        </div>
    )
}

export default Post
