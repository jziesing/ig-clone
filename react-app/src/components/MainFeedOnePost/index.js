import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router'
import { useState, useEffect} from 'react';
import { getComments, createOneComment } from '../../store/comment';
import { getLikes } from '../../store/like';
import { createOneLike } from '../../store/like';
import { deleteMyLike } from '../../store/like';
import DeleteCommentModal from '../DeleteCommentModal';
import UpdateCommentModal from '../UpdateCommentModal';
import { getUser } from '../../store/user';
import { getAllPosts } from '../../store/allPost';
import { Link } from 'react-router-dom';
import { getUserPosts } from '../../store/userPost';
import { getMainFeedPosts } from '../../store/mainFeedPosts';
import Comment from '../Comment';
import { createOneReply } from '../../store/reply';

import { getEveryPost } from '../../store/everyPost';
import "../Post/Post.css"

function MainFeedOnePost () {

    let history = useHistory()

    const [content, setContent] = useState('')
    const [hashtags, setHashtags] = useState([])
    const [body, setBody] = useState([])
    const [showMenu, setShowMenu] = useState(false)

    const [commentId, setCommentId] = useState('')


    const params = useParams()
    const {postId} = params

    const sessionUser = useSelector((state) => state.session?.user)
    const comments = useSelector((state) => Object.values(state.comments))
    const user = useSelector((state) => Object.values(state.user)[0])
    const post = useSelector((state) => Object.values(state.mainFeedPosts).find(post => post?.id == postId))
    // const post = useSelector((state) => Object.values(state.posts).find(post => post?.id == postId))
    const likes = useSelector((state) => Object.values(state.likes))


    const dispatch = useDispatch()

    useEffect( () => {
        // dispatch(getEveryPost())
        dispatch(getUser(post?.userId))
        dispatch(getComments(postId))
        dispatch(getLikes(postId))

    }, [dispatch, postId])

    useEffect(() => {

        let split = post?.body?.split(" ")

            for (let i = 0; i < split.length; i++) {
                let e = split[i];
                if (e.includes("#")) {
                    setHashtags(old => [...old, e])
                    // split.splice(i,1)
                } else {
                    setBody(old => [...old, e])
                }
            }

        //  setBody(split.join(' '))
        //  console.log(body)
    }, [dispatch])




    const createComment = (e) => {
        e.preventDefault()
        if (!content) {
            window.alert('Comments must contain text')
            return
        }

        if (content.includes('@')) {
            let array = content.split(' ')
            array.shift()
            console.log(array)
            array.join('')
            console.log(array)
            const payload = {
                content: array.join(' '),
                commentId,
                userId: sessionUser?.id,
                avatar: sessionUser?.avatar,
                username: sessionUser?.username
            }
            dispatch(createOneReply(payload))
            setCommentId('')
            setContent('')
            setShowMenu(true)
        } else {

            const payload = {
                content,
                postId,
                userId: sessionUser?.id,
                avatar: sessionUser?.avatar,
                username: sessionUser?.username
            }
            setContent('')
            dispatch(createOneComment(payload))
            dispatch(getComments(postId))

        }

    }

    const countLikes = () => {
        let count = 0;
        for (let i = 0; i < likes.length; i++) {
            count ++;
        }
        if (count === 1) {
            return '1 like'
        }
        return `${count} likes`
    }

    const createLike = (e) => {
        e.preventDefault()
        const payload = {
            userId : sessionUser?.id,
            postId,
            username : sessionUser?.username
        }
        dispatch(createOneLike(payload))
    }

    const isLiked = () => {
        if (likes) {
            for (let i = 0; i < likes.length; i++){
                let like = likes[i]
                if (like.userId == sessionUser?.id) {
                    return true;
                }
            }
        }
        return false;
    }

    const deleteLike = () => {
        dispatch(deleteMyLike(sessionUser?.id, post?.id))
    }


    const isSameDay = function(oldTime) {
        // let today = Date.now().getDate().toString()
        let newToday = new Date().getDate().toString()
        let newOldTime = new Date(oldTime).getDate()
        console.log('todays date:', newToday)
        console.log('message date:', newOldTime)
        if (newToday == newOldTime){
            return true
        }
        return false
    }

    const convertTime = function(oldTime){
        let newTime = oldTime.split(' ')[1]
        let time = newTime.split(':');
        let hours = time[0];
        let minutes = time[1];
        let timeValue = "" + ((hours >12) ? hours -12 :hours);
            timeValue += (minutes < 10) ? ':' + minutes : ":" + minutes;
            timeValue += (hours >= 12) ? " pm" : " am";
            // timeValue += "" + date
            return timeValue;
        }







    return (
        <div className="post-outer-container">
            <div className="exit-post-icon">
                <i onClick={() => history.push('/')} class="fas fa-times"></i>

            </div>
            <div className="post-modal-container">
                        <div className="left-image">
                            <img className="image-modal" src={post?.imageUrl}></img>
                        </div>
                        <div className="post-modal-right">
                            <div className="upper-right-modal">
                                <div className="username-avatar-div">

                                    <img className="user-avatar" alt="" src={user?.avatar}></img>
                                    <Link className="username-top-bold" to={`/p/${post?.userId}`}>{user?.username}</Link>

                                </div>

                            </div>
                            <div className="bottom-right-comments">
                                <div className="middle-right-modal">
                                    <div className="post-content-and-username">
                                        <img className="user-avatar" alt="" src={user?.avatar}></img>
                                        <div className="username-bold">
                                            {user?.username}
                                        </div>
                                    </div>

                                    <div className="comment-content-post">
                                        {body.join(' ')}
                                    </div>



                                </div>
                                <div>

                                {hashtags ? hashtags.map((hashtag) => (
                                            <Link className="post-hashtag-link" to={`/hashtags/${hashtag.substring(1)}`}>{hashtag}</Link>
                                        ))

                                    : ""}
                                </div>


                                {comments ?
                                comments.map((comment) => (


                                    <Comment setShowMenu={setShowMenu} showMenu={showMenu} setCommentId={setCommentId} user={sessionUser} comment={comment}/>


                                )) :
                                <div>There are currently no comments for this post</div>}
                            </div>

                            <div className="likes-post-div">
                                <div>
                                    {!isLiked()
                                    ?
                                    <div className="my-heart">

                                            <i onClick={createLike} className="far fa-heart"></i>

                                    </div>
                                        :
                                        <div className="my-red-heart">
                                            <i onClick={deleteLike} className="fas fa-heart"></i>
                                        </div>
                                        }
                                </div>

                                </div>

                                <div className="count-likes-main">
                                    {countLikes()}

                            </div>
                            <div>
                                <div>
                                    {isSameDay(post?.createdAt)
                                ?
                                <div className="time-post-div">
                                    {convertTime(post?.createdAt)}
                                </div>
                                :
                                <div className="time-stamp-post-div">
                                    {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(post?.createdAt))} {new Date(post?.createdAt).getDate()}, 2021

                                </div>
                                }


                                </div>
                            </div>

                            <div className="create-comment-right">

                                <form className="post-comment-main" onSubmit={createComment}>
                                    <input id="my-post-input-comment-main" value={content} onChange={(e) => setContent(e.target.value)} type='text' placeholder='post a comment...'></input>
                                </form>
                                    <button onClick={createComment}className={!!content ? "submit-button-blue" : "no-blue-submit-button"} >post</button>

                            </div>
                        </div>
                    </div>




        </div>
    )
}

export default MainFeedOnePost
