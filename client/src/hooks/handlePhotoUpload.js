import { getBookCovers, getBookRecs } from '../api.js';

/**
 * Handles sending and receiving book data after photo upload and sets the 
 * appropriate state variables.
 */
export const handlePhotoUpload = async ({
  selectedFile,
  setError,
  setData,
  setBookCovers,
  setIsLoading
}) => {
  if (!selectedFile) {
    return;
  }

  setIsLoading(true);
  setError(null);
  setData(null);
  try {
    const newData = await getBookRecs(selectedFile);
    if (newData?.error?.message) {
      throw new Error(`${newData.error.code || ''} ${newData.error.status || 'Error'}: ${newData.error.message}`);
    } else {
      setData(newData);
      const bookCovers = await getBookCovers(newData);
      setBookCovers(bookCovers);
    }
  } catch (error) {
    setError(error.message || 'An unknown server error occurred.');
    console.error('Error handling photo upload:', error);
  } finally {
    setIsLoading(false);
  }
};