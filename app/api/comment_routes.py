from flask import Blueprint, jsonify, request
from app.models import Comment, db, CommentLike, Reply
from app.forms import addCommentForm
from app.forms import updateCommentForm
from sqlalchemy import asc, desc


comment_routes = Blueprint('comments', __name__)


@comment_routes.route('/<int:id>')
def get_my_comments(id):
    comments = Comment.query.filter(Comment.postId == id).order_by(desc(Comment.createdAt))
    return {'comments': [comment.to_dict() for comment in comments]}


# @comment_routes.route('/<int:id>')
# def get_my_comments(id):
#     comments = Comment.query.all()
#     return {'comments': [comment.to_dict() for comment in comments]}

@comment_routes.route('/', methods=['POST'])
def create_comment():

    form = addCommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        comment = Comment (
            content = form.data['content'],
            postId = form.data['postId'],
            userId = form.data['userId'],
            avatar = form.data['avatar'],
            username = form.data['username']
        )
    print(comment)
    db.session.add(comment)
    db.session.commit()
    return {'comment' : comment.to_dict()}

@comment_routes.route('/delete/<int:id>', methods=['DELETE'])
def delete_comment(id):
    commentLikes = CommentLike.query.filter(CommentLike.commentId == id).all()
    replies = Reply.query.filter(Reply.commentId == id).all()
    [db.session.delete(commentLike) for commentLike in commentLikes]
    [db.session.delete(reply) for reply in replies]
    comment = Comment.query.get(id)
    db.session.delete(comment)
    db.session.commit()
    return { 'commentId' : id }

@comment_routes.route('/update/<int:id>', methods=['POST'])
def update_comment(id):
    form = updateCommentForm()
    comment = Comment.query.get(id)
    comment.content = form.data['content']
    db.session.commit()
    return { 'commentId' : comment.id, 'comment' : comment.to_dict() }
