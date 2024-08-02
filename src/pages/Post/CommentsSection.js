import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Skeleton, message } from 'antd';
import queryString from 'query-string';
import classNames from 'classnames/bind';
import Style from './PostDetail.module.scss';
import Comment from '~/components/Comment/Comment';
import NewComment from '~/components/Comment/NewComment';
import Pagination from '~/components/Pagination';
import { getCommentByPostId } from '~/services/commentService';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import useAuth from '~/hooks/useAuth';

const cx = classNames.bind(Style);

function CommentsSection({ postId, postLocked }) {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [comments, setComments] = useState([]);

    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [commentErrorMessage, setCommentErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            pageSize: parseInt(event.target.value, 10),
        }));
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

    const handleLoginButtonClick = () => {
        navigate('/login', { state: { from: location } });
    };

    useEffect(() => {
        const fetchComments = async () => {
            setIsCommentsLoading(true);
            try {
                const params = queryString.stringify(filters);
                const response = await getCommentByPostId(postId, params);
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
    }, [filters, postId]);

    return (
        <>
            {contextHolder}

            {isCommentsLoading ? (
                <div className={cx('comment-list')}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} active avatar />
                    ))}
                </div>
            ) : commentErrorMessage ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi khi tải bình luận: {commentErrorMessage.message}
                </div>
            ) : (
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

                    {!postLocked &&
                        (isAuthenticated ? (
                            <NewComment postId={postId} onCommentSubmit={handleCommentSubmit} message={messageApi} />
                        ) : (
                            <div className={cx('login-session')}>
                                Đăng nhập để bình luận
                                <span className="text-primary ms-1" onClick={handleLoginButtonClick}>
                                    Đăng nhập
                                </span>
                            </div>
                        ))}
                </div>
            )}

            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                isLoading={isCommentsLoading}
            />
        </>
    );
}

export default CommentsSection;
