import { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router'
import { getUser } from '../../store/user';
import { getUserPosts } from '../../store/userPost';
import { createOneFollow } from '../../store/follow';
import { getFollows } from '../../store/follow';
import UnfollowModal from '../UnfollowModal';
import '../Profile/Profile.css'



function UserProfile () {

    const [isFollowed, setIsFollowed] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const params = useParams()
    const {userId} = params
    const sessionUser = useSelector((state) => state.session?.user)
    const follows = useSelector((state) => Object.values(state.follows))
    console.log(follows)

    const user = useSelector((state) => Object.values(state.user)[0])
    const posts = useSelector((state) => Object.values(state.userPosts))

    const dispatch = useDispatch()



        useEffect(() => {
            dispatch(getFollows(sessionUser?.id))
            dispatch(getUser(userId))
            dispatch(getUserPosts(userId))
        }, [dispatch, showModal])

           useEffect(() => {
        for (let i = 0; i < follows.length; i++) {
                let follow = follows[i];
                if (follow.followId == userId) {
                    setIsFollowed(true)
                } else {
                    setIsFollowed(false)
                }
            }
        },[dispatch, follows, showModal])


    const countPosts = () => {
        let count = 0
        for (let i = 0; i < posts.length; i++) {
            count ++
        }
        return count
    }

    const createFollow = (e) => {
        e.preventDefault()
        const payload = {
            userId : sessionUser?.id,
            followId : userId
        }
        dispatch(createOneFollow(payload))
        setIsFollowed(true)
        // dispatch(getFollows(sessionUser?.id))
    }


    return (
        <>
            <div className="my-profile-container">
                <div className="profile-picture" style={{backgroundImage: `url(${user?.avatar})`}}></div>
                <div className="my-profile-content">
                        <div className="top-my-profile-content">
                            <div>{user?.username}</div>
                            <div>
                                {!isFollowed ? <button onClick={createFollow} className="follow-button">Follow</button>
                                :
                                <UnfollowModal setIsFollowed={setIsFollowed} showModal={showModal} setShowModal={setShowModal} userId={sessionUser?.id} followId={userId}/>}
                            </div>
                        </div>
                        <div className="middle-my-profile-content">
                            <div>{countPosts()} posts</div>
                            <div># of followers</div>
                            <div># of following</div>
                        </div>
                        <div className="bottom-my-profile-content">
                            <div>Bio</div>
                        </div>
                </div>
            </div>

            { posts ? <div className="my-posts-container">
                {posts.map((post) => (
                    <Link to={`/p/${userId}/${post?.id}`}>
                        <div key={post.id}>
                            <img alt="" className="post-image" src={post.imageUrl}></img>
                            {/* <div>{post.body}</div> */}
                        </div>
                    </Link>
                ))}
            </div> : <div>You don't have any posts yet!</div>}
        </>
    )
}

export default UserProfile;
