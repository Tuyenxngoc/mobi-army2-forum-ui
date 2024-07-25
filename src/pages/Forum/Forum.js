import { useEffect, useState } from 'react';

import Style from './Forum.module.scss';
import classNames from 'classnames/bind';

import queryString from 'query-string';

import Post from '~/components/Post';
import Pagination from '~/components/Pagination';

import { getAllCategories } from '~/services/categoryService';
import { getPosts } from '~/services/postService';
import PlayerActions from '~/components/PlayerActions/PlayerActions';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import { Skeleton } from 'antd';

const cx = classNames.bind(Style);

function Forum() {
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
            keyword: categoryId,
            searchBy: 'category',
        });
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
        <main className="box-container">
            <PlayerActions />

            {isCategoriesLoading ? (
                <div className={cx('list')}>
                    <Skeleton.Button active block size="small" className="pe-1" />
                    <Skeleton.Button active block size="small" className="pe-1" />
                    <Skeleton.Button active block size="small" />
                </div>
            ) : categoryErrorMessage ? (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi khi tải danh mục: {categoryErrorMessage.message}
                </div>
            ) : (
                <ul className={cx('list')}>
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
                        <div>
                            <Skeleton active title={false} paragraph={{ rows: 1, width: 250 }} className="mb-1" />
                            <Skeleton active title={false} paragraph={{ rows: 1, width: 350 }} />
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
            />
        </main>
    );
}

export default Forum;
