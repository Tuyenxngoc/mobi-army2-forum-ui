import { useState } from 'react';
import PropTypes from 'prop-types';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { createNotification } from '~/services/NotificationService';

const validationSchema = yup.object({
    title: yup.string().trim().required('Tiêu đề là bắt buộc'),

    content: yup.string().trim().required('Nội dung là bắt buộc'),
});

const defaultValue = {
    title: '',
    content: '',
};

function CreateNotification({ fetchNotifications }) {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleCreateNotification(values);
        },
    });

    const handleCreateNotification = async (values) => {
        setIsLoading(true);
        try {
            // Call API to create notification
            const response = await createNotification(values);
            if (response.status === 200) {
                fetchNotifications();
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div>Thêm mới</div>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="inputTitle">Tiêu đề</label>
                    <input
                        id="inputTitle"
                        className="form-control"
                        type="text"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="inputContent">Nội dung</label>
                    <textarea
                        id="inputContent"
                        className="form-control"
                        name="content"
                        rows="3"
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    Thêm mới
                </button>
            </form>
        </div>
    );
}

CreateNotification.propTypes = {
    fetchNotifications: PropTypes.func.isRequired,
};

export default CreateNotification;
