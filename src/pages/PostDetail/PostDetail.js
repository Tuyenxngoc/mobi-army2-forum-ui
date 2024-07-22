import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import queryString from 'query-string';

import Style from './PostDetail.module.scss';
import classNames from 'classnames/bind';

import images from '~/assets';
import { deletePost, getPost, toggleFollow, toggleLock } from '~/services/postService';
import { getCommentByPostId } from '~/services/commentService';
import useAuth from '~/hooks/useAuth';
import Comment from '~/components/Comment/Comment';
import NewComment from '~/components/Comment/NewComment';
import Pagination from '~/components/Pagination';
import DateFormatter from '~/components/DateFormatter/DateFormatter';
import { toggleLike } from '~/services/likeService';
import { INITIAL_FILTERS, INITIAL_META, ROLES } from '~/common/contans';
import PlayerActions from '~/components/PlayerActions/PlayerActions';
import { checkUserHasRequiredRole } from '~/utils/helper';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message, Modal, Tooltip } from 'antd';
import { faBellSlash, faBell, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

const allowedRoles = [ROLES.Admin, ROLES.SuperAdmin];

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [isDeleteConfirmLoading, setIsDeleteConfirmLoading] = useState(false);
    const [deleteDialogText, setDeleteDialogText] = useState(
        'Bạn có chắc muốn xóa bài viết này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.',
    );

    const {
        isAuthenticated,
        player: { roleName },
    } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const hasRequiredRole = useMemo(() => checkUserHasRequiredRole(roleName, allowedRoles), [roleName]);

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleCommentSubmit = (newComment) => {
        setComments((prev) => [...prev, newComment]);
    };

    const handleUpdateComment = (updatedComment) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === updatedComment.id ? { ...comment, content: updatedComment.content } : comment,
            ),
        );
    };

    const handleDeleteComment = (deletedCommentId) => {
        setComments((prev) => prev.filter((comment) => comment.id !== deletedCommentId));
    };

    const handleLoginClick = () => {
        navigate('/login', { state: { from: location } });
    };

    const handleToggleLikePost = async () => {
        try {
            const response = await toggleLike(id);
            if (response.status === 200) {
                setPost((prev) => ({
                    ...prev,
                    like: {
                        ...prev.like,
                        hasLikes: !prev.like.hasLikes,
                        likeCount: prev.like.hasLikes ? prev.like.likeCount - 1 : prev.like.likeCount + 1,
                        latestLiker: !prev.like.hasLikes ? 'Bạn' : prev.like.latestLiker,
                    },
                }));
            }
        } catch (err) {
            console.error('Failed to like post', err);
        }
    };

    const handleToggleFollowPost = async () => {
        try {
            const response = await toggleFollow(id);
            if (response.status === 200) {
                setPost((prev) => ({
                    ...prev,
                    followed: !prev.followed,
                }));
            }
        } catch (err) {
            console.error('Failed to follow/unfollow post', err);
        }
    };

    const handleToggleLockPost = async () => {
        try {
            const response = await toggleLock(id);
            if (response.status === 200) {
                setPost((prev) => ({
                    ...prev,
                    locked: !prev.locked,
                }));
            }
        } catch (err) {
            console.error('Failed to toggle lock status', err);
        }
    };

    const handleDeletePost = async () => {
        setIsDeleteConfirmLoading(true);
        setDeleteDialogText('Đang xóa...');

        try {
            const response = await deletePost(id);
            if (response.status === 200) {
                navigate('/forum');
            }
            setIsDeleteDialogVisible(false);
            setIsDeleteConfirmLoading(false);
        } catch (error) {
            setDeleteDialogText('Xóa thất bại. Vui lòng thử lại.');
        } finally {
            setIsDeleteConfirmLoading(false);
        }
    };

    const handleDeleteButtonClick = () => {
        setIsDeleteDialogVisible(true);
    };

    const handleCloseDeleteDialogClick = () => {
        setIsDeleteDialogVisible(false);
    };

    const fetchPost = useCallback(async () => {
        try {
            const response = await getPost(id);
            setPost(response.data.data);
        } catch (err) {
            console.error('Failed to fetch post data', err);
        }
    }, [id]);

    const fetchComments = useCallback(async () => {
        try {
            const params = queryString.stringify(filters);
            const response = await getCommentByPostId(id, params);
            const { meta, items } = response.data.data;
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
            {contextHolder}

            <Modal
                title="Xác nhận xóa"
                open={isDeleteDialogVisible}
                onOk={handleDeletePost}
                confirmLoading={isDeleteConfirmLoading}
                onCancel={handleCloseDeleteDialogClick}
            >
                <p>{deleteDialogText}</p>
            </Modal>

            <PlayerActions />

            <div className={cx('header')}>
                <Link to="/forum">Quay lại</Link>
                {isAuthenticated && post && (
                    <button onClick={handleToggleFollowPost}>
                        {post.followed ? (
                            <>
                                <FontAwesomeIcon icon={faBellSlash} />
                                {' Bỏ theo dõi'}
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faBell} />
                                {' Theo dõi'}
                            </>
                        )}
                    </button>
                )}
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
                            <div
                                className={cx('ql-snow', 'ql-editor', 'content')}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                            <br />
                            <br />

                            <div className={cx('like-session')}>
                                {isAuthenticated && (
                                    <Tooltip title={post.like.hasLikes ? 'Bỏ thích' : 'Thích'}>
                                        <div className="text-danger" onClick={handleToggleLikePost}>
                                            <FontAwesomeIcon
                                                icon={post.like.hasLikes ? faHeartSolid : faHeartRegular}
                                            />
                                        </div>
                                    </Tooltip>
                                )}

                                {post.like.likeCount > 0 && (
                                    <div className={cx('like-count')}>
                                        <span className="text-danger"> ♥ </span>
                                        {`${post.like.latestLiker}${
                                            post.like.likeCount === 1
                                                ? ' đã thích bài này'
                                                : ` và ${post.like.likeCount - 1} người khác đã thích bài này`
                                        }`}
                                    </div>
                                )}
                            </div>

                            <div>
                                {hasRequiredRole && (
                                    <>
                                        <button onClick={handleToggleLockPost}>
                                            {post.locked ? 'Mở khóa' : 'Khóa'}
                                        </button>
                                        <button onClick={handleDeleteButtonClick}>Xóa</button>
                                    </>
                                )}

                                {post.approvedBy && (
                                    <div className={cx('approved-by')}>Duyệt bởi: {post.approvedBy.name}</div>
                                )}
                            </div>
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
                        <Comment
                            key={comment.id}
                            data={comment}
                            onUpdateComment={handleUpdateComment}
                            onDeleteComment={handleDeleteComment}
                            message={messageApi}
                        />
                    ))}
                </div>
            )}

            {post &&
                !post.locked &&
                (isAuthenticated ? (
                    <NewComment postId={id} onCommentSubmit={handleCommentSubmit} />
                ) : (
                    <div className={cx('login-session')}>
                        Đăng nhập để bình luận
                        <span onClick={handleLoginClick}> Đăng nhập</span>
                    </div>
                ))}

            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </main>
    );
}

export default PostDetail;
