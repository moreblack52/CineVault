using System;

namespace CineVault.Models
{
    public class User
    {
        private string _name;
        private string _email;
        private string _password;

        public Guid Id { get; private set; }

        public string Name
        {
            get => _name;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Ім'я користувача не може бути порожнім");
                _name = value;
            }
        }

        public string Email
        {
            get => _email;
            set
            {
                if (string.IsNullOrWhiteSpace(value) || !value.Contains("@"))
                    throw new ArgumentException("Некоректна email адреса");
                _email = value;
            }
        }

        public string Password
        {
            get => _password;
            set
            {
                if (string.IsNullOrWhiteSpace(value) || value.Length < 6)
                    throw new ArgumentException("Пароль повинен містити щонайменше 6 символів");
                _password = value;
            }
        }

        public DateTime RegistrationDate { get; private set; }
        public Collection Collection { get; private set; }

        public User(string name, string email, string password)
        {
            Id = Guid.NewGuid();
            Name = name;
            Email = email;
            Password = password;
            RegistrationDate = DateTime.Now;
            Collection = new Collection($"Колекція {name}");
        }

        public void UpdateName(string newName)
        {
            Name = newName;
        }

        public bool CheckPassword(string inputPassword)
        {
            return _password == inputPassword;
        }

        public override string ToString()
        {
            return $"Користувач: {Name} ({Email}) | Зареєстрований: {RegistrationDate:dd.MM.yyyy}";
        }
    }
}
