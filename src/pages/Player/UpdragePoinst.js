import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, InputNumber, message, Select } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { handleError } from '~/utils/errorHandler';
import { getPlayerCharacter, getPlayerPoints, updatePoints } from '~/services/playerService';
import useAuth from '~/hooks/useAuth';

const defaultValue = {
    playerCharacterId: 0,
    health: 0,
    damage: 0,
    defense: 0,
    luck: 0,
    teammates: 0,
};

const validationSchema = yup.object({
    playerCharacterId: yup.number().required('ID nhân vật không được để trống'),

    health: yup
        .number()
        .required('Sinh lực không được để trống')
        .integer('Sinh lực phải là số nguyên')
        .min(0, 'Sinh lực phải là số không âm'),

    damage: yup
        .number()
        .required('Sát thương không được để trống')
        .integer('Sát thương phải là số nguyên')
        .min(0, 'Sát thương phải là số không âm'),

    defense: yup
        .number()
        .required('Phòng thủ không được để trống')
        .integer('Phòng thủ phải là số nguyên')
        .min(0, 'Phòng thủ phải là số không âm'),

    luck: yup
        .number()
        .required('May mắn không được để trống')
        .integer('May mắn phải là số nguyên')
        .min(0, 'May mắn phải là số không âm'),

    teammates: yup
        .number()
        .required('Đồng đội không được để trống')
        .integer('Đồng đội phải là số nguyên')
        .min(0, 'Đồng đội phải là số không âm'),
});

function UpdragePoinst() {
    const [playerPoints, setPlayerPoints] = useState({});
    const [characterList, setCharacterList] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();
    const { player } = useAuth();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updatePoints(values);
            if (response.status === 200) {
                setPlayerPoints(response.data.data);
                messageApi.success('Cộng điểm thành công');
            }
        } catch (error) {
            handleError(error, formik, messageApi);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    function renderInput({ name, label }) {
        return (
            <div className="p-1">
                <label className="w-50" htmlFor={`txt${name}`}>
                    {label}: {playerPoints[name]}
                </label>
                <InputNumber
                    className="w-50"
                    id={`txt${name}`}
                    name={name}
                    min={0}
                    max={10000}
                    defaultValue={0}
                    value={formik.values[name]}
                    onChange={(newValue) => formik.setFieldValue(name, newValue)}
                    onBlur={formik.handleBlur}
                    status={formik.touched[name] && formik.errors[name] ? 'error' : undefined}
                />
                {formik.touched[name] && formik.errors[name] ? (
                    <div className="text-danger">{formik.errors[name]}</div>
                ) : null}
            </div>
        );
    }

    useEffect(() => {
        const fetchPlayerCharacter = async () => {
            try {
                const response = await getPlayerCharacter();
                const arr = response.data.data;
                setCharacterList(arr);
                formik.setFieldValue('playerCharacterId', arr[0]?.id);
            } catch (error) {
                messageApi.error('Có lỗi xảy ra khi tải nhân vật: ' + error.message);
            }
        };

        fetchPlayerCharacter();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const response = await getPlayerPoints(formik.values.playerCharacterId);
                setPlayerPoints(response.data.data);
            } catch (error) {
                messageApi.error('Có lỗi xảy ra khi tải chỉ số: ' + error.message);
            }
        };

        if (formik.values.playerCharacterId) {
            fetchPoints();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.playerCharacterId]);

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to={`/player/${player.id}`}>Quay lại</Link>
            </div>

            <div className="p-2">
                <h4 className="title">Cộng Điểm Nâng Cấp</h4>

                <form onSubmit={formik.handleSubmit}>
                    <div className="p-1">
                        <label className="w-50" htmlFor="playerCharacterId">
                            Nhân vật
                        </label>
                        <Select
                            className="w-50"
                            id="playerCharacterId"
                            options={characterList}
                            fieldNames={{ label: 'name', value: 'id' }}
                            value={formik.values.playerCharacterId}
                            onChange={(value) => formik.setFieldValue('playerCharacterId', value)}
                            onBlur={formik.handleBlur}
                            status={
                                formik.touched.playerCharacterId && formik.errors.playerCharacterId
                                    ? 'error'
                                    : undefined
                            }
                        />
                    </div>
                    {formik.touched.playerCharacterId && formik.errors.playerCharacterId ? (
                        <div className="text-danger">{formik.errors.playerCharacterId}</div>
                    ) : null}

                    {renderInput({
                        name: 'health',
                        label: 'Sinh lực',
                    })}

                    {renderInput({
                        name: 'damage',
                        label: 'Sát thương',
                    })}

                    {renderInput({
                        name: 'defense',
                        label: 'Phòng thủ',
                    })}

                    {renderInput({
                        name: 'luck',
                        label: 'May mắn',
                    })}

                    {renderInput({
                        name: 'teammates',
                        label: 'Đồng đội',
                    })}

                    <div className="text-center mt-2">Điểm chưa cộng: {playerPoints.totalPoints}</div>

                    <div className="text-center">
                        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                            Cộng
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdragePoinst;
