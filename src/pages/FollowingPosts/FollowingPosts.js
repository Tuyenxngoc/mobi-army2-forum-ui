import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PlayerActions from '~/components/PlayerActions/PlayerActions';

import classNames from 'classnames/bind';
import Style from './FollowingPosts.module.scss';
import Pagination from '~/components/Pagination';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import queryString from 'query-string';
import { Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMessage } from '@fortawesome/free-regular-svg-icons';
import DateFormatter from '~/components/DateFormatter/DateFormatter';
import { getFollowingPosts } from '~/services/playerService';

const cx = classNames.bind(Style);

function FollowingPosts() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [posts, setPosts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    useEffect(() => {
        const fetchFollowingPosts = async () => {
            try {
                const params = queryString.stringify(filters);
                const response = await getFollowingPosts(params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (err) {
                setErrorMessage(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowingPosts();
    }, [filters]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="alert alert-primary m-2 p-2" role="alert">
                    Loading... <Spin />
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: {errorMessage.message}
                </div>
            );
        }

        return (
            <div>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className={cx('item', 'p-2')}>
                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                            <div>
                                bởi {post.author} <DateFormatter datetime={post.createdDate} />{' '}
                                <FontAwesomeIcon icon={faHeart} /> {post.favorites} <FontAwesomeIcon icon={faMessage} />{' '}
                                {post.comments}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="px-2">Chưa có bài viết nào.</p>
                )}
            </div>
        );
    };

    return (
        <>
            <h3 className="p-2 pb-0">Các bài viết đang theo dõi</h3>

            {renderContent()}

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

export default FollowingPosts;
