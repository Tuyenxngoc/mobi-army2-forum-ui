import PropTypes from 'prop-types';
import { useState } from 'react';

function DownloadItem({ content }) {
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <div className="text-center">
            <a href={content.link} className="d-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
