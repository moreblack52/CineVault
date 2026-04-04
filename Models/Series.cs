using System;

namespace CineVault.Models
{
    public class Series
    {
        private string _title;
        private double _rating;
        private int _currentSeason;
        private int _currentEpisode;

        public Guid Id { get; private set; }

        public string Title
        {
            get => _title;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Назва серіалу не може бути порожньою");
                _title = value;
            }
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

        public int CurrentSeason
        {
            get => _currentSeason;
            set
            {
                if (value < 1 || value > TotalSeasons)
                    throw new ArgumentException("Некоректний номер сезону");
                _currentSeason = value;
            }
        }

        public int CurrentEpisode
        {
            get => _currentEpisode;
            set
            {
                if (value < 0)
                    throw new ArgumentException("Номер серії не може бути від'ємним");
                _currentEpisode = value;
            }
        }

        public Genre Genre { get; set; }
        public int StartYear { get; set; }
        public int TotalSeasons { get; set; }
        public int TotalEpisodes { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; private set; }

        public Series(string title, int startYear, Genre genre, int totalSeasons, int totalEpisodes)
        {
            Id = Guid.NewGuid();
            Title = title;
            StartYear = startYear;
            Genre = genre;
            TotalSeasons = totalSeasons;
            TotalEpisodes = totalEpisodes;
            _currentSeason = 1;
            _currentEpisode = 0;
            Status = "Планую подивитися";
            CreatedAt = DateTime.Now;
        }

        public void UpdateProgress(int season, int episode)
        {
            CurrentSeason = season;
            CurrentEpisode = episode;
            Status = "Дивлюся зараз";
        }

        public void MarkAsWatched()
        {
            _currentSeason = TotalSeasons;
            _currentEpisode = TotalEpisodes;
            Status = "Переглянуто";
        }

        public string GetProgressSummary()
        {
            return $"Сезон {CurrentSeason}, Серія {CurrentEpisode} з {TotalEpisodes}";
        }

        public override string ToString()
        {
            return $"[Серіал] {Title} ({StartYear}) | {TotalSeasons} сез. | Прогрес: {GetProgressSummary()} | Статус: {Status}";
        }
    }
}
