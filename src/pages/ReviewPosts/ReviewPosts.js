import React, { useState, useEffect } from 'react';
import PlayerActions from '~/components/PlayerActions/PlayerActions';
import { getPostsForReview, approvePost, deletePost } from '~/services/postService.js';
import Style from './ReviewPosts.module.scss';
import classNames from 'classnames/bind';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import queryString from 'query-string';
import Pagination from '~/components/Pagination';
import { Link } from 'react-router-dom';
import DateFormatter from '~/components/DateFormatter/DateFormatter';

const cx = classNames.bind(Style);

const ReviewPosts = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPosts(posts.map((post) => post.id));
        } else {
            setSelectedPosts([]);
        }
    };

    const handleSelectPost = (postId) => {
        setSelectedPosts((prevSelected) =>
            prevSelected.includes(postId) ? prevSelected.filter((id) => id !== postId) : [...prevSelected, postId],
        );
    };

    const handleApproveAll = () => {
        selectedPosts.forEach((postId) => handleApprove(postId));
    };

    const handleRemoveAll = () => {
        selectedPosts.forEach((postId) => handleRemove(postId));
    };

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleApprove = (postId) => {
        approvePost(postId)
            .then((response) => {
                setPosts(posts.filter((post) => post.id !== postId));
                setSelectedPosts(selectedPosts.filter((id) => id !== postId));
                alert('Duyệt thành công');
            })
            .catch((error) => {
                console.error('Có lỗi xảy ra:', error);
            });
    };

    const handleRemove = (postId) => {
        deletePost(postId)
            .then((response) => {
                setPosts(posts.filter((post) => post.id !== postId));
                setSelectedPosts(selectedPosts.filter((id) => id !== postId));
                alert('Xóa thành công');
            })
            .catch((error) => {
                console.error('Có lỗi xảy ra:', error);
            });
    };

    const handleView = (postId) => {};

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const params = queryString.stringify(filters);
                const response = await getPostsForReview(params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
            }
        };

        fetchPosts();
    }, [filters]);

    return (
        <div className="box-container">
            <PlayerActions />

            <div className={cx('header')}>
                <Link to="/forum">Quay lại</Link>
            </div>

            <div>
                <h3 className="p-2 pb-0"> Duyệt bài viết</h3>
                {posts.length === 0 ? (
                    <p>Không có bài viết nào cần duyệt.</p>
                ) : (
                    <>
                        <div className={cx('post-actions-wrapper')}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultValue=""
                                    id="checkAll"
                                    onChange={handleSelectAll}
                                    checked={selectedPosts.length === posts.length && posts.length !== 0}
                                />
                                <label className="form-check-label" htmlFor="checkAll">
                                    Chọn tất cả
                                </label>
                            </div>

                            <div>
                                <button onClick={handleApproveAll} disabled={selectedPosts.length === 0}>
                                    Duyệt tất cả ({selectedPosts.length})
                                </button>
                                <button onClick={handleRemoveAll} disabled={selectedPosts.length === 0}>
                                    Xóa tất cả ({selectedPosts.length})
                                </button>
                            </div>
                        </div>

                        <ul className={cx('post-list')}>
                            {posts.map((post) => (
                                <li key={post.id} className={cx('post-item')} onClick={() => handleSelectPost(post.id)}>
                                    <div className={cx('post-wrapper')}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            onChange={() => handleSelectPost(post.id)}
                                            checked={selectedPosts.includes(post.id)}
                                        />
                                        <div className={cx('post-content')}>
                                            <div className={cx('post-title')}>{post.title}</div>
                                            <span>
                                                tạo bởi{' '}
                                                <Link to={`/player/${1}`} target="_blank">
                                                    {post.author}{' '}
                                                </Link>
                                                lúc{' '}
                                                <span>
                                                    <DateFormatter datetime="2021-01-01" />
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cx('post-actions')}>
                                        <button onClick={() => handleView(post.id)}>Xem</button>
                                        <button onClick={() => handleApprove(post.id)}>Duyệt</button>
                                        <button onClick={() => handleRemove(post.id)}>Xóa</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            <Pagination
                totalPages={meta.totalPages}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ReviewPosts;
