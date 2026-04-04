using System;

namespace CineVault.Models
{
    public class Genre
    {
        private string _name;

        public Guid Id { get; private set; }

        public string Name
        {
            get => _name;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Назва жанру не може бути порожньою");
                _name = value;
            }
        }

        public Genre(string name)
        {
            Id = Guid.NewGuid();
            Name = name;
        }

        public override string ToString()
        {
            return Name;
        }
    }
}
