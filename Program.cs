using System;
using CineVault.Models;

namespace CineVault
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;


            var actionGenre = new Genre("Бойовик");
            var dramaGenre = new Genre("Драма");
            var scifiGenre = new Genre("Наукова фантастика");

            var movie1 = new Movie("Inception", 2010, scifiGenre);
            movie1.DurationMinutes = 148;
            movie1.UpdateDescription("Злодій, що краде секрети зі снів, отримує завдання посіяти ідею.");
            movie1.MarkAsWatched();
            movie1.SetRating(9.5);

            var movie2 = new Movie("The Dark Knight", 2008, actionGenre);
            movie2.DurationMinutes = 152;
            movie2.SetRating(9.0);
            movie2.MarkAsWatched();

            var series1 = new Series("Breaking Bad", 2008, dramaGenre, 5, 62);
            series1.UpdateProgress(3, 10);
            series1.Rating = 9.8;

            var series2 = new Series("Stranger Things", 2016, scifiGenre, 4, 34);
            series2.MarkAsWatched();
            series2.Rating = 8.7;

            var user = new User("Артур", "arthur@example.com", "Az123456");
            user.Collection.AddMovie(movie1);
            user.Collection.AddMovie(movie2);
            user.Collection.AddSeries(series1);
            user.Collection.AddSeries(series2);

            Console.WriteLine("CineVault — Моя колекція\n");
            Console.WriteLine(user);
            Console.WriteLine(user.Collection);
            Console.WriteLine();

            Console.WriteLine("Фільми");
            foreach (var m in user.Collection.Movies)
                Console.WriteLine("  " + m);

            Console.WriteLine("\nСеріали");
            foreach (var s in user.Collection.SeriesList)
                Console.WriteLine("  " + s);

            Console.WriteLine($"\nПереглянуті фільми: {user.Collection.GetWatchedMovies().Count} --");
            Console.WriteLine($"Серіали в процесі перегляду: {user.Collection.GetCurrentlyWatchingSeries().Count} --");
        }
    }
}
