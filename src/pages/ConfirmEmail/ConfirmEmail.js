import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { checkEmailConfirmed, confirmEmail, resendConfirmationEmail } from '~/services/authService';

const ConfirmEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [counter, setCounter] = useState(60);

    const [emailConfirmed, setEmailConfirmed] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const email = location.state?.email;

    const handleResendEmail = async () => {
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
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        const verifyEmail = async (code) => {
            if (!code) return;
            try {
                const response = await confirmEmail(code);
                if (response.status === 200) {
                    messageApi.success(response?.data?.data?.message);
                }
            } catch (error) {
                messageApi.error('Xác thực thất bại. Mã xác thực không hợp lệ.');
            }
        };

        verifyEmail(code);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [counter]);

    useEffect(() => {
        if (email && !emailConfirmed) {
            const intervalId = setInterval(() => {
                const checkEmailConfirmationStatus = async () => {
                    try {
                        const response = await checkEmailConfirmed(email);
                        if (response.status === 200 && response.data.data) {
                            setEmailConfirmed(true);
                            setTimeout(() => {
                                navigate('/', { replace: true });
                            }, 5000); // Redirect after 5 seconds
                        }
                    } catch (error) {
                        console.log('Không thể kiểm tra trạng thái xác nhận email.');
                    }
                };

                checkEmailConfirmationStatus();
            }, 2000);

            return () => clearInterval(intervalId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, emailConfirmed]);

    return (
        <div className="box-container p-2">
            {contextHolder}

            {!email ? (
                <div className="text-center">
                    <h4>Xác minh bằng liên kết gửi qua Email</h4>
                    <Link to="/">Quay lại trang chủ</Link>
                </div>
            ) : emailConfirmed ? (
                <div className="text-center">Xác thực thành công, tự động chuyển hướng trang chủ sau 5s</div>
            ) : (
                <>
                    <div>Xác minh bằng liên kết gửi qua Email</div>
                    <p>Vui lòng nhấn vào liên kết xác thực đã được gửi đến địa chỉ Email</p>
                    <p>{email}</p>
                    <span> Bạn vẫn chưa nhận được? </span>
                    <Button onClick={handleResendEmail} disabled={counter > 0}>
                        {counter > 0 ? `Gửi lại sau ${counter} giây` : 'Gửi lại'}
                    </Button>
                </>
            )}
        </div>
    );
};

export default ConfirmEmail;
