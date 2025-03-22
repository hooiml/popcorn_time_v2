"use client";
import Image from 'next/image'
import { useEffect, useState, Fragment, useMemo } from 'react'
import { Menu } from '@headlessui/react';
import moment from 'moment';

interface Genre {
  id: number,
  name: string,
}

export default function Home() {
  const [movies, setMovieInfo] = useState([]);
  const [genresList, setGenre] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState<any>([]);
  const [movieDetail, setMovieDetails] = useState<any>([]);
  const [castMembers, setCastMemberDetails] = useState<any>([]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${process.env.NEXT_PUBLIC_MOVIEDB_API_KEY}`
    }
  };
  var fromDate = moment().subtract(37, 'days').format('YYYY-MM-DD');
  var todayDate = moment().format('YYYY-MM-DD');
  var loadingMovies: boolean = false;
  var genresSelectedStr = "";
  var selectedGenres: string[] = [];

  useEffect(()=> {
    const getGenres = async () => {
      const query = await fetch('https://api.themoviedb.org/3/genre/movie/list', options);
      const response = await query.json();
      setGenre(response.genres);
    }
    getMoviesOnTheaters();
    getGenres();
    // display lists of movies that are now playing in theaters with movie title, release data and cover image
    // list should be paginated , 30 movies per page, most popular first
    // able to filter lists by genres and ratings
    // sort list by movie title, release date, popularity or ratings
    // click on a movie should display modal window with more info about movie such as:synopsis, release date, casts, 
    // page should be responsive and functionally decent on mobile and tablet screen sizes
  },[]);

  function setSelectedGenres(event:any, genreSelected:any,) {
    if (event.target.checked) {
      if (!selectedGenre.includes(genreSelected)) { selectedGenre.push(genreSelected); }

    } else {
      selectedGenre.forEach((genre:any, index: number) => {
        if (genre === genreSelected) {
          selectedGenre.splice(index, 1);
        }
      })
    }
    genresSelectedStr = selectedGenre.join(",");
    getMoviesOnTheaters({with_genres: genresSelectedStr, page: 1});
  }

  async function getMoviesOnTheaters(params?:any) {
    loadingMovies = true;
    // genre use this params with_genres (string) can be a comma (AND) or pipe (OR) separated query
    const sortBy = params && params.sortBy ? params.sortBy : 'popularity.desc';
    const page = params && params.page ? params.page : 1;
    const genre = params && params.with_genres ? params.with_genres : '';
    const apiUrl = `${`https://api.themoviedb.org/3/discover/movie?page=${page}&include_adult=false&include_video=false&language=en-US&sort_by=${sortBy}&with_release_type=2|3&release_date.gte=${fromDate}&release_date.lte=${todayDate}&with_genres=${genre}`}`
    // const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&sort_by=${sortBy}`;
    try {
      const query = await fetch(apiUrl, options);
      const response = await query.json();
      setMovieInfo(response.results);
      loadingMovies = false;
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  async function getMovieDetails(movie_id:any) {
    loadingMovies = true;
    // genre use this params with_genres (string) can be a comma (AND) or pipe (OR) separated query
    const apiUrl = `${`https://api.themoviedb.org/3/movie/${movie_id}`}`
    try {
      const query = await fetch(apiUrl, options);
      const response = await query.json();
      setMovieDetails(response);
      loadingMovies = false;
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  async function getCastMembers(movie_id:any) {
    const apiUrl = `${`https://api.themoviedb.org/3/movie/${movie_id}/credits`}`
    try {
      const query = await fetch(apiUrl, options);
      const response = await query.json();
      setCastMemberDetails(response.cast);
      loadingMovies = false;
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }
  function openMovieModal(movie_id:number): void {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;

    console.log(movie_id);
    if (modal !== null) {
      modal.showModal();
      getMovieDetails(movie_id);
      getCastMembers(movie_id);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <div className="navbar bg-base-0 items-center justify-center">
        <Image
          src="/popcorn.jpg"
          alt="Popcorn image"
          width={50}
          height={50}
          priority
        />
        <i>Popcorn Time ! &nbsp;</i>
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">

        {/* <p className="fixed top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        <Image
          src="/popcorn.jpg"
          alt="Popcorn image"
          width={50}
          height={50}
          priority
        />
          Popcorn Time ! &nbsp;
        </p> */}
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-5 dropdown dropdown-open dropdown-bottom">
          <div tabIndex={0} role="button" className="btn m-1">Sort</div>
          <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a onClick={() => getMoviesOnTheaters({ sortBy: 'popularity.desc', page: 1 })}>Popularity Descending</a></li>
            <li><a onClick={() => getMoviesOnTheaters({ sortBy: 'popularity.asc', page: 1 })}>Popularity Ascending</a></li>
            <li><a onClick={() => getMoviesOnTheaters({ sortBy: 'vote_average.desc', page: 1 })}>Rating Descending</a></li>
            <li><a onClick={() => getMoviesOnTheaters({ sortBy: 'vote_average.asc', page: 1 })}>Rating Ascending</a></li>
            <li><a onClick={() => getMoviesOnTheaters({ sortBy: 'primary_release_date.desc', page: 1 })}>Release Date Descending</a></li>
            <li><a onClick={() => getMoviesOnTheaters({ sortBy: 'primary_release_date.asc', page: 1 })}>Release Date Ascending</a></li>
            <li><a onClick={() => getMoviesOnTheaters({ sortBy: 'title.asc', page: 1 })}>Title (A-Z)</a></li>
            <li><a onClick={() => getMoviesOnTheaters({ sortBy: 'title.desc', page: 1 })}>Title (Z-A)</a></li>
          </ul>
        </div>

        <div className="fixed right-12 dropdown dropdown-open dropdown-bottom dropdown-hover">
          <div tabIndex={1} role="button" className="btn m-1">Filter</div>
          <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-46">
            {
              genresList && genresList.length && genresList.map((genre:Genre) => {
                return (
                  <div key={genre.id} className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">{genre.name} </span> 
                      {/* <input onClick={() => getMoviesOnTheaters({ sortBy: 'popularity.desc', page: 1 })} type="checkbox" checked={genre.checked} className="checkbox checkbox-primary" /> */}

                      <input onChange={() => setSelectedGenres(event, genre.id)} type="checkbox"  className="checkbox checkbox-primary" />
                    </label>
                </div>
                )
              })
            }
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">

        {
          !loadingMovies && movies && movies.length && movies.length > 0 && movies.map((movie:any) => {
            return (
                <a 
                  key={movie.id}
                  onClick={()=>openMovieModal(movie.id)}
                >
                <Image
                  src={movie.poster_path ? 'https://www.themoviedb.org/t/p/w220_and_h330_face'+ movie.poster_path : '/no_img_found.svg'}
                  alt="Vercel Logo"
                  className="content-center no-img-found"
                  width={100}
                  height={150}
                />
                <p className={`m-0 max-w-[30ch] text-sm opacity-90`}>
                  {movie.title} 
                   {/* ( Rating: {Math.round(movie.vote_average * 10) / 10} ) */}
                </p>
                <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
                  {movie.release_date}
                </p>
              </a>
            )
          }) 
        }
        {/* <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Findeeeee in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a> */}
      </div>
      <div className="join">
        <input className="join-item btn btn-square" type="radio" name="options" aria-label="1" />
        <input className="join-item btn btn-square" type="radio" name="options" aria-label="2" />
        <input className="join-item btn btn-square" type="radio" name="options" aria-label="3" />
        <input className="join-item btn btn-square" type="radio" name="options" aria-label="4" />
      </div>
      <dialog id="my_modal_2" className="modal">
        <div>
          {movieDetail ? (
            <div>
              <div className="modal-box">
                <h3 className="font-bold text-lg">Movie Name : {movieDetail.original_title}</h3>
                {/* <p className="py-4">Press ESC key or click outside to close</p> */}
                <Image
                  src={movieDetail.poster_path ? 'https://www.themoviedb.org/t/p/w220_and_h330_face'+ movieDetail.poster_path : '/no_img_found.svg'}
                  alt="Posture picture"
                  className="content-center no-img-found"
                  width={100}
                  height={150}
                />
                <div>
                <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
                  {movieDetail.overview}
                </p>
                <br/>
                <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
                  Release Date: {movieDetail.release_date}
                </p>
                </div>

              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </dialog>
    </main>
  )
}
