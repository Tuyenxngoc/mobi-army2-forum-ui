import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { confirmEmail, resendConfirmationEmail } from '~/services/authService';

const ConfirmEmail = () => {
    const location = useLocation();
    const [counter, setCounter] = useState(60);
    const [messageApi, contextHolder] = message.useMessage();

    const email = location.state?.email;

    const verifyEmail = useCallback(
        async (code) => {
            if (!code) return;
            try {
                const response = await confirmEmail(code);
                if (response.status === 200) {
                    messageApi.success(response?.data?.data?.message);
                }
            } catch (error) {
                messageApi.error('Xác thực thất bại. Mã xác thực không hợp lệ.');
            }
        },
        [messageApi],
    );

    const handleResendEmail = useCallback(async () => {
        setCounter(60);
        try {
            const currentURL = window.location.origin;
            const response = await resendConfirmationEmail(email, currentURL);
            if (response.status === 200) {
                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            messageApi.error('Gửi lại mã xác nhận thất bại.');
        }
    }, [email, messageApi]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        verifyEmail(code);
    }, [location, verifyEmail]);

    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [counter]);

    return (
        <div className="box-container p-2">
            {contextHolder}

            {!email ? (
                <div className="text-center">
                    <h4>Xác minh bằng liên kết gửi qua Email</h4>
                    <Link to="/">Quay lại trang chủ</Link>
                </div>
            ) : (
                <>
                    <div>Xác minh bằng liên kết gửi qua Email</div>
                    <p>Vui lòng nhấn vào liên kết xác thực đã được gửi đến địa chỉ Email</p>
                    <p>{email}</p>
                    <span> Bạn vẫn chưa nhận được? </span>
                    <button onClick={handleResendEmail} disabled={counter > 0}>
                        {counter > 0 ? `Gửi lại sau ${counter} giây` : 'Gửi lại'}
                    </button>
                </>
            )}
        </div>
    );
};

export default ConfirmEmail;
