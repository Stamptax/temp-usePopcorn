import { useEffect, useState } from "react";
import StarRating from "./StarRating-origin";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function Search({ query, setQuery }) {
  // const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies ? movies.length : 0}{/*movies?.length*/}</strong> results
    </p>
  )
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  )
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onSelectMovie={onSelectMovie} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

// function ListBox({ children }) {
//   const [isOpen1, setIsOpen1] = useState(true);

//   return (
//     <div className="box" >
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {
//         isOpen1 && (
//           children
//         )
//       }
//     </div >
//   )
// }

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating ? avgUserRating.toFixed(2) : '0 '}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )

}

{/*function WatchedBox({ children }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          {children}
        </>
      )}
    </div>
  )
}*/}

function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li >
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button onClick={() => handleDeleteWatched(movie.imdbID)} className="btn-delete">X</button>
      </div>
    </li>
  )
}

function WatchedMoviesList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} handleDeleteWatched={handleDeleteWatched} />
      ))}
    </ul>
  )
}

function Main({ children }) {
  return (
    <main className="main">
      {/*<ListBox>
        <MovieList>
          <Movie movie={movies} />
        </MovieList>
      </ListBox>
      <WatchedBox />*/}
      {children}
    </main>
  )
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        <>
          {children}
        </>
      )}
    </div>
  )
}

const KEY = 'b5ebc8e4';
// http://www.omdbapi.com/?i=tt3896198&apikey=b5ebc8e4

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);



  function handleSelectMovie(id) {
    setSelectedId(
      selectedId => id === selectedId ? null : id
    );
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched(watched => ([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched(
      watched => watched.filter(
        movie => movie.imdbID !== id
      ))
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {

      try {
        setIsLoading(true);
        setError('');
        const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal })
        const data = await response.json();
        setMovies(data.Search);
        setIsLoading(false);
      }
      catch (error) {
        console.log(error);
        setError('something went wrong');
        setMovies([]);
      }
    }
    // fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=2012`)
    //   .then(
    //     response => response.json()
    //   )
    //   .then(
    //     (data) => setMovies(data.Search)
    //   )
    if (!query.length) {
      setMovies([]);
      setError('');
      return () => {
        controller.abort();
      }
    }
    handleCloseMovie();
    fetchData();
  }, [query]
  )


  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <ListBox>
          <MovieList movies={movies} />
        </ListBox>
        <WatchedBox>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
  </WatchedBox>*/}
        <Box>
          {
            isLoading ? <Loader /> : error ? error : movies ? <MovieList onSelectMovie={handleSelectMovie} movies={movies} /> : 'no result'
          }
        </Box>
        <Box>
          {
            selectedId ? (<MovieDetails onClose={handleCloseMovie} watched={watched} onAddWatched={handleAddWatched} selectedId={selectedId} />) : (<>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList handleDeleteWatched={handleDeleteWatched} watched={watched} /
              ></>)
          }
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <p className="loader">Loading...</p>
  )
}

function MovieDetails({ selectedId, onClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const isWatched = watched?.map(movie => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating
    }
    onAddWatched(newWatchedMovie)
    onClose();
  }

  useEffect(
    () => {
      function callback(e) {
        if (e.code === 'Escape') {
          onClose();
        }
      }

      document.addEventListener('keydown', callback)
      return (
        () => {
          document.removeEventListener('keydown', callback);
        }
      )
    }
    , [onClose]
  )

  useEffect(
    () => {
      document.title = `Movie | ${title}`;

      return () => {
        document.title = 'usePopcorn'
      }
    }, [title]
  )

  useEffect(
    () => {

      async function getMovieDetails() {
        setIsLoading(true);
        const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
        const data = await response.json();
        setMovie(data);
        setIsLoading(false)
      }
      getMovieDetails();
    },
    [selectedId])
  return (
    <div className="details">
      {
        isLoading ? <Loader /> :
          <>
            <header>
              <button className="btn-back" onClick={onClose}>&larr;</button>
              <img src={poster} alt={`Poster of ${movie}`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>
            <section>
              <div className="rating">

                {
                  !isWatched ?
                    <>
                      <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                      {
                        userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>
                      }
                    </> :
                    <p>You have rated {watchedUserRating}</p>
                }

              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring: {actors} </p>
              <p>Directed by {director} </p>
            </section>
          </>
      }


    </div>
  )
}