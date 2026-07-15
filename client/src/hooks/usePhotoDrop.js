import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * Handles Dropzone functionality and sets the file to be sent to the server.
 */
export const usePhotoDrop = (setSelectedFile) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [imgError, setImgError] = useState('');

  const clearSelection = useCallback(() => {
    setFiles([]);
    setImgError('');
    setProgress(0);
    setSelectedFile(null);
  }, [setSelectedFile]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setImgError('');
    setFiles([]);

    if (acceptedFiles.length > 0) {
      setProgress(0);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
      setSelectedFile(null);
      setTimeout(() => setProgress(100), 0);
      return;
    }

    if (fileRejections.length > 0) {
      const { errors } = fileRejections[0];
      setImgError(errors[0].message);
    }
  }, [setSelectedFile]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFilesize: 5 * 1024 * 1024, // 5MB
    accept: {
      'image/*': []
    }
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    if (files.length === 0) {
      setProgress(0);
    }
  }, [files.length]);

  return {
    files,
    progress,
    imgError,
    getRootProps,
    getInputProps,
    clearSelection
  };
};