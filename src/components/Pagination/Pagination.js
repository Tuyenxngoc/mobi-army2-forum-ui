import PropTypes from 'prop-types';
import Style from './Pagination.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function showCurrentPage(page) {
    return page + 1;
}

function Pagination({
    totalPages = 1,
    currentPage = 1,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    isLoading = false,
}) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('rows-per-page')}>
                <label htmlFor="rowsPerPage">Số dòng mỗi trang: </label>
                <select id="rowsPerPage" value={rowsPerPage} onChange={onRowsPerPageChange} disabled={isLoading}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className={cx('pagination-controls')}>
                {currentPage > 0 && (
                    <>
                        <button className={cx('button')} onClick={() => onPageChange(0)} disabled={isLoading}>
                            &laquo;
                        </button>
                        <button
                            className={cx('button')}
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={isLoading}
                        >
                            &lsaquo;
                        </button>
                    </>
                )}

                {currentPage - 1 >= 0 && (
                    <button className={cx('button')} onClick={() => onPageChange(currentPage - 1)} disabled={isLoading}>
                        {showCurrentPage(currentPage - 1)}
                    </button>
                )}

                <button className={cx('button', 'active')} disabled={isLoading}>
                    {showCurrentPage(currentPage)}
                </button>

                {currentPage + 1 < totalPages && (
                    <button className={cx('button')} onClick={() => onPageChange(currentPage + 1)} disabled={isLoading}>
                        {showCurrentPage(currentPage + 1)}
                    </button>
                )}
                {currentPage + 2 < totalPages && (
                    <button className={cx('button')} onClick={() => onPageChange(currentPage + 2)} disabled={isLoading}>
                        {showCurrentPage(currentPage + 2)}
                    </button>
                )}

                {currentPage + 1 === totalPages || (
                    <>
                        <button
                            className={cx('button')}
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={isLoading}
                        >
                            &rsaquo;
                        </button>
                        <button
                            className={cx('button')}
                            onClick={() => onPageChange(totalPages - 1)}
                            disabled={isLoading}
                        >
                            &raquo;
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default Pagination;
