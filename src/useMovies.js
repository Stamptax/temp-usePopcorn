import { useEffect, useState } from "react";
const KEY = 'b5ebc8e4';

export default function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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

        if (!query.length) {
            setMovies([]);
            setError('');
            return () => {
                controller.abort();
            }
        }
        // handleCloseMovie();
        fetchData();
    }, [query]
    )
    return [movies, isLoading, error]
}