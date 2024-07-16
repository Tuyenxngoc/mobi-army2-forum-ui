import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <main className="box-container p-2 text-center">
            <h1 className="text-black">Not found</h1>
            <p className="text-black">Trang bạn tìm kiếm không tồn tại.</p>
            <Link to="/">Trở về trang chủ</Link>
        </main>
    );
}

export default NotFound;
