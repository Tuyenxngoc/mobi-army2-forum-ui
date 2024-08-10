import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import queryString from 'query-string';
import { Spin } from 'antd';

import Post from '~/components/Post';
import Pagination from '~/components/Pagination';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import { getFollowingPosts } from '~/services/playerService';

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
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            pageSize: parseInt(event.target.value, 10),
        }));
    };

    useEffect(() => {
        const fetchFollowingPosts = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getFollowingPosts(params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
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
                    Lỗi: {errorMessage}
                </div>
            );
        }

        return (
            <>
                {posts.length > 0 ? (
                    posts.map((item, i) => <Post key={i} data={item} />)
                ) : (
                    <p className="px-2">Chưa có bài viết nào.</p>
                )}
            </>
        );
    };

    return (
        <div className="box-container">
            <div className="forum-header">
                <Link to="/forum">Quay lại</Link>
            </div>

            <h3 className="p-2 pb-0">Các bài viết đang theo dõi</h3>

            {renderContent()}

            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                isLoading={isLoading}
            />
        </div>
    );
}

export default FollowingPosts;
