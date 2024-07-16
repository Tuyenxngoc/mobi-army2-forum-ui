import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import queryString from 'query-string';

import Style from './PostDetail.module.scss';
import classNames from 'classnames/bind';

import images from '~/assets';
import { getPost } from '~/services/postService';
import { getCommentByPostId } from '~/services/commentService';
import useAuth from '~/hooks/useAuth';
import Comment from '~/components/Comment/Comment';
import NewComment from '~/components/Comment/NewComment';
import Pagination from '~/components/Pagination';
import DateFormatter from '~/components/DateFormatter/DateFormatter';
import { toggleLike } from '~/services/likeService';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import PlayerActions from '~/components/PlayerActions/PlayerActions';

const cx = classNames.bind(Style);

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const { isAuthenticated } = useAuth();

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleCommentSubmit = (newComment) => {
        setComments((prev) => [...prev, newComment]);
    };

    const handleLoginClick = () => {
        navigate('/login', { state: { from: location } });
    };

    const handleLikePost = async () => {
        try {
            await toggleLike(id);
        } catch (err) {
            console.error('Failed to like post', err);
        }
    };

    const fetchPost = useCallback(async () => {
        try {
            const {
                data: { data },
            } = await getPost(id);
            setPost(data);
        } catch (err) {
            console.error('Failed to fetch post data', err);
        }
    }, [id]);

    const fetchComments = useCallback(async () => {
        try {
            const params = queryString.stringify(filters);
            const {
                data: {
                    data: { meta, items },
                },
            } = await getCommentByPostId(id, params);
            setComments(items);
            setMeta(meta);
        } catch (err) {
            console.error('Failed to fetch comments', err);
        }
    }, [id, filters]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    return (
        <main className="box-container">
            <PlayerActions />

            <div className={cx('header')}>
                <Link to="/forum">Quay lại</Link>
            </div>

            {post && (
                <div className={cx('post-detail')}>
                    <div className="text-center">
                        <img src={images.plGif} alt="status" />
                        <div>Bài: {post.player.points}</div>
                    </div>

                    <div className={cx('post-wrapper')}>
                        <div className={cx('post-header')}>
                            <div>
                                <img src={post.player.isOnline ? images.online : images.offline} alt="status" />
                                <Link to={`/player/${post.player.id}`} className={cx('username')}>
                                    {post.player.name}
                                </Link>
                            </div>

                            <div className={cx('time')}>
                                <DateFormatter datetime={post.lastModifiedDate} />
                            </div>
                        </div>

                        <div className={cx('post-body')}>
                            <div className={cx('title')}>{post.title}</div>
                            <div className={cx('content')}>{post.content}</div>
                            <br />
                            <br />
                            <button onClick={handleLikePost}>like</button>
                            {post.like.likeCount > 0 && (
                                <div className={cx('like-count')}>
                                    {post.like.likeCount === 1
                                        ? ` ♥ ${post.like.latestLiker} đã thích bài này`
                                        : ` ♥ ${post.like.latestLiker} và ${
                                              post.like.likeCount - 1
                                          } người khác đã thích bài này`}
                                </div>
                            )}

                            {post.approvedBy && (
                                <span className={cx('approved-by')}>Duyệt bởi: {post.approvedBy.name}</span>
                            )}
                        </div>
                    </div>
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
                <div className={cx('login-session')}>
                    Đăng nhập để bình luận
                    <span onClick={handleLoginClick}> Đăng nhập</span>
                </div>
            )}
            <Pagination
                totalPages={meta.totalPages}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </main>
    );
}

export default PostDetail;
