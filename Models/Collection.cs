using System;
using System.Collections.Generic;
using System.Linq;

namespace CineVault.Models
{
    public class Collection
    {
        private string _name;

        public Guid Id { get; private set; }

        public string Name
        {
            get => _name;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Назва колекції не може бути порожньою");
                _name = value;
            }
        }

        public List<Movie> Movies { get; private set; }
        public List<Series> SeriesList { get; private set; }
        public DateTime LastUpdated { get; private set; }
        public DateTime CreatedAt { get; private set; }

        public Collection(string name)
        {
            Id = Guid.NewGuid();
            Name = name;
            Movies = new List<Movie>();
            SeriesList = new List<Series>();
            CreatedAt = DateTime.Now;
            LastUpdated = DateTime.Now;
        }

        public void AddMovie(Movie movie)
        {
            if (movie == null)
                throw new ArgumentNullException(nameof(movie));

            if (!Movies.Any(m => m.Id == movie.Id))
            {
                Movies.Add(movie);
                LastUpdated = DateTime.Now;
            }
        }

        public void AddSeries(Series series)
        {
            if (series == null)
                throw new ArgumentNullException(nameof(series));

            if (!SeriesList.Any(s => s.Id == series.Id))
            {
                SeriesList.Add(series);
                LastUpdated = DateTime.Now;
            }
        }

        public void RemoveMovie(Guid movieId)
        {
            var movie = Movies.FirstOrDefault(m => m.Id == movieId);
            if (movie != null)
            {
                Movies.Remove(movie);
                LastUpdated = DateTime.Now;
            }
        }

        public List<Movie> GetWatchedMovies()
        {
            return Movies.Where(m => m.Status == "Переглянуто").ToList();
        }

        public List<Series> GetCurrentlyWatchingSeries()
        {
            return SeriesList.Where(s => s.Status == "Дивлюся зараз").ToList();
        }

        public int GetTotalCount() => Movies.Count + SeriesList.Count;

        public override string ToString()
        {
            return $"Колекція \"{Name}\" | Фільмів: {Movies.Count} | Серіалів: {SeriesList.Count} | Оновлено: {LastUpdated:dd.MM.yyyy HH:mm}";
        }
    }
}
