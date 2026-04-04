using System;
using System.Collections.Generic;

namespace CineVault.Models
{
    public class Movie
    {
        private string _title;
        private string _description;
        private double _rating;
        private int _year;

        public Guid Id { get; private set; }

        public string Title
        {
            get => _title;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Назва фільму не може бути порожньою");
                _title = value;
            }
        }

        public string Description
        {
            get => _description;
            set => _description = value ?? string.Empty;
        }

        public double Rating
        {
            get => _rating;
            set
            {
                if (value < 0 || value > 10)
                    throw new ArgumentException("Рейтинг повинен бути від 0 до 10");
                _rating = value;
            }
        }

        public int Year
        {
            get => _year;
            set
            {
                if (value < 1888 || value > DateTime.Now.Year + 2)
                    throw new ArgumentException("Некоректний рік випуску");
                _year = value;
            }
        }

        public Genre Genre { get; set; }
        public int DurationMinutes { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; private set; }

        public Movie(string title, int year, Genre genre)
        {
            Id = Guid.NewGuid();
            Title = title;
            Year = year;
            Genre = genre;
            Status = "Планую подивитися";
            Description = string.Empty;
            CreatedAt = DateTime.Now;
        }

        public void MarkAsWatched()
        {
            Status = "Переглянуто";
        }

        public void SetRating(double rating)
        {
            Rating = rating;
        }

        public void UpdateDescription(string description)
        {
            Description = description;
        }

        public override string ToString()
        {
            return $"[Фільм] {Title} ({Year}) | Жанр: {Genre?.Name ?? "—"} | Рейтинг: {Rating:0.0}/10 | Статус: {Status}";
        }
    }
}
