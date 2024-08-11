import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Input, Select, Space, Table } from 'antd';
import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import { getPlayers } from '~/services/playerService';

const options = [
    { value: 'id', label: 'ID' },
    { value: 'username', label: 'Tên' },
];

function PlayerManagement() {
    const navigate = useNavigate();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [players, setPlayers] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0].value);

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

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            searchBy: activeFilterOption,
            keyword: searchInput,
        }));
    };

    const handleSortChange = (pagination, filters, sorter) => {
        const sortOrder = sorter.order === 'ascend' ? true : sorter.order === 'descend' ? false : undefined;
        setFilters((prev) => ({
            ...prev,
            sortBy: sorter.field,
            isAscending: sortOrder,
        }));
    };

    const handleButtonNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getPlayers(params);
                const { meta, items } = response.data.data;
                setPlayers(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayers();
    }, [filters]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Tên',
            dataIndex: 'username',
            key: 'username',
            render: (text, record) => <Link to={`/player/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Quyền',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Ngày sửa đổi',
            dataIndex: 'lastModifiedDate',
            key: 'lastModifiedDate',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Xu',
            dataIndex: 'xu',
            key: 'xu',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Lượng',
            dataIndex: 'luong',
            key: 'luong',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Danh dự',
            dataIndex: 'cup',
            key: 'cup',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Số bài viết',
            dataIndex: 'posts',
            key: 'posts',
        },
        {
            title: 'Số bình luận',
            dataIndex: 'comments',
            key: 'comments',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: () => (
                <Space>
                    <Button type="primary" size="small" onClick={() => handleButtonNavigation('promote')}>
                        Thăng chức
                    </Button>
                    <Button size="small" onClick={() => handleButtonNavigation('history')}>
                        Lịch sử
                    </Button>
                    <Button danger type="primary" size="small" onClick={() => handleButtonNavigation('lock-account')}>
                        Khóa tài khoản
                    </Button>
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
                <h4 className="title"> Quản lý người chơi </h4>

                <Space.Compact className="mb-2">
                    <Select
                        options={options}
                        disabled={isLoading}
                        value={activeFilterOption}
                        onChange={(value) => setActiveFilterOption(value)}
                    />
                    <Input
                        name="searchInput"
                        allowClear
                        placeholder="Nhập từ cần tìm..."
                        value={searchInput}
                        disabled={isLoading}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button type="primary" loading={isLoading} onClick={() => handleSearch()}>
                        Tìm
                    </Button>
                </Space.Compact>

                <Table
                    rowKey="id"
                    size="small"
                    columns={columns}
                    dataSource={players}
                    pagination={false}
                    loading={isLoading}
                    onChange={handleSortChange}
                    scroll={{
                        x: 1500,
                    }}
                />
            </div>
        );
    };

    return (
        <div className="box-container">
            <div className="forum-header">
                <Link to="/forum">Quay lại</Link>
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

export default PlayerManagement;
