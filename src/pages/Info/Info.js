import Notification from '../../components/Notification/Notification';
import Style from './Info.module.scss';
import classNames from 'classnames/bind';

import i0 from '../../assets/images/item/0.png';
import i1 from '../../assets/images/item/1.png';
import i3 from '../../assets/images/item/3.png';
import i5 from '../../assets/images/item/5.png';
import i6 from '../../assets/images/item/6.png';
import i7 from '../../assets/images/item/7.png';
import i8 from '../../assets/images/item/8.png';
import i9 from '../../assets/images/item/9.png';
import i10 from '../../assets/images/item/10.png';
import i11 from '../../assets/images/item/11.png';
import i16 from '../../assets/images/item/16.png';
import i17 from '../../assets/images/item/17.png';
import i18 from '../../assets/images/item/18.png';
import i19 from '../../assets/images/item/19.png';
import i20 from '../../assets/images/item/20.png';
import i21 from '../../assets/images/item/21.png';
import i22 from '../../assets/images/item/22.png';
import i24 from '../../assets/images/item/24.png';
import i25 from '../../assets/images/item/25.png';
import i26 from '../../assets/images/item/26.png';
import i28 from '../../assets/images/item/28.png';
import i29 from '../../assets/images/item/29.png';
import i30 from '../../assets/images/item/30.png';
import i31 from '../../assets/images/item/31.png';
import i32 from '../../assets/images/item/32.png';
import i33 from '../../assets/images/item/33.png';

const cx = classNames.bind(Style);

