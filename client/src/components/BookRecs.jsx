import cover1 from '../assets/book-cover-mauve.png';
import cover2 from '../assets/book-cover-teal.png';
import cover3 from '../assets/book-cover-charcoal.png';
import cover4 from '../assets/book-cover-lavender.png';
import cover5 from '../assets/book-cover-gold.png';

const backupCovers = [cover1, cover2, cover3, cover4, cover5];

const BookRecs = ({data, bookCovers}) => {
  return (
    <div class="flex flex-col gap-10 mb-10 fade-in">
      <h2 class="text-heading text-center">
        Your Book Recommendations
      </h2>
      {data?.recs?.slice(0, 5).map((book, index) => (
        <div key={index} class="flex flex-col sm:flex-row gap-4">
          <div class="book-cover">
            <img
                src={bookCovers[book.id] || backupCovers[index % backupCovers.length]}
                alt={`Cover of ${book.title}`}
                onError={(e) => { e.target.src = coverPlaceholder; }}
            />
          </div>
          <div class="flex flex-col">
            <h3 class="text-subheading text-center sm:text-left">"{book.title}" by {book.author}</h3>
            <p class="text-body mb-2 text-center sm:text-left">{book?.genres.join(" ⟡ ")}</p>
            <p class="text-body-secondary">{book.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookRecs;