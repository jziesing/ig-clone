import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { createOneChannel } from "../../store/channel"
import './Search.css'

const Search = () => {
  const [term, setTerm] = useState("")
  const [results, setResults] = useState([])
  const sessionUser = useSelector(state => state.session?.user)
  const users = useSelector(state => Object.values(state.allUsers))
  console.log(users)

  const dispatch = useDispatch()


  useEffect(()=> {
    if(term.length > 0) {

      fetch(`/api/users/search/${term}`).then(res => res.json()).then(json => {setResults(json.users.filter(user => user.username !== sessionUser?.username )); console.log(json)}).catch(e => console.log(e));

    } else (setResults(""));

  }, [term])


  const createChannel = (friend) => () => {
    const payload = {
        friendId : friend?.id,
        friendAvatar : friend?.avatar,
        friendUsername : friend?.username,
        userId: sessionUser?.id
    }
    dispatch(createOneChannel(payload))
    setTerm('')
  }





  return (
    <div className="search-container" >
      <form className='search-bar' autoComplete="off">

        <input type="search"
           placeholder='Start Up A Conversation' value={term} onChange={(e) => setTerm(e.target.value)} />

      </form>

        {<ul className={`search-results ${users.length >= 9 ? 'results-found' : "" }`}>

            { !!results.length && results?.map(user => (

            <div className='search-results-div' onClick={createChannel(user)} >
                <img alt="" src={user.avatar}></img>
                <p>{user.username}</p>
            </div>))}

        </ul>}
    </div>
  )
}

export default Search;
