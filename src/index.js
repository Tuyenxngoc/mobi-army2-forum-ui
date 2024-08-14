import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './global.scss';
import { AuthProvider } from './contexts/AuthProvider';

import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';

import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <ConfigProvider locale={viVN}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ConfigProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
