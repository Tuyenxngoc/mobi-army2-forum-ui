import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash, faBell, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { Button, message, Modal, Tooltip } from 'antd';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';

import queryString from 'query-string';

import classNames from 'classnames/bind';
import Style from './PostDetail.module.scss';

import images from '~/assets';
import { deletePost, getPost, toggleFollow, toggleLock } from '~/services/postService';
import { getCommentByPostId } from '~/services/commentService';
import { toggleLike } from '~/services/likeService';
import useAuth from '~/hooks/useAuth';
import Comment from '~/components/Comment/Comment';
import NewComment from '~/components/Comment/NewComment';
import Pagination from '~/components/Pagination';
import DateFormatter from '~/components/DateFormatter/DateFormatter';
import { INITIAL_FILTERS, INITIAL_META, ROLES } from '~/common/contans';

const cx = classNames.bind(Style);

const allowedRoles = {
    [ROLES.SuperAdmin]: true,
    [ROLES.Admin]: true,
};

function PostDetail() {
    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [commentErrorMessage, setCommentErrorMessage] = useState(null);

    const [isPostLoading, setIsPostLoading] = useState(true);
    const [postErrorMessage, setPostErrorMessage] = useState(null);

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [isDeleteConfirmLoading, setIsDeleteConfirmLoading] = useState(false);
    const [deleteDialogText, setDeleteDialogText] = useState(
        'Bạn có chắc muốn xóa bài viết này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.',
    );

    const [messageApi, contextHolder] = message.useMessage();
    const { isAuthenticated, player } = useAuth();

    const hasRequiredRole = allowedRoles[player.roleName];

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
        } catch (error) {
            message.error('Đã có lỗi xảy ra, vui lòng thử lại');
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
        } catch (error) {
            message.error('Đã có lỗi xảy ra, vui lòng thử lại');
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
        } catch (error) {
            message.error('Đã có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const handleDeletePost = useCallback(async () => {
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
    }, [id, navigate]);

    const handleDeleteButtonClick = () => {
        setIsDeleteDialogVisible(true);
    };

    const handleLoginButtonClick = () => {
        navigate('/login', { state: { from: location } });
    };

    const handleCloseDeleteDialogClick = () => {
        setIsDeleteDialogVisible(false);
    };

    useEffect(() => {
        const fetchComments = async () => {
            setIsCommentsLoading(true);
            try {
                const params = queryString.stringify(filters);
                const response = await getCommentByPostId(id, params);
                const { meta, items } = response.data.data;
                setComments(items);
                setMeta(meta);
            } catch (error) {
                setCommentErrorMessage(error);
            } finally {
                setIsCommentsLoading(false);
            }
        };

        fetchComments();
    }, [filters, id]);

    useEffect(() => {
        const fetchPost = async () => {
            setIsPostLoading(true);
            try {
                const response = await getPost(id);
                setPost(response.data.data);
            } catch (error) {
                setPostErrorMessage(error);
            } finally {
                setIsPostLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    return (
        <>
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

            {post && (
                <div className={cx('post-detail')}>
                    <div className="text-center">
                        <img src={images.plGif} alt="status" />
                        <div>Bài: {post.player.points}</div>
                    </div>

                    <div className={cx('post-wrapper')}>
                        <div className={cx('post-header')}>
                            <div>
                                <img
                                    className="me-1"
                                    src={post.player.isOnline ? images.online : images.offline}
                                    alt="status"
                                />
                                <Link to={`/player/${post.player.id}`} className={cx('username')}>
                                    {post.player.name}
                                </Link>
                            </div>

                            <div className={cx('time')}>
                                <DateFormatter datetime={post.lastModifiedDate} />

                                {isAuthenticated && post && (
                                    <Button
                                        type="primary"
                                        size="small"
                                        className="ms-2"
                                        onClick={handleToggleFollowPost}
                                    >
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
                                    </Button>
                                )}
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
                                        <Button type="default" size="small" onClick={handleToggleLockPost}>
                                            {post.locked ? 'Mở khóa' : 'Khóa'}
                                        </Button>
                                        <Button danger type="primary" size="small" onClick={handleDeleteButtonClick}>
                                            Xóa
                                        </Button>
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

            {isCommentsLoading ? (
                <div>Loading comments...</div>
            ) : commentErrorMessage ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi khi tải bình luận: {commentErrorMessage.message}
                </div>
            ) : comments.length > 0 ? (
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
            ) : (
                <div>No comments found.</div>
            )}

            {post &&
                !post.locked &&
                (isAuthenticated ? (
                    <NewComment postId={id} onCommentSubmit={handleCommentSubmit} />
                ) : (
                    <div className={cx('login-session')}>
                        Đăng nhập để bình luận
                        <span onClick={handleLoginButtonClick}>Đăng nhập</span>
                    </div>
                ))}

            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}

export default PostDetail;
