import { useEffect, useState } from 'react';

import Style from './Forum.module.scss';
import classNames from 'classnames/bind';

import queryString from 'query-string';

import Post from '~/components/Post';
import Pagination from '~/components/Pagination';

import { getAllCategories } from '~/services/categoryService';
import { getPosts } from '~/services/postService';
import PlayerActions from '~/components/PlayerActions/PlayerActions';
import { INITIAL_FILTERS, INITIAL_META, ROLES } from '~/common/contans';
import { Button, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAuth from '~/hooks/useAuth';

const cx = classNames.bind(Style);

const allowedRoles = {
    [ROLES.SuperAdmin]: true,
    [ROLES.Admin]: true,
};

function Forum() {
    const { isAuthenticated, player } = useAuth();

    const hasRequiredRole = allowedRoles[player.roleName];

    const navigate = useNavigate();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [isPostsLoading, setIsPostsLoading] = useState(true);
    const [postErrorMessage, setPostErrorMessage] = useState(null);

    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [categoryErrorMessage, setCategoryErrorMessage] = useState(null);

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleCategorySelection = (categoryId) => {
        setFilters({
            ...INITIAL_FILTERS,
            categoryId,
        });
    };

    const handleNewPostClick = () => {
        navigate('/post/new');
    };

    const handleFollowClick = () => {
        navigate('/following-post');
    };

    const handleManagePostsClick = () => {
        navigate('/admin/post');
    };

    const handleManageCategoriesClick = () => {
        navigate('/admin/category');
    };

    const handleManageMembersClick = () => {
        navigate('/admin/player');
    };

    const handleAddNotificationClick = () => {
        navigate('/admin/notification/new');
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setIsCategoriesLoading(true);
            setCategoryErrorMessage(null);
            try {
                const categories = await getAllCategories();
                setCategories(categories.data.data);
            } catch (error) {
                setCategoryErrorMessage(error);
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsPostsLoading(true);
            setPostErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getPosts(params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (error) {
                setPostErrorMessage(error);
            } finally {
                setIsPostsLoading(false);
            }
        };

        fetchPosts();
    }, [filters]);

    return (
        <div className="custom-bg-primary">
            <PlayerActions />

            {isAuthenticated && (
                <div className="box-container p-2 mb-1">
                    <Button size="small" type="default" onClick={handleNewPostClick}>
                        Bài viết mới
                    </Button>
                    <Button size="small" type="default" onClick={handleFollowClick}>
                        Theo giõi
                    </Button>
                </div>
            )}

            {hasRequiredRole && (
                <div className={cx('box-container', 'admin', 'p-2', 'mb-1')}>
                    <Button size="small" type="primary" onClick={handleManagePostsClick}>
                        Quản lý bài viết
                    </Button>
                    <Button size="small" type="primary" onClick={handleManageCategoriesClick}>
                        Quản lý danh mục
                    </Button>
                    <Button size="small" type="primary" onClick={handleManageMembersClick}>
                        Quản lý thành viên
                    </Button>
                    <Button size="small" type="primary" onClick={handleAddNotificationClick}>
                        Thêm thông báo
                    </Button>
                </div>
            )}

            <main className={cx('content')}>
                {isCategoriesLoading ? (
                    <div className="d-flex align-items-center">
                        <Skeleton.Button active block size="small" className="pe-1" />
                        <Skeleton.Button active block size="small" className="pe-1" />
                        <Skeleton.Button active block size="small" />
                    </div>
                ) : categoryErrorMessage ? (
                    <div className="alert alert-danger m-2 p-2" role="alert">
                        Lỗi khi tải danh mục: {categoryErrorMessage.message}
                    </div>
                ) : (
                    <ul className={cx('category-list')}>
                        <li className={cx('item')}>
                            <div onClick={() => handleCategorySelection(null)}>Tất cả</div>
                        </li>
                        {categories.map((category, index) => (
                            <li key={index} className={cx('item')}>
                                <div onClick={() => handleCategorySelection(category.id)}>{category.name}</div>
                            </li>
                        ))}
                    </ul>
                )}

                {isPostsLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="d-flex align-items-center p-1">
                            <div>
                                <Skeleton active title={false} avatar={{ shape: 'square' }} paragraph={false} />
                            </div>
                            <div className="w-100">
                                <Skeleton active title={false} paragraph={{ rows: 1, width: '50%' }} className="mb-1" />
                                <Skeleton active title={false} paragraph={{ rows: 1, width: '75%' }} />
                            </div>
                        </div>
                    ))
                ) : postErrorMessage ? (
                    <div className="alert alert-danger m-2 p-2" role="alert">
                        Lỗi khi tải bài viết: {postErrorMessage.message}
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((item, i) => <Post key={i} data={item} />)
                ) : (
                    <div className={cx('empty-box', 'p-2')}>Box hiện chưa có bài viết nào ... !</div>
                )}

                <Pagination
                    totalPages={meta.totalPages || 1}
                    currentPage={filters.pageNum - 1}
                    rowsPerPage={meta.pageSize}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    isLoading={isPostsLoading}
                />
            </main>
        </div>
    );
}

export default Forum;