const items = [
    {
        img: i0,
        name: 'Cứu thương',
        des: 'Hồi phục HP, mang theo tối đa 2 gói trong 1 trận đấu'
    },
    {
        img: i1,
        name: 'Dịch chuyển tức thời',
        des: 'Dịch chuyển tức thời đến 1 vị trí khác, mang theo tối đa 2 gói trong 1 trận đấu'
    },
    {
        img: i3,
        name: 'Di chuyển x2',
        des: 'Di chuyển xa x2'
    },
    {
        img: i5,
        name: 'Ngưng gió',
        des: 'Ngưng gió trong 3 lượt bắn'
    },
    {
        img: i6,
        name: 'Bom phá đất',
        des: 'Phá nát mặt đất, gây khó khăn cho đối phương khi di chuyển'
    },
    {
        img: i7,
        name: 'Lựu đạn',
        des: 'Ném vào đối phương, sức hủy diệt cao'
    },
    {
        img: i8,
        name: 'Bom B52',
        des: 'Sức hủy diệt cao trên diện rộng'
    },
    {
        img: i9,
        name: 'Tơ nhện',
        des: 'Dùng để cản đường, làm đối phương bị mắc kẹt'
    },
    {
        img: i10,
        name: 'Cứu thương đồng đội',
        des: 'Dùng để cứu thương cho toàn bộ đồng đội'
    },
    {
        img: i11,
        name: 'Đạn trái phá',
        des: 'Phá nát mặt đất, gây khó khăn cho đối phương khi di chuyển'
    },
    {
        img: i16,
        name: 'Đạn Laze',
        des: 'Rọi tia Laze vào mục tiêu, sức hủy diệt cao'
    },
    {
        img: i17,
        name: 'Đạn vòi rồng',
        des: 'Tạo 1 cơn lốc xoáy làm lệch các đường đạn trong 3 lượt'
    },
    {
        img: i18,
        name: 'Chuột gắn bom',
        des: 'Thả chuột có gắn bom chạy đến mục tiêu rồi phát nổ, sức hủy diệt cao'
    },
    {
        img: i19,
        name: 'Tên lửa x4',
        des: 'Phóng ra 4 tên lửa nhắm vào 1 mục tiêu, sức hủy diệt cao'
    },
    {
        img: i20,
        name: 'Đạn xuyên đất',
        des: 'Đạn xuyên vào trong đất và nổ khi chạm mục tiêu, sức hủy điệt cao'
    },
    {
        img: i21,
        name: 'Mưa sao băng',
        des: 'Tạo một cơn mưa thiên thạch tiêu diệt nhiều mục tiêu trên diện rộng'
    },
    {
        img: i22,
        name: 'Mưa đạn',
        des: 'Tạo một cơn mưa đạn tiêu diệt nhiều mục tiêu trên diện rộng, sức hủy diệt cao'
    },
    {
        img: i25,
        name: 'Bom độc',
        des: 'Bom có chất độc, làm mất máu đối phương sau mỗi lượt'
    },
    {
        img: i26,
        name: 'Chong chóng khoan đất',
        des: 'Chong chóng xuyên vào trong đất, phát nổ khi chạm vào mục tiêu, sức hủy diệt cực cao'
    },
    {
        img: i28,
        name: 'Đóng băng',
        des: 'Đóng băng đối phương, không thể di chuyển'
    },
    {
        img: i29,
        name: 'Khí độc',
        des: 'Thả khói độc làm tiêu hao dần HP đối phương mỗi lượt'
    },
    {
        img: i30,
        name: 'Tơ nhện x3',
        des: 'Dùng để cản đường, làm đối phương bị mắc kẹt, bắn ra 3 lưới'
    },
    {
        img: i31,
        name: 'Bom hẹn giờ',
        des: 'Gài bom hẹn giờ để nổ sau 3 lượt, sức hủy diệt cực cao'
    },
    {
        img: i32,
        name: 'Cứu thương 50% HP',
        des: 'Phục hồi 50% HP'
    },
    {
        img: i33,
        name: 'Cứu thương 100% HP',
        des: 'Phục hồi 100% HP'
    },
    {
        img: i24,
        name: 'Bom tự sát',
        des: 'Cho nổ bom hi sinh kéo theo đối phương, sức hủy diệt cực cao'
    },
]
function Info() {
    return (
        <main>
            <Notification
                content={
                    <>
                        <h1>Giới thiệu:</h1>
                        <h3>Cách chơi:</h3>
                        <span>Bạn phải tính toán góc bắn và lực bắn kết hợp với sức gió để đường đi của viên đạn trúng đích, cách chơi như sau:</span>
                        <br />
                        <span>Chờ đến lượt của mình để bắn.</span>
                        <br />
                        <span>Đồng hồ sẽ hiển thị thời gian lượt bắn, nếu hết thời gian mà chưa bắn thì sẽ mất lượt. Chú ý là bạn có thể bị mất lượt do mạng bị lag.</span>
                        <br />
                        <span>Chạm vào nút di chuyển đối với màn hình cảm ứng để di chuyển nhân vật. Chú ý vào thanh sức lực (màu vàng), nếu hết sức thì nhân vật không thể di chuyển được.</span>
                        <br />
                        <span>Nhấn giữ phím bắn để chọn lực bắn, thả phím để bắn.</span>
                        <br />
                        <span>Chú ý vào thanh sức gió ngược chiều hay thuận chiều, gió mạnh hay nhẹ để thay đổi lực bắn và góc bắn phù hợp.</span>
                        <br />
                        <span>
                            <b>Khi chọn phòng chơi cần quan tâm các thông số sau:</b>
                        </span>
                        <br />
                        <ul style={{ listStyle: "none" }}>
                            <li>Số tiền cược / ván đấu.</li>
                            <li>Số người chơi / 1 phòng.</li>
                            <li>Bản đồ chiến đấu</li>
                        </ul>
                        <span>
                            <b>Trong game có các thông số người chơi cần phải biết:</b>
                        </span>
                        <br />
                        <ul style={{ listStyle: "none" }}>
                            <li>Thanh lực màu vàng: cho biết quãng đường người chơi có thể đi</li>
                            <li>Thanh lực màu cam : hiển thị lực bắn của người chơi.</li>
                            <li>Con số giữa  hai thanh : hiển thị góc bắn của người chơi.</li>
                            <li>Thanh lực nằm trên cùng màn hình: có hai phần trái và phải, hiển thị lực gió và góc của gió.</li>
                        </ul>
                        <h3>Chức năng chính:</h3>
                        <p>
                            <b>Đăng ký: </b>
                            <span> Bạn có thể chơi ngay mà không cần đăng kí, tuy nhiên bạn sẽ bị mất tài khoản nếu đổi điện thoại, đổi tài khoản khác hoặc cài lại game, và bạn chỉ chơi được đến một cấp độ nhất định. Để đăng kí, hãy chọn mục Đăng kí trong game hoặc tại màn hình đăng nhập.</span>
                        </p>
                        <br />
                        <p>
                            <b>Đăng nhập:</b>
                            <span> Nếu chưa đăng kí, bạn sẽ chơi ngay mà không cần đăng nhập. Nếu đã đăng kí ,hãy dùng tên tài khoản và mật khẩu để đăng nhập vào trò chơi.</span>
                        </p>
                        <br />
                        <p>
                            <b>Khu vực:</b>
                            <span> Trong game sẽ tổ chức nhiều khu vực chơi, tương ứng với cấp độ người chơi, người chơi hãy lựa chọn cấp độ khu vực thích hợp để có những đối thủ thích hợp. Danh sách có thông số cho biết số trận chiến đang trống và đang chờ trong khu vực. Nếu biết được khu vực cần vào thông qua bạn bè, người chơi có thể chọn tìm khu vực.</span>
                        </p>
                        <p>
                            Nếu vào trận chiến đang trống, bạn sẽ là chủ và có quyền đặt số tiền cược, đặt mật khẩu để vào và bắt đầu ván chơi khi có đủ người. Nếu không phải là chủ, bạn hãy chọn sẳn sàng và chờ chủ bàn bắt đầu ván chơi.Nếu muốn là chủ bàn, bạn hãy chọn mục Tạo khu vực.
                        </p>
                        <b>Item:</b>
                        <table border="0" cellPadding="1" cellSpacing="1">
                            <thead>
                                <tr align='center'>
                                    <th><small>Item</small></th>
                                    <th><small>Chức năng</small></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img
                                                style={{ border: 'none', margin: '0px', padding: '0px', width: '20px' }}
                                                src={item.img}
                                                alt={item.name}
                                            />
                                            <small>&nbsp;{item.name}</small>
                                        </td>
                                        <td>
                                            <small>{item.des}</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>}
                isLast
            />
        </main>
    );
}

export default Info;