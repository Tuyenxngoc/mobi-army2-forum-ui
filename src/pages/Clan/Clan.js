import { Button, Spin } from 'antd';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL, INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import { getclans } from '~/services/clanService';

function Clan() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const navigate = useNavigate();

    const [clans, setClans] = useState([]);

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
                <div className="alert alert-primary m-2 p-2" role="alert">
                    Loading... <Spin />
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: {errorMessage}
                </div>
            );
        }

        return (
            <div className="p-2">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Icon</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Đội trưởng</th>
                            <th scope="col">Thành viên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clans.map((clan, index) => (
                            <tr key={index}>
                                <th scope="row">
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
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            <h3 className="p-2 pb-0">Danh sách biệt đội</h3>

            <div className="p-2">
                <Button type="primary" onClick={handleButtonCreateClick}>
                    Thành lập biệt đội
                </Button>
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
        </>
    );
}

export default Clan;
