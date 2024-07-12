import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Style from './PostDetail.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets';
import { getPost } from '~/services/postService';
import { createComment, getCommentByPostId } from '~/services/commentService';

const cx = classNames.bind(Style);

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchPost = async () => {
        try {
            const response = await getPost(id);
            const data = response.data.data;
            setPost(data);
        } catch (err) {
            console.log('Failed to fetch post data');
        }
    };

    const fetchComments = async () => {
        try {
            const response = await getCommentByPostId(id);
            const data = response.data.data;
            setComments(data);
        } catch (err) {
            console.log('Failed to fetch comments');
        }
    };

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [id]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createComment({ postId: id, content: newComment });
            if (response.status === 200) {
                setComments([...comments, response.data.data]);
                setNewComment('');
            }
        } catch (err) {
            console.log('Failed to submit comment');
        }
    };

    return (
        <main className="box-container">
            <div>
                <Link to="/forum">Quay lại</Link>
            </div>

            <div className={cx('ads')}>
                <img src={images.newGif} alt="new" />
                <Link to="/">Avatar Bùm</Link>
                <img src={images.newGif} alt="new" />
            </div>

            {post && (
                <div className={cx('post-detail')}>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                </div>
            )}

            {comments.length > 0 && (
                <div className={cx('comments')}>
                    <h2>Comments</h2>
                    {comments.map((comment) => (
                        <div key={comment.id} className={cx('comment')}>
                            <p>
                                <strong>{comment.author}</strong>: {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleCommentSubmit} className={cx('comment-form')}>
                <textarea value={newComment} onChange={handleCommentChange} placeholder="Write a comment..." required />
                <button type="submit">Submit</button>
            </form>
        </main>
    );
}

export default PostDetail;
