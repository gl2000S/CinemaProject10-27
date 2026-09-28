// server/models/Movie.js
class Movie {
  constructor(row) {
    this.movieId = row.movie_id;
    this.title = row.title;
    this.category = row.category;
    this.director = row.director;
    this.releaseDate = row.release_date;
    this.durationMins = row.duration_mins;
    this.rating = row.rating;
    this.posterUrl = row.poster_url;
    this.trailerUrl = row.trailer_url;
    this.synopsis = row.synopsis;
    this.isNowShowing = row.is_now_showing;
    this.priceAdult = row.price_adult || 12.00;
    this.priceChild = row.price_child || 8.00;
    this.priceSenior = row.price_senior || 9.00;
  }
}
module.exports = Movie;






