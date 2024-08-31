import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Flex, InputNumber, Modal, Select } from 'antd';
import { getAllSpecialItems } from '~/services/specialItemService';

const defaultValue = {
    i: null, //itemId
    q: 1, //quantity
};

const validationSchema = yup.object({
    i: yup.number().required('Trường này là bắt buộc'),
    q: yup.number().required('Trường này là bắt buộc'),
});

function SpecialItemModal({ visible, handleCancel, onOk, initialValues = defaultValue }) {
    const [specialItems, setSpecialItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (values, { resetForm }) => {
        onOk(values);
        resetForm();
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    useEffect(() => {
        const fetchSpecialItems = async () => {
            setLoading(true);
            try {
                const response = await getAllSpecialItems();
                setSpecialItems(response.data.data);
            } catch (error) {
                console.log('Failed to fetch special items');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialItems();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal title="Nhập dữ liệu item" open={visible} onCancel={handleCancel} footer={null}>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group mb-2">
                    <label htmlFor="i">Item</label>
                    <Select
                        id="i"
                        showSearch
                        disabled={loading}
                        options={specialItems}
                        fieldNames={{ label: 'name', value: 'id' }}
                        optionFilterProp="name"
                        value={formik.values.cid}
                        onChange={(value) => formik.setFieldValue('i', value)}
                        onBlur={formik.handleBlur}
                        status={formik.touched.i && formik.errors.i ? 'error' : ''}
                        style={{ width: '100%' }}
                    />
                    {formik.touched.i && formik.errors.i && <div className="text-danger">{formik.errors.i}</div>}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="q">Số lượng</label>
                    <InputNumber
                        id="q"
                        min={1}
                        max={32000}
                        defaultValue={1}
                        value={formik.values.q}
                        onChange={(value) => formik.setFieldValue('q', value)}
                        onBlur={formik.handleBlur}
                        status={formik.touched.q && formik.errors.q ? 'error' : ''}
                        style={{ width: '100%' }}
                    />
                    {formik.touched.q && formik.errors.q && <div className="text-danger">{formik.errors.q}</div>}
                </div>

                <Flex justify="end" gap="small">
                    <Button onClick={handleCancel}>Đóng</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
}

export default SpecialItemModal;
