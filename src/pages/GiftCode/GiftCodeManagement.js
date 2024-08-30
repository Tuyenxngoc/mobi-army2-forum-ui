import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, message, Select, Space, Table } from 'antd';
import queryString from 'query-string';

import { INITIAL_FILTERS, INITIAL_META } from '~/common/commonConstants';
import Pagination from '~/components/Pagination/Pagination';
import { deleteGiftCode, getGiftCodes } from '~/services/giftCodeService';

const options = [
    { value: 'id', label: 'ID' },
    { value: 'code', label: 'Code' },
];

function GiftCodeManagement() {
    const navigate = useNavigate();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [giftCodes, setGiftCodes] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0].value);

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
            searchBy: activeFilterOption,
            keyword: searchInput,
        }));
    };

    const handleBtnCreateClick = () => {
        navigate('/admin/giftcode/new');
    };

    const handleSortChange = (pagination, filters, sorter) => {
        const sortOrder = sorter.order === 'ascend' ? true : sorter.order === 'descend' ? false : undefined;
        setFilters((prev) => ({
            ...prev,
            sortBy: sorter.field,
            isAscending: sortOrder,
        }));
    };

    const handleDeleteGiftCode = async (giftCodeId) => {
        setLoadingAction(true);
        try {
            const response = await deleteGiftCode(giftCodeId);
            if (response.status === 200) {
                setGiftCodes((prevCodes) => prevCodes.filter((code) => code.id !== giftCodeId));
                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            if (error?.response?.data?.message) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error(error.message);
            }
        } finally {
            setLoadingAction(false);
        }
    };

    useEffect(() => {
        const fetchGiftCodes = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getGiftCodes(params);
                const { meta, items } = response.data.data;
                setGiftCodes(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGiftCodes();
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
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
            showSorterTooltip: false,
            render: (text, record) => <Link to={`/admin/giftcode/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Giới hạn sử dụng',
            dataIndex: 'usageLimit',
            key: 'usageLimit',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            key: 'createdBy',
            sorter: true,
            showSorterTooltip: false,
        },
        {
            title: 'Người sửa đổi',
            dataIndex: 'lastModifiedBy',
            key: 'lastModifiedBy',
            sorter: true,
            showSorterTooltip: false,
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
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button
                    danger
                    type="primary"
                    size="small"
                    loading={loadingAction}
                    onClick={() => handleDeleteGiftCode(record.id)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    const renderContent = () => {
        if (errorMessage) {
            return (
                <div className="alert alert-danger p-2" role="alert">
                    Error: {errorMessage}
                </div>
            );
        }

        return (
            <Table
                rowKey="id"
                size="small"
                columns={columns}
                dataSource={giftCodes}
                pagination={false}
                loading={isLoading}
                onChange={handleSortChange}
                scroll={{
                    x: 1000,
                }}
            />
        );
    };

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to="/forum">Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title"> Quản lí mã quà tặng </h4>

                <div className="mb-2">
                    <Button type="primary" onClick={handleBtnCreateClick}>
                        Thêm mới
                    </Button>
                </div>

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
                    <Button type="primary" loading={isLoading} onClick={handleSearch}>
                        Tìm
                    </Button>
                </Space.Compact>

                {renderContent()}
            </div>

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

export default GiftCodeManagement;
