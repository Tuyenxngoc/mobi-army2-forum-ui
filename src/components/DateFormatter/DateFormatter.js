import { formatDistanceToNow } from 'date-fns';
import vi from 'date-fns/locale/vi';

import PropTypes from 'prop-types';

function DateFormatter({ datetime }) {
    // Chuyển đổi giá trị datetime thành đối tượng Date
    const parsedDate = new Date(datetime);

    // Sử dụng date-fns để định dạng khoảng cách thời gian từ bây giờ đến ngày được cung cấp
    const formattedDateTime = formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi });

    return <>{formattedDateTime}</>;
}

DateFormatter.propTypes = {
    datetime: PropTypes.string.isRequired,
};

export default DateFormatter;
