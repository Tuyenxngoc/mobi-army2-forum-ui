import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Style from './Forum.module.scss';
import classNames from 'classnames/bind';

import Post from '~/components/Post';
import Pagination from '~/components/Pagination';

import images from '~/assets';
import useAuth from '~/hooks/useAuth';
import { getAllCategories } from '~/services/categoryService';
import { getPosts } from '~/services/postService';

const cx = classNames.bind(Style);

function Forum() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);

    const { isAuthenticated, player, logout } = useAuth();

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 9) {
            return;
        }
        setCurrentPage(pageNumber);
    };

    const handleLoginClick = () => {
        // Navigate to the login page
        navigate('/login');
    };

    const handleLogoutClick = () => {
        logout();
    };

    const handleRegisterClick = () => {
        // Navigate to the registration page
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

    const fetchPosts = async () => {
        try {
            const posts = await getPosts();
            const { meta, items } = posts.data.data;
            setPosts(items);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, []);

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
                <Pagination totalPages={4} currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
        </main>
    );
}

export default Forum;
