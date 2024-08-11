import { Button, Input, Select, Space, Spin } from 'antd';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL, INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import useAuth from '~/hooks/useAuth';
import { getclans } from '~/services/clanService';

const options = [
    { value: 'name', label: 'Tên đội' },
    { value: 'id', label: 'ID' },
    { value: 'master', label: 'Tên đội trưởng' },
];

function Clan() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const navigate = useNavigate();

    const [clans, setClans] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [activeFilterOption, setActiveFilterOption] = useState(options[0].value);

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

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            searchBy: activeFilterOption,
            keyword: searchInput,
        }));
    };

    const handleButtonCreateClick = () => {
        navigate('/clan/new');
    };

    useEffect(() => {
        const fetchClans = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const params = queryString.stringify(filters);
                const response = await getclans(params);
                const { meta, items } = response.data.data;
                setClans(items);
                setMeta(meta);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClans();
    }, [filters]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="alert alert-primary p-2" role="alert">
                    Loading... <Spin />
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="alert alert-danger p-2" role="alert">
                    Lỗi: {errorMessage}
                </div>
            );
        }

        return (
            <main className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Icon</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Đội trưởng</th>
                            <th scope="col">Thành viên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clans.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Không có clan nào
                                </td>
                            </tr>
                        ) : (
                            clans.map((clan, index) => (
                                <tr key={index}>
                                    <th scope="row">{clan.id}</th>
                                    <th>
                                        <img src={BASE_URL + clan.icon} alt="Icon clan" />
                                    </th>
                                    <td>
                                        <Link to={`/clan/${clan.id}`}>{clan.name}</Link>
                                    </td>
                                    <td>{clan.masterName}</td>
                                    <td>
                                        {clan.memberCount}/{clan.memberMax}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </main>
        );
    };

    return (
        <div className="box-container">
            <div className="header">
                <Link to={`/player/${player.id}`}>Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title">Danh sách biệt đội</h4>

                <div className="mb-2">
                    <Button type="primary" onClick={handleButtonCreateClick}>
                        Thành lập biệt đội
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
                        allowClear
                        name="searchInput"
                        placeholder="Nhập từ cần tìm..."
                        value={searchInput}
                        disabled={isLoading}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button type="primary" loading={isLoading} onClick={() => handleSearch()}>
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

export default Clan;
