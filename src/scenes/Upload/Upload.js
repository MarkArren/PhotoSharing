import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import UploadForm from './UploadForm';
import './Upload.scss';

const Upload = () => {
    const [pictures, setPictures] = useState();

    const onDrop = (picture) => {
        setPictures(picture);
    };

    return (
        <div>
            <Navbar />
            <UploadForm />
        </div>
    );
};

export default Upload;
