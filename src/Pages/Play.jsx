import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StarRatings from "react-star-ratings";
import axios from "../axios";
import { API_KEY, imageUrl, imageUrl2 } from "../Constants/Constance";

import Navbar from "../componets/Header/Navbar";
import Footer from "../componets/Footer/Footer";
import useUpdateMylist from "../CustomHooks/useUpdateMylist";
import useUpdateLikedMovies from "../CustomHooks/useUpdateLikedMovies";
import usePlayMovie from "../CustomHooks/usePlayMovie";
import useUpdateWatchedMovies from "../CustomHooks/useUpdateWatchedMovies";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Play() {
  const [urlId, setUrlId] = useState("");
  const [movieDetails, setMovieDetails] = useState({});
  const [isFromMyList, setIsFromMyList] = useState(false);
  const [isFromLikedMovies, setIsFromLikedMovies] = useState(false);
  const [isFromWatchedMovies, setIsFromWatchedMovies] = useState(false);
  const [moreTrailerVideos, setMoreTrailerVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  const { addToMyList, removeFromMyList, PopupMessage } = useUpdateMylist();
  const { addToLikedMovies, removeFromLikedMovies, LikedMoviePopupMessage } =
    useUpdateLikedMovies();
  const { removeFromWatchedMovies, removePopupMessage } =
    useUpdateWatchedMovies();
  const { playMovie } = usePlayMovie();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.From === "MyList") {
      setIsFromMyList(true);
    }
    if (location.state?.From === "LikedMovies") {
      setIsFromLikedMovies(true);
    }
    if (location.state?.From === "WatchedMovies") {
      setIsFromWatchedMovies(true);
    }

    axios
      .get(`/movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
      .then((response) => {
        if (response.data.results.length !== 0) {
          setUrlId(response.data.results[0]);
          setMoreTrailerVideos(response.data.results);
        }
      });

    if (!urlId) {
      axios
        .get(`/tv/${id}/videos?api_key=${API_KEY}&language=en-US`)
        .then((response) => {
          if (response.data.results.length !== 0) {
            setUrlId(response.data.results[0]);
            setMoreTrailerVideos(response.data.results);
          }
        });
    }

    axios
      .get(`/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then((response) => {
        setMovieDetails(response.data);
        axios
          .get(
            `/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
          )
          .then((res) => {
            setSimilarMovies(res.data.results.slice(0, 8));
          });
      });
  }, [id, urlId, location.state]);

  return (
    <div>
      <Navbar playPage />
      {PopupMessage}

      <div className="mt-12 h-[31vh] sm:h-[42vh] md:h-[45vh] lg:h-[55vh] lg:mt-0 xl:h-[98vh]">
        {urlId ? (
          <iframe
            width="100%"
            style={{ height: "inherit" }}
            src={`https://www.youtube.com/embed/${urlId.key}?modestbranding=1&autoplay=1`}
            frameBorder="0"
            allow="autoplay fullscreen"
            allowFullScreen
          ></iframe>
        ) : (
          <img
            src={`${imageUrl + movieDetails.backdrop_path}`}
            alt="Movie Backdrop"
          />
        )}
      </div>

      {movieDetails.id ? (
        <>
          <section
            style={{
              backgroundImage: `linear-gradient(90deg, #000000f0 0%, #000000e6 35%, #000000c3 100%), url(${
                imageUrl + movieDetails.backdrop_path
              })`,
            }}
            className="bg-cover bg-center flex flex-col p-5 sm:p-14 lg:flex-row lg:items-center lg:justify-center lg:gap-8 2xl:py-24"
          >
            <div className="lg:w-[45%]">
              <h1 className="text-white font-bold text-3xl mb-2">
                {movieDetails.original_title || movieDetails.title}
              </h1>
              <StarRatings
                rating={movieDetails.vote_average / 2}
                starRatedColor="red"
                numberOfStars={5}
                name="rating"
                starDimension="1rem"
                starSpacing="0.2rem"
              />
              <p className="text-neutral-400 mt-3">{movieDetails.overview}</p>
              <div className="bg-neutral-600 w-full h-[0.1rem] my-5"></div>

              <div className="hidden lg:grid">
                <h1 className="text-red-700">
                  Released on:{" "}
                  <a className="text-white ml-1">
                    {movieDetails.release_date || movieDetails.air_date}
                  </a>
                </h1>
                <h1 className="text-red-700">
                  Language:{" "}
                  <a className="text-white ml-1">
                    {movieDetails.original_language}
                  </a>
                </h1>
                <h1 className="text-red-700">
                  Genres:{" "}
                  {movieDetails.genres &&
                    movieDetails.genres.map((genre) => (
                      <span key={genre.id} className="text-white ml-2">
                        {genre.name}
                      </span>
                    ))}
                </h1>
                <div className="hidden lg:flex lg:mt-3">
                  {isFromMyList ? (
                    <button
                      onClick={() => removeFromMyList(movieDetails)}
                      className="group flex items-center border-[0.7px] border-white text-white font-medium sm:font-bold text-xs sm:text-lg sd:text-xl py-3 lg:px-10 rounded shadow hover:shadow-lg hover:bg-white hover:border-white hover:text-red-700 outline-none focus:outline-none mt-4 mb-3 ease-linear transition-all duration-150"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 mr-1 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Remove Movie
                    </button>
                  ) : isFromWatchedMovies ? (
                    <button
                      onClick={() => removeFromWatchedMovies(movieDetails)}
                      className="group flex items-center border-[0.7px] border-white text-white font-medium sm:font-semibold text-xs sm:text-lg lg:px-10 xl:font-bold py-3 rounded shadow hover:shadow-lg hover:bg-white hover:border-white hover:text-red-700 outline-none focus:outline-none mt-4 mb-3 ease-linear transition-all duration-150"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 mr-1 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Remove Movie
                    </button>
                  ) : (
                    <button
                      onClick={() => addToMyList(movieDetails)}
                      className="group flex items-center border-[0.7px] border-white text-white font-medium sm:font-semibold text-xs sm:text-lg lg:px-10 xl:font-bold py-3 rounded shadow hover:shadow-lg hover:bg-white hover:border-white hover:text-red-700 outline-none focus:outline-none mt-4 mb-3 ease-linear transition-all duration-150"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-1 ml-2 text-white hover:text-red-700 group-hover:text-red-700 ease-linear transition-all duration-150"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Add To My List
                    </button>
                  )}

                  {isFromLikedMovies ? (
                    <button
                      onClick={() => removeFromLikedMovies(movieDetails)}
                      className="group flex items-center border-[0.7px] border-white text-white font-medium sm:font-semibold text-xs sm:text-lg lg:px-10 xl:font-bold py-3 rounded shadow hover:shadow-lg hover:bg-white hover:border-white hover:text-red-700 outline-none focus:outline-none mt-4 mb-3 ease-linear transition-all duration-150"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 mr-1 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Remove Liked Movie
                    </button>
                  ) : (
                    <button
                      onClick={() => addToLikedMovies(movieDetails)}
                      className="group flex items-center border-[0.7px] border-white text-white font-medium sm:font-semibold text-xs sm:text-lg lg:px-10 xl:font-bold py-3 rounded shadow hover:shadow-lg hover:bg-white hover:border-white hover:text-red-700 outline-none focus:outline-none mt-4 mb-3 ease-linear transition-all duration-150"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-1 ml-2 text-white hover:text-red-700 group-hover:text-red-700 ease-linear transition-all duration-150"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Add To Liked Movies
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start lg:w-[35%]">
              <button
                onClick={() => playMovie(movieDetails)}
                className="text-white font-bold flex items-center border-[0.7px] border-white py-3 px-7 sm:px-10 rounded shadow hover:shadow-lg hover:bg-white hover:border-white hover:text-red-700 outline-none focus:outline-none mt-4 mb-3 ease-linear transition-all duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-2 text-red-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Play
              </button>
            </div>
          </section>

          {similarMovies.length > 0 && (
            <section className="bg-[#1c1c1c] p-6 sm:p-10 lg:p-14">
              <h1 className="text-white text-lg sm:text-2xl md:text-3xl font-bold mb-4">
                You May Also Like
              </h1>
              <div className="swiper-container">
                <div className="swiper-wrapper">
                  {similarMovies.map((movie) => (
                    <div key={movie.id} className="swiper-slide">
                      <div className="movie-card">
                        <img
                          src={`${imageUrl2 + movie.poster_path}`}
                          alt={movie.title}
                          className="movie-poster"
                          onClick={() =>
                            navigate(`/play/${movie.id}`, {
                              state: { From: "SimilarMovies" },
                            })
                          }
                        />
                        <h2 className="movie-title">{movie.title}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {moreTrailerVideos.length > 0 && (
            <section className="bg-[#1c1c1c] p-6 sm:p-10 lg:p-14">
              <h1 className="text-white text-lg sm:text-2xl md:text-3xl font-bold mb-4">
                More Trailers
              </h1>
              <div className="swiper-container">
                <div className="swiper-wrapper">
                  {moreTrailerVideos.map((video) => (
                    <div key={video.id} className="swiper-slide">
                      <iframe
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${video.key}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}

      <Footer />
    </div>
  );
}

export default Play;
