import {useState, useRef, useEffect} from 'react';
import DropZone from './components/DropZone.jsx';
import Results from './components/Results.jsx';
import BackToTopButton from './components/BackToTopButton.jsx';

import { handlePhotoUpload } from './hooks/handlePhotoUpload.js';

import booksLogo from './assets/books-logo.png';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [bookCovers, setBookCovers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const resultsRef = useRef(null);
  useEffect(() => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isLoading, data, error]); 

  return (
    <main>
      <div className="flex flex-col h-svh">
        <div className="header mb-8">
          <img src={booksLogo} alt="Bookshelf Recs Logo" className="size-12" />
          <h1 className="text-title">Bookshelf Recs</h1>
        </div>
        <div className="main-col m-10">
          <div className="card">
            <h2 className="text-heading text-center">Upload Your Bookshelf Photo</h2>
            <DropZone setSelectedFile={setSelectedFile}/>
            <div className="flex mt-2 justify-center sm:justify-end">
                <button
                    type="button"
                    onClick={() => {
                      handlePhotoUpload({
                        selectedFile,
                        setError,
                        setData,
                        setBookCovers,
                        setIsLoading
                      });
                    }}
                    disabled={!selectedFile || isLoading}
                    className="primary-button"
                >
                    Get Book Recs
                </button>
            </div>
          </div>
          <div ref={resultsRef} class="flex flex-col gap-6 pt-10">
              <Results error={error} data={data} isLoading={isLoading} bookCovers={bookCovers} />
          </div>
        </div>
      </div>
        <BackToTopButton />
    </main>
  );
}

export default App;