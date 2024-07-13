import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Style from './Forum.module.scss';
import classNames from 'classnames/bind';

import queryString from 'query-string';

import Post from '~/components/Post';
import Pagination from '~/components/Pagination';

import images from '~/assets';
import useAuth from '~/hooks/useAuth';
import { getAllCategories } from '~/services/categoryService';
import { getPosts } from '~/services/postService';

const cx = classNames.bind(Style);

function Forum() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState({
        totalPages: 1,
        pageSize: 10,
    });
    const [filters, setFilters] = useState({
        pageNum: 1,
        pageSize: 10,
    });

    const { isAuthenticated, player, logout } = useAuth();

    const handleChangePage = (newPage) => {
        setFilters({ ...filters, pageNum: newPage + 1 });
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ ...filters, pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        logout();
    };

    const handleRegisterClick = () => {
        navigate('/register');
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
            <div className="box-container">
                <div className={cx('authSection')}>
                    {isAuthenticated ? (
                        <>
                            <div>Xin chào {player.username}</div>
                            <button onClick={handleLogoutClick}>Đăng xuất</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleLoginClick}>Đăng nhập</button>
                            <button onClick={handleRegisterClick}>Đăng ký</button>
                        </>
                    )}
                    <div className={cx('recharge')}>
                        <a href="/">
                            <img src={images.army} alt="nap the" />
                        </a>
                    </div>
                </div>

                <div>
                    <Link to={'/post/new'}>Bài viết mới</Link>
                    <Link to={'/post/review'}>Duyệt bài viết</Link>
                </div>
            </div>
            <div>
                <div className={cx('box_forums')}>
                    <ul className={cx('forumList')}>
                        {categories.map((category, index) => (
                            <li key={index} className={cx('forumItem')}>
                                <Link to={`/${category.categoryId}`}>{category.name}</Link>
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
