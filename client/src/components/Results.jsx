import BookRecs from './BookRecs';

const Results = ({error, data, isLoading, bookCovers}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 h-svh fade-in items-center">
        <h2 className="text-heading fade-in text-center">
          Analyzing your bookshelf...
        </h2>
        <svg className="spinner mr-3 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col gap-8 h-svh fade-in items-center">
        <h2 className="text-heading">
          Error
        </h2>
        <p className="text-body-secondary">{error || "An unknown error occurred."}</p>
        <p className="text-body-secondary">Please try again.</p>
      </div>
    );
  }
  if (data?.numIdentified == 0) {
    return (
      <div className="flex flex-col gap-8 h-svh fade-in items-center">
        <h2 className="text-heading">
          No books were identified
        </h2>
        <p className="text-body-secondary">Please try again with a different photo.</p>
      </div>
    );
  }
  if (data?.recs) {
    return (
      <BookRecs data={data} bookCovers={bookCovers} />
    );
  }
  return null;
}

export default Results;