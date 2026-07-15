/**
 * Gets book details from the Open Library Book Search API.
 */
const getBookDetails = async (book) => {
  const title = encodeURIComponent(book.title);
  const author = encodeURIComponent(book.author);
  const url = `https://openlibrary.org/search.json?title=${title}&author=${author}&fields=key,title,author_name,editions&sort=want_to_read&limit=1`;
  
  const response = await fetch(url, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

/**
 * Gets book cover URLs from the Open Library Covers API using Open Library IDs 
 * (OLIDs) obtained from the Open Library Book Search API.
 */
export const getBookCovers = async (data) => {
  const bookCovers = {};
  for (const book of data.recs) {
    const details = await getBookDetails(book);
    const olid = details?.docs?.[0]?.editions?.docs?.[0]?.key?.split('/').pop();
    if (olid) {
      bookCovers[book.id] = `https://covers.openlibrary.org/b/olid/${olid}-M.jpg?default=false`;
    } else {
      bookCovers[book.id] = null;
    }
  }
  return bookCovers;
}

/**
 * Sends the uploaded photo to the server and retrieves book recommendations.
 */
export const getBookRecs = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/book-recs', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const genaiError = await response.json();
    throw new Error(`Upload failed: ${genaiError?.error?.message || response.status}`);
  }

  const data = await response.json();
  return data;
}