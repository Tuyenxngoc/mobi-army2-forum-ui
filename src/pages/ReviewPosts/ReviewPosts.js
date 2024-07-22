import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, message, Modal } from 'antd';
import classNames from 'classnames/bind';
import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import PlayerActions from '~/components/PlayerActions/PlayerActions';
import Pagination from '~/components/Pagination';
import DateFormatter from '~/components/DateFormatter/DateFormatter';
import { getPostsForReview, approvePost, deletePost, getPost } from '~/services/postService.js';
import Style from './ReviewPosts.module.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';

const cx = classNames.bind(Style);

const ReviewPosts = () => {
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [postDetails, setPostDetails] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleApprove = async (postId) => {
        try {
            await approvePost(postId);
            setPosts(posts.filter((post) => post.id !== postId));
            messageApi.success('Duyệt thành công');
        } catch (error) {
            messageApi.error('Có lỗi xảy ra:', error);
        }
    };

    const handleRemove = async (postId) => {
        try {
            await deletePost(postId);
            setPosts(posts.filter((post) => post.id !== postId));
            messageApi.success('Xóa thành công');
        } catch (error) {
            messageApi.error('Có lỗi xảy ra:', error);
        }
    };

    const handleView = async (postId) => {
        setLoading(true);
        setOpen(true);
        try {
            const response = await getPost(postId);
            setPostDetails(response.data.data);
        } catch (error) {
            messageApi.error('Có lỗi xảy ra khi lấy chi tiết bài viết:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const params = queryString.stringify(filters);
                const response = await getPostsForReview(params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (error) {
                messageApi.error('Có lỗi xảy ra:', error);
            }
        };

        fetchPosts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return (
        <div className="box-container">
            <Modal
                title="Chi tiết bài viết"
                footer={
                    <Button type="primary" onClick={() => setOpen(false)}>
                        Đóng
                    </Button>
                }
                loading={loading}
                open={open}
                onCancel={() => setOpen(false)}
            >
                {postDetails && (
                    <div className={cx('modal-content-scrollable')}>
                        <h2>{postDetails.title}</h2>
                        <div
                            className={cx('ql-snow', 'ql-editor', 'content')}
                            dangerouslySetInnerHTML={{ __html: postDetails.content }}
                        />
                        <p>
                            tạo bởi{' '}
                            <Link to={`/player/${postDetails.player.id}`} target="_blank">
                                {postDetails.player.name}
                            </Link>{' '}
                            lúc <DateFormatter datetime={postDetails.createdDate} />
                        </p>
                    </div>
                )}
            </Modal>

            {contextHolder}

            <PlayerActions />

            <div className={cx('header')}>
                <Link to="/forum">Quay lại</Link>
            </div>

            <div>
                <h3 className="p-2 pb-0"> Duyệt bài viết</h3>
                {posts.length === 0 ? (
                    <p className="px-2">Không có bài viết nào cần duyệt.</p>
                ) : (
                    <ul className={cx('post-list')}>
                        {posts.map((post) => (
                            <li key={post.id} className={cx('post-item')}>
                                <div className={cx('post-content')}>
                                    <div className={cx('post-title')}>{post.title}</div>
                                    <span>
                                        tạo bởi{' '}
                                        <Link to={`/player/${1}`} target="_blank">
                                            {post.author}{' '}
                                        </Link>
                                        lúc{' '}
                                        <span>
                                            <DateFormatter datetime={post.createdDate} />
                                        </span>
                                    </span>
                                </div>
                                <div className={cx('post-actions')}>
                                    <button onClick={() => handleView(post.id)}>Xem</button>
                                    <button onClick={() => handleApprove(post.id)}>Duyệt</button>
                                    <button onClick={() => handleRemove(post.id)}>Xóa</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ReviewPosts;
