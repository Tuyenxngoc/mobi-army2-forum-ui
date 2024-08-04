import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, InputNumber, message, Select } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { handleError } from '~/utils/errorHandler';
import { getPlayerCharacter, getPlayerPoints, updatePoints } from '~/services/playerService';
import Style from './UpdragePoinst.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

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

            <div className="forum-header">
                <Link to="/player/info">Quay lại</Link>
            </div>

            <div className="p-2">
                <div className="forum-border-bottom text-primary mb-2">Cộng Điểm Nâng Cấp</div>

                <form onSubmit={formik.handleSubmit}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')} htmlFor="playerCharacterId">
                            Nhân vật
                        </label>
                        <Select
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

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')} htmlFor="health">
                            Sinh lực: {playerPoints.health}
                        </label>
                        <InputNumber
                            id="health"
                            name="health"
                            min={0}
                            max={10000}
                            defaultValue={0}
                            value={formik.values.health}
                            onChange={(value) => formik.setFieldValue('health', value)}
                            onBlur={formik.handleBlur}
                            status={formik.touched.health && formik.errors.health ? 'error' : undefined}
                        />
                    </div>
                    {formik.touched.health && formik.errors.health ? (
                        <div className="text-danger">{formik.errors.health}</div>
                    ) : null}

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')} htmlFor="damage">
                            Sát thương: {playerPoints.damage}
                        </label>
                        <InputNumber
                            id="damage"
                            name="damage"
                            min={0}
                            max={10000}
                            defaultValue={0}
                            value={formik.values.damage}
                            onChange={(value) => formik.setFieldValue('damage', value)}
                            onBlur={formik.handleBlur}
                            status={formik.touched.damage && formik.errors.damage ? 'error' : undefined}
                        />
                    </div>
                    {formik.touched.damage && formik.errors.damage ? (
                        <div className="text-danger">{formik.errors.damage}</div>
                    ) : null}

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')} htmlFor="defense">
                            Phòng thủ: {playerPoints.defense}
                        </label>
                        <InputNumber
                            id="defense"
                            name="defense"
                            min={0}
                            max={10000}
                            defaultValue={0}
                            value={formik.values.defense}
                            onChange={(value) => formik.setFieldValue('defense', value)}
                            onBlur={formik.handleBlur}
                            status={formik.touched.defense && formik.errors.defense ? 'error' : undefined}
                        />
                    </div>
                    {formik.touched.defense && formik.errors.defense ? (
                        <div className="text-danger">{formik.errors.defense}</div>
                    ) : null}

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')} htmlFor="luck">
                            May mắn: {playerPoints.luck}
                        </label>
                        <InputNumber
                            id="luck"
                            name="luck"
                            min={0}
                            max={10000}
                            defaultValue={0}
                            value={formik.values.luck}
                            onChange={(value) => formik.setFieldValue('luck', value)}
                            onBlur={formik.handleBlur}
                            status={formik.touched.luck && formik.errors.luck ? 'error' : undefined}
                        />
                    </div>
                    {formik.touched.luck && formik.errors.luck ? (
                        <div className="text-danger">{formik.errors.luck}</div>
                    ) : null}

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')} htmlFor="teammates">
                            Đồng đội: {playerPoints.teammates}
                        </label>
                        <InputNumber
                            id="teammates"
                            name="teammates"
                            min={0}
                            max={10000}
                            defaultValue={0}
                            value={formik.values.teammates}
                            onChange={(value) => formik.setFieldValue('teammates', value)}
                            onBlur={formik.handleBlur}
                            status={formik.touched.teammates && formik.errors.teammates ? 'error' : undefined}
                        />
                    </div>
                    {formik.touched.teammates && formik.errors.teammates ? (
                        <div className="text-danger">{formik.errors.teammates}</div>
                    ) : null}

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
