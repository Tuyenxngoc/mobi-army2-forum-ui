import Style from './Home.module.scss';
import classNames from 'classnames/bind';

import background from '~/assets/images/background.jpg';
import apk_0 from '~/assets/images/apk_0.png';
import apk_1 from '~/assets/images/apk_1.png';

import DownloadItem from '~/components/DownloadItem/DownloadItem';
import Notification from '~/components/Notification/Notification';

const cx = classNames.bind(Style);

const downloadInfo = [
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: apk_0,
        icon2: apk_1,
    },
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: apk_0,
        icon2: apk_1,
    },
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: apk_0,
        icon2: apk_1,
    },
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: apk_0,
        icon2: apk_1,
    },
];

function Home() {
    return (
        <main>
            <div className={cx('slide')}>
                <img src={background} alt="background" />
            </div>
            <div className={cx('download')}>
                <div className="container">
                    <div className="row">
                        {downloadInfo.map((item, index) => (
                            <div className="col-lg-3 col-md-6 col-sm-6 col-6" key={index}>
                                <DownloadItem content={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={cx('notificationWrapper')}>
                <Notification
                    title="Thông báo mới"
                    content={
                        <>
                            <p>
                                <span>
                                    Mobi Army 2 là một game casual bắn súng canh tọa độ theo lượt với cách chơi đơn
                                    giản, mỗi phát bắn cần phải canh góc, lực gió và trọng lượng viên đạn mọi thứ phải
                                    chính xác đến từng centimet để trúng được mục tiêu.
                                </span>
                                <br />
                                <br />
                                <span>
                                    Với lớp nhân vật đa dạng cùng với nét đặc trưng của từng nhân vật kèm theo tuyệt
                                    chiêu riêng biệt đặc sắc. Bên cạnh đó sẽ không thiếu những Items mới độc đáo như:
                                    Đạn vòi rồng, Lazer, Trái phá, Chuột gắn bom, Tên lửa, Đạn xuyên đất, Sao băng, Mưa
                                    đạn, Khoan đất...
                                </span>
                            </p>
                            <p>
                                <span>
                                    Thật là thiếu sót nếu không có những màn Đấu Trùm đầy căng thẳng, kịch tính với sự
                                    kết hợp hoàn hảo giữa các thành viên trong nhóm.
                                </span>
                                <br />
                                <br />
                                <span>
                                    Cuộc tranh tài của các bạn sẽ càng hấp dẫn hơn, khốc liệt hơn và đầy bất ngờ hơn.
                                    Mobi Army 2 với những vùng chiến đấu mới như: vùng băng tuyết, vùng căn cứ thép,
                                    những hoang mạc và những đồng cỏ, rừng chết… Với Mobi Army 2 thì cuộc chiến dường
                                    như không bao giờ chấm dứt .
                                </span>
                                <br />
                                <br />
                                <span>
                                    Thật hấp dẫn phải không nào!!! Nào cùng tham gia chiến đấu để tranh tài cao thấp
                                    nào!!!
                                </span>
                            </p>
                        </>
                    }
                    date="Cách đây 2 năm"
                />
                <Notification
                    title="Hướng Dẫn Tân Thủ"
                    content={
                        <>
                            <span>1. Đăng ký tài khoản</span>
                            <br />
                            <span>
                                Bạn có thể đăng ký tài khoản miễn phí ngay trong game, hoặc trên trang Diễn Đàn.
                            </span>
                            <br />
                            <span>
                                Khi đăng ký, bạn nên sử dụng đúng số điện thoại hoặc email thật của mình. Nếu sử dụng
                                thông tin sai, người có số điện thoại hoặc email thật sẽ có thể lấy mật khẩu của bạn.
                            </span>
                            <br />
                            <span>
                                Số điện thoại và email của bạn sẽ không hiện ra cho người khác thấy. Admin không bao giờ
                                hỏi mật khẩu của bạn.
                            </span>
                            <br />
                            <br />
                            <span>2. Hướng dẫn điểu khiển</span>
                            <br />
                            <span>
                                Dùng tay chạm vào mũi tên để di chuyển. Chạm vào nút chỉnh góc sau lưng nhân vật để canh
                                góc bắn, chạm và giữ nút bắn góc phải màn hình để canh lực bắn.
                            </span>
                            <br />
                            <br />
                            <span>3. Một số thông tin căn bản</span>
                            <br />
                            <span>
                                Bạn phải có ít nhất 1000 vàng mới có thể vào khu vực chọn phòng chơi, nếu không đủ 1000
                                vàng, hãy vào phòng Luyện tập (ngoài màn hình chính) để kiếm đủ tiền.
                            </span>
                            <br />
                        </>
                    }
                    date="Cách đây 2 năm"
                />
                <Notification
                    title="Bạn nên tải phiên bản nào?"
                    content={<span>Trò chơi được phát triển trên mọi nền tảng.</span>}
                    date="Cách đây 2 năm"
                    isLast
                />
            </div>
        </main>
    );
}

export default Home;
