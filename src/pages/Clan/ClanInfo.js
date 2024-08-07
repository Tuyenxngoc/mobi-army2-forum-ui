import { Button, Flex, message, Spin, Tag } from 'antd';
import { intervalToDuration } from 'date-fns';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BASE_URL, INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import useAuth from '~/hooks/useAuth';
import { getClanById, getClanMembers, joinClan, leaveClan } from '~/services/clanService';

const getTagColor = (categoryName) => {
    switch (categoryName) {
        case 'Đội trưởng':
            return 'red';
        case 'Hội phó':
            return 'green';
        default:
            return 'default';
    }
};

const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || seconds < 0) {
        return 'Đã hết hạn';
    }

    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

    const days = duration.days ?? 0;
    const hours = duration.hours ?? 0;
    const minutes = duration.minutes ?? 0;
    const secs = duration.seconds ?? 0;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${days}n ${formattedHours}:${formattedMinutes}:${formattedSecs}`;
};

function ClanInfo() {
    const { clanId } = useParams();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [clan, setClan] = useState(null);
    const [clanMembers, setClanMembers] = useState(null);

    const [isMembersLoading, setIsMembersLoading] = useState(true);
    const [membersError, setMembersError] = useState(null);

    const [isClanLoading, setIsClanLoading] = useState(true);
    const [clanLoadError, setClanLoadError] = useState(null);

    const { player, loadUserInfo } = useAuth();
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

    const handleJoinClan = async () => {
        try {
            const response = await joinClan(clanId);
            if (response.status === 200) {
                loadUserInfo();
            }
        } catch (error) {
            messageApi.error(`Lỗi: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleLeaveClan = async () => {
        try {
            const response = await leaveClan(clanId);
            if (response.status === 200) {
                loadUserInfo();
            }
        } catch (error) {
            messageApi.error(`Lỗi: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleManageMembers = () => {
        navigate(`/clan/${clanId}/manage-members`);
    };

    const handleUpdateClanInfo = () => {
        navigate(`/clan/${clanId}/update`);
    };

    useEffect(() => {
        const fetchClanInfo = async () => {
            setIsClanLoading(true);
            setClanLoadError(null);
            try {
                if (isNaN(clanId) || !/^-?\d+$/.test(clanId)) {
                    throw new Error('ID không hợp lệ. Vui lòng kiểm tra lại.');
                }
                const response = await getClanById(clanId);
                setClan(response.data.data);
            } catch (error) {
                setClanLoadError(error.message);
            } finally {
                setIsClanLoading(false);
            }
        };

        fetchClanInfo();
    }, [clanId]);

    useEffect(() => {
        const fetchClanMembers = async () => {
            setIsMembersLoading(true);
            setMembersError(null);
            try {
                if (isNaN(clanId) || !/^-?\d+$/.test(clanId)) {
                    return;
                }
                const params = queryString.stringify(filters);
                const response = await getClanMembers(clanId, params);
                const { meta, items } = response.data.data;
                setClanMembers(items);
                setMeta(meta);
            } catch (error) {
                setMembersError(error.message);
            } finally {
                setIsMembersLoading(false);
            }
        };

        fetchClanMembers();
    }, [clanId, filters]);

    const renderContent = () => {
        if (isClanLoading) {
            return (
                <div className="box-container">
                    <div className="forum-header">
                        <Link to="/clan">Quay lại</Link>
                    </div>
                    <div className="p-2">
                        <h3 className="forum-border-bottom text-primary">Thông tin biệt đội</h3>
                        <div className="alert alert-primary m-2 p-2" role="alert">
                            Loading... <Spin />
                        </div>
                    </div>
                </div>
            );
        }

        if (clanLoadError) {
            return (
                <div className="box-container">
                    <div className="forum-header">
                        <Link to="/clan">Quay lại</Link>
                    </div>
                    <div className="p-2">
                        <h3 className="forum-border-bottom text-primary">Thông tin biệt đội</h3>
                        <div className="alert alert-danger m-2 p-2" role="alert">
                            Lỗi: {clanLoadError}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="box-container mb-1">
                    <div className="forum-header">
                        <Link to="/clan">Quay lại</Link>
                    </div>

                    <div className="p-2">
                        <h3 className="forum-border-bottom text-primary">Thông tin biệt đội</h3>

                        <ul>
                            <li>Tên: {clan.name}</li>
                            <li>
                                Thành viên: {clan.memberCount} / {clan.memberMax}
                            </li>
                            <li>Ngày tạo: {clan.createdDate}</li>
                            <li>Tên đội trưởng: {clan.masterName}</li>
                            <li>
                                Biểu tượng: <img src={BASE_URL + clan.icon} alt="icon" />
                            </li>
                            <li>Cúp: {clan.cup}</li>
                            <li>Kinh nghiệm: {clan.xp}</li>
                            <li>Mô tả: {clan.description}</li>
                        </ul>

                        <Flex gap="small" align="center" justify="center" wrap>
                            {!player.clanMember ? (
                                <Button type="primary" size="small" onClick={handleJoinClan}>
                                    {clan.requireApproval ? 'Gửi đơn gia nhập' : 'Tham gia Clan'}
                                </Button>
                            ) : (
                                player.clanMember.clan.id === Number.parseInt(clanId) && (
                                    <>
                                        {player.clanMember.rights > 0 && (
                                            <>
                                                <Button type="primary" size="small" onClick={handleManageMembers}>
                                                    Quản lý thành viên
                                                </Button>
                                                <Button type="primary" size="small" onClick={handleUpdateClanInfo}>
                                                    Cập nhật thông tin
                                                </Button>
                                            </>
                                        )}
                                        <Button type="primary" size="small" danger onClick={handleLeaveClan}>
                                            Rời biệt đội
                                        </Button>
                                    </>
                                )
                            )}
                        </Flex>
                    </div>
                </div>

                <div className="box-container p-2 mb-1">
                    <h4 className="forum-border-bottom text-primary">Thông báo biệt đội</h4>
                    <h6 className="">{clan.notification}</h6>
                </div>

                <div className="box-container p-2 mb-1">
                    <h4 className="forum-border-bottom text-primary">Danh Sách Item</h4>
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Tên</th>
                                <th scope="col">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clan.items.length > 0 ? (
                                clan.items.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{item.name}</th>
                                        <td>{formatTime(item.time)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" align="center">
                                        Biệt đội chưa có item nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="box-container">
                    <div className="p-2">
                        <h4 className="forum-border-bottom text-primary">Danh Sách Thành Viên</h4>
                        {isMembersLoading ? (
                            <div className="alert alert-primary m-2 p-2" role="alert">
                                Đang tải thành viên... <Spin />
                            </div>
                        ) : membersError ? (
                            <div className="alert alert-danger m-2 p-2" role="alert">
                                Lỗi: {membersError}
                            </div>
                        ) : (
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Tên</th>
                                        <th scope="col">Tham gia</th>
                                        <th scope="col">Chức vụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clanMembers.length > 0 ? (
                                        clanMembers.map((member, index) => (
                                            <tr key={index}>
                                                <th scope="row">{member.name}</th>
                                                <td>{member.joinTime}</td>
                                                <td>
                                                    <Tag color={getTagColor(member.rights)}>{member.rights}</Tag>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" align="center">
                                                Không có thành viên nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <Pagination
                        totalPages={meta.totalPages || 1}
                        currentPage={filters.pageNum - 1}
                        rowsPerPage={meta.pageSize}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        isLoading={false}
                    />
                </div>
            </>
        );
    };

    return (
        <>
            {contextHolder}

            {renderContent()}
        </>
    );
}

export default ClanInfo;
