import Style from './DownloadItem.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';
const cx = classNames.bind(Style);

function DownloadItem({ content }) {
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <div className={cx('downloadItem')}>
            <a href={content.link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} download>
                <img src={hovered ? content.icon2 : content.icon1} alt="icon" />
            </a>
            <div>{content.title}</div>
        </div>
    );
}

DownloadItem.propTypes = {
    content: PropTypes.shape({
        title: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        icon1: PropTypes.string.isRequired,
        icon2: PropTypes.string.isRequired,
    }).isRequired,
};

export default DownloadItem;
