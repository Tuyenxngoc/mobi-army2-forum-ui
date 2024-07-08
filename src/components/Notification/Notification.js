import { useCallback, useRef, useState } from 'react';
import DateFormatter from '../DateFormatter/DateFormatter';
import Style from './Notification.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import AlertDialog from '../AlertDialog';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const cx = classNames.bind(Style);

const Notification = ({ data, isLast = false, canEdit = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(data.title);
    const [editedContent, setEditedContent] = useState(data.content);
    const [showDialogDelete, setShowDialogDelete] = useState(false);
    const reactQuillRef = useRef(null);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedTitle(data.title);
        setEditedContent(data.content);
    };

    const handleDelete = () => {
        setShowDialogDelete(true);
    };

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            if (input !== null && input.files !== null) {
                const file = input.files[0];
            }
        };
    }, []);

    const modules = {
        toolbar: {
            container: [
                [{ font: [] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ size: ['huge', 'large', false, 'small'] }], // custom dropdown
                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                ['blockquote', 'code-block'],
                ['link', 'image', 'formula'],
                [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                [{ align: [] }],
                [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                [{ direction: 'rtl' }], // text direction

                ['clean'], // remove formatting button
            ],
            handlers: {
                image: imageHandler,
            },
        },
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'font',
        'header',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'color',
        'background',
        'blockquote',
        'code-block',
        'link',
        'image',
        'formula',
        'list',
        'bullet',
        'check',
        'align',
        'indent',
        'script',
        'direction',
    ];

    return (
        <>
            <AlertDialog
                open={showDialogDelete}
                setOpen={setShowDialogDelete}
                title={'Xác nhận xóa'}
                description={
                    'Bạn có chắc muốn xóa thông báo này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.'
                }
                handleSubmit={() => {
                    console.log('ok');
                }}
            />
            <div className={cx('box-container', 'textContent', isLast && 'm-0')}>
                {isEditing ? (
                    <>
                        <div className={cx('title')}>
                            <input
                                type="text"
                                className="form-control-plaintext"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                            <div className="d-flex">
                                <div>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                </div>
                            </div>
                        </div>
                        <div className={cx('content')}>
                            <ReactQuill
                                id="formControlTextarea"
                                ref={reactQuillRef}
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={editedContent}
                                onChange={(value) => setEditedContent(value)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={cx('title')}>
                            <div className="d-flex">
                                <h4>{data.title}</h4>
                                {canEdit && (
                                    <div className={cx('editButton')} onClick={handleEdit}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </div>
                                )}
                            </div>
                            {canEdit && (
                                <div onClick={handleDelete}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                            )}
                        </div>
                        <div className={cx('content')} dangerouslySetInnerHTML={{ __html: data.content }} />
                        <div className={cx('date')}>
                            <DateFormatter datetime={data.lastModifiedDate} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Notification;
