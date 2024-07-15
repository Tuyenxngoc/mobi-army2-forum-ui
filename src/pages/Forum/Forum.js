import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Style from './Forum.module.scss';
import classNames from 'classnames/bind';

import queryString from 'query-string';

import Post from '~/components/Post';
import Pagination from '~/components/Pagination';

import { getAllCategories } from '~/services/categoryService';
import { getPosts } from '~/services/postService';
import PlayerActions from '~/components/PlayerActions/PlayerActions';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';

const cx = classNames.bind(Style);

function Forum() {
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const fetchCategories = async () => {
        try {
            const categories = await getAllCategories();
            setCategories(categories.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const params = queryString.stringify(filters);
                const response = await getPosts(params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [filters]);

    return (
        <main>
            <div className="box-container p-2">
                <PlayerActions />
            </div>
            <div>
                <div className={cx('box-forums')}>
                    <ul className={cx('forum-list')}>
                        {categories.map((category, index) => (
                            <li key={index} className={cx('forum-item')}>
                                <Link to={`/category/${category.id}`}>{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {posts.map((item, i) => (
                        <Post key={i} data={item} />
                    ))}
                </div>

                <Pagination
                    totalPages={meta.totalPages}
                    currentPage={filters.pageNum - 1}
                    rowsPerPage={meta.pageSize}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </main>
    );
}

export default Forum;
