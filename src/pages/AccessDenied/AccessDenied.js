import React from 'react';
import { Link } from 'react-router-dom';

function AccessDenied() {
    return (
        <main className="box-container p-2 text-center">
            <h1 className="text-black">Access Denied</h1>
            <p className="text-black">Bạn không có quyền truy cập vào trang này.</p>
            <Link to="/">Quay lại trang chủ</Link>
        </main>
    );
}

export default AccessDenied;
