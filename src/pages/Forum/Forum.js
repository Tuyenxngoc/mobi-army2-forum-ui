import { Link, useNavigate } from 'react-router-dom';
import Style from './Forum.module.scss';
import classNames from 'classnames/bind';
import Topic from '~/components/Topic';

import images from '~/assets';
import Pagination from '~/components/Pagination';
import { useEffect, useState } from 'react';
import useAuth from '~/hooks/useAuth';
import { getAllCategories } from '~/services/categoryService';

const cx = classNames.bind(Style);

const data = [
    {
        user: {
            username: 'admin',
            avatar: images.plGif,
            id: 1,
        },
        title: 'Army2 cho ip ios có sever trái đất',
        comment: 10,
        view: 1023,
        favourite: 1,
    },
    {
        user: {
            username: 'admin',
            avatar: images.plGif,
            id: 1,
        },
        title: 'Army2 cho ip ios có sever trái đất',
        comment: 10,
        view: 1023,
        favourite: 1,
    },
    {
        user: {
            username: 'admin',
            avatar: images.plGif,
            id: 1,
        },
        title: 'Army2 cho ip ios có sever trái đất',
        comment: 10,
        view: 1023,
        favourite: 1,
    },
    {
        user: {
            username: 'admin',
            avatar: images.plGif,
            id: 1,
        },
        title: 'Army2 cho ip ios có sever trái đất',
        comment: 10,
        view: 1023,
        favourite: 1,
    },
    {
        user: {
            username: 'admin',
            avatar: images.plGif,
            id: 1,
        },
        title: 'Army2 cho ip ios có sever trái đất',
        comment: 10,
        view: 1023,
        favourite: 1,
    },
];
function Forum() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        fetchCategories();
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
                <div className="topic-list">
                    {data.map((item, i) => (
                        <Topic key={i} data={item} />
                    ))}
                </div>
                <Pagination totalPages={4} currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
        </main>
    );
}

export default Forum;