import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, message, Select, Space, Table } from 'antd';
import queryString from 'query-string';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import { approvePost, deletePost, getPostsForAdmin, toggleLock } from '~/services/postService';

const options = [
    {
        value: 'title',
        label: 'Tiêu đề',
    },
    {
        value: 'id',
        label: 'ID',
    },
    {
        value: 'player',
        label: 'Tác giả',
    },
    {
        value: 'categoryName',
        label: 'Tên danh mục',
    },
    {
        value: 'approvedBy',
        label: 'Người duyệt',
    },
];

function PostManagement() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [posts, setPosts] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [loadingAction, setLoadingAction] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

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

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            searchBy: activeFilterOption.value,
            keyword: searchInput,
        }));
    };

    const handleToggleLockPost = async (postId) => {
        setLoadingAction(true);
        try {
            const response = await toggleLock(postId);

            if (response.status === 200) {
                const updatedPosts = posts.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            locked: !post.locked,
                        };
                    }
                    return post;
                });

                setPosts(updatedPosts);
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleApprovePost = async (postId) => {
        setLoadingAction(true);
        try {
            const response = await approvePost(postId);
            if (response.status === 200) {
                const updatedPosts = posts.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            approved: true,
                        };
                    }
                    return post;
                });

                setPosts(updatedPosts);
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeletePost = async (postId) => {
        setLoadingAction(true);
        try {
            const response = await deletePost(postId);

            if (response.status === 200) {
                const updatedPosts = posts.filter((post) => post.id !== postId);
                setPosts(updatedPosts);
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setLoadingAction(false);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getPostsForAdmin(params);
                const { meta, items } = response.data.data;
                setPosts(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [filters]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            responsive: ['lg', 'md'],
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`/admin/post/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            responsive: ['lg'],
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.locked ? (
                        <Button
                            type="default"
                            size="small"
                            loading={loadingAction}
                            onClick={() => handleToggleLockPost(record.id)}
                        >
                            Mở Khóa
                        </Button>
                    ) : (
                        <Button
                            type="default"
                            size="small"
                            loading={loadingAction}
                            onClick={() => handleToggleLockPost(record.id)}
                        >
                            Khóa
                        </Button>
                    )}
                    <Button
                        danger
                        type="primary"
                        size="small"
                        loading={loadingAction}
                        onClick={() => handleDeletePost(record.id)}
                    >
                        Xóa
                    </Button>
                    {!record.approved && (
                        <Button
                            type="primary"
                            size="small"
                            loading={loadingAction}
                            onClick={() => handleApprovePost(record.id)}
                        >
                            Duyệt
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const renderContent = () => {
        if (errorMessage) {
            return (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: {errorMessage}
                </div>
            );
        }

        return (
            <div className="p-2">
                <Table
                    dataSource={posts}
                    columns={columns}
                    size="small"
                    pagination={false}
                    rowKey="id"
                    loading={isLoading}
                />
            </div>
        );
    };

    return (
        <>
            {contextHolder}

            <h3 className="p-2 pb-0"> Quản lý bài viết </h3>

            <Space.Compact className="p-2">
                <Select
                    options={options}
                    disabled={isLoading}
                    value={activeFilterOption}
                    onChange={(_, option) => {
                        setActiveFilterOption(option);
                    }}
                />
                <Input
                    allowClear
                    placeholder="Nhập từ cần tìm..."
                    value={searchInput}
                    disabled={isLoading}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button type="primary" loading={isLoading} onClick={handleSearch}>
                    Tìm
                </Button>
            </Space.Compact>

            {renderContent()}

            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                isLoading={isLoading}
            />
        </>
    );
}

export default PostManagement;
