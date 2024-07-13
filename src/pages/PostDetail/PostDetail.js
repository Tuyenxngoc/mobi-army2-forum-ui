import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import Style from './PostDetail.module.scss';
import classNames from 'classnames/bind';

import images from '~/assets';
import { getPost } from '~/services/postService';
import { getCommentByPostId } from '~/services/commentService';
import useAuth from '~/hooks/useAuth';
import Comment from '~/components/Comment/Comment';
import NewComment from '~/components/Comment/NewComment';

const cx = classNames.bind(Style);

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const { isAuthenticated } = useAuth();

    const handleCommentSubmit = (newComment) => {
        setComments([...comments, newComment]);
    };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <main className="box-container">
            <div className={cx('header')}>
                <Link to="/forum">Quay lại</Link>
            </div>

            {post && (
                <div className={cx('post-detail')}>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                </div>
            )}

            <div className={cx('ads')}>
                <img src={images.newGif} alt="new" />
                <Link to="/">Avatar Bùm</Link>
                <img src={images.newGif} alt="new" />
            </div>

            {comments.length > 0 && (
                <div className={cx('comment-list')}>
                    {comments.map((comment) => (
                        <Comment key={comment.id} data={comment} />
                    ))}
                </div>
            )}

            {isAuthenticated ? (
                <NewComment postId={id} onCommentSubmit={handleCommentSubmit} />
            ) : (
                <div>
                    Đăng nhập để bình luận
                    <button
                        onClick={() => {
                            navigate('/login', { state: { from: location } });
                        }}
                    >
                        Đăng nhập
                    </button>
                </div>
            )}
        </main>
    );
}

export default PostDetail;
