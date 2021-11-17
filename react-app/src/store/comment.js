const LOAD = 'comments/LOAD'
const ADD = 'comments/ADD'

const loadComments = comments => ({
    type: LOAD,
    comments
})

const addComment = comment => ({
    type: ADD,
    comment
})

export const getComments = (postId) => async dispatch => {
    const response = await fetch(`/api/comments/${postId}`)

    if (response.ok) {
        const comments = await response.json()
        dispatch(loadComments(comments))
    }
}

export const createOneComment = (payload) => async dispatch => {
    console.log('thunk action begins for create comment')
    const response = await fetch(`/api/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({...payload})
    })

    if (response.ok) {
        console.log('response!!!', response)
        const comment = await response.json()
        dispatch(addComment(comment))
    }
}

const initialState = {
    // list: []
}

const commentsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD: {
            const allComments = {};
            action.comments.comments.forEach(comment => {
                allComments[comment.id] = comment
            });
            return {
                ...allComments,
                // ...state,
            }
        }
        case ADD: {
            const newState = {
                ...state,
                [action.comment.comment.id]: action.comment.comment
            }
            return newState;
        }
        default:
            return state;
        }
    }

export default commentsReducer
