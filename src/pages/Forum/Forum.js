import { Link } from "react-router-dom";

function Forum() {
    return (
        <main>
            <div>
                <div>
                    <Link to={'./login'}>Đăng nhập</Link>
                    <Link to={'./register'}>Đăng ký</Link>
                </div>
            </div>
        </main>
    );
}

export default Forum;