import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Spin } from 'antd';
import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import { getPostsByPlayerId } from '~/services/postService';
import { checkIdIsNumber } from '~/utils/helper';
import Post from '~/components/Post';
import Pagination from '~/components/Pagination';
import useAuth from '~/hooks/useAuth';

function PlayerPost() {
    const { playerId } = useParams();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [posts, setPosts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const { player } = useAuth();

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
        if (!checkIdIsNumber(playerId)) {
            navigate('/forum', { replace: true });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchPlayerPosts = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                if (!checkIdIsNumber(playerId)) {
                    return;
                }
                const params = queryString.stringify(filters);
                const response = await getPostsByPlayerId(playerId, params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayerPosts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className="header">
                <Link to={`/player/${player.id}`}>Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title">Danh sách bài viết</h4>
            </div>

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

export default PlayerPost;
