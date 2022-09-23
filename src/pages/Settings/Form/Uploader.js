import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './Uploader.module.css';
import { Grid, LinearProgress } from '@mui/material';

export default function Uploader({ form, setForm }) {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setForm({ ...form, logo: file });
    // eslint-disable-next-line
  }, [file]);

  const onDrop = useCallback((acceptedFiles) => {
    const url = 'https://api.cloudinary.com/v1_1/almpo/image/upload';

    acceptedFiles.forEach(async (acceptedFile) => {
      //   const { signature, timestamp } = await getSignature();

      const formData = new FormData();
      formData.append('file', acceptedFile);
      formData.append('upload_preset', 'invoice');

      const response = await fetch(url, {
        method: 'post',
        body: formData,
      });
      setProgress(100);
      const data = await response.json();

      setFile(data.secure_url);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accepts: 'image/*,application/pdf',
    multiple: false,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : null}`}>
        <input {...getInputProps()} />
        Upload Logo
      </div>
      <Grid item style={{ width: '100%' }}>
        <LinearProgress variant='determinate' value={progress} />
      </Grid>
    </>
  );
}
