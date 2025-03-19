(function () {
    'use strict';

    // Объект плагина
    var plugin = {
        name: 'Случайный фильм',
        version: '1.0',
        description: 'Добавляет кнопку для выбора случайного фильма на главную',
        init: function () {
            // Ждём загрузки интерфейса Lampa
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') {
                    // Добавляем кнопку на главную страницу
                    addRandomButton();
                }
            });
        }
    };

    // Функция добавления кнопки
    function addRandomButton() {
        // Проверяем, что главная страница загружена
        if (!Lampa.Menu || !Lampa.Activity) return;

        // Создаём кнопку
        var button = $('<div class="menu__item selector" data-action="random_movie"><span>Случайный фильм</span></div>');

        // Добавляем кнопку в меню на главной
        $('.menu .menu__list').append(button);

        // Обработчик клика по кнопке
        button.on('hover:enter', function () {
            getRandomMovie();
        });
    }

    // Функция получения случайного фильма
    function getRandomMovie() {
        // Используем TMDB API через встроенный каталог Lampa
        var api_url = 'http://api.themoviedb.org/3/discover/movie?api_key=4ef0d7355d9ffb5151e987764708ce96&language=ru&sort_by=popularity.desc&page=' + Math.floor(Math.random() * 100) + 1;

        Lampa.Utils.get(api_url, function (data) {
            if (data.results && data.results.length) {
                // Выбираем случайный фильм из списка
                var movie = data.results[Math.floor(Math.random() * data.results.length)];

                // Открываем карточку фильма
                Lampa.Activity.push({
                    url: '',
                    title: movie.title || movie.name,
                    component: 'full',
                    id: movie.id,
                    type: 'movie',
                    source: 'tmdb'
                });
            } else {
                Lampa.Utils.toast('Не удалось загрузить фильмы');
            }
        }, function () {
            Lampa.Utils.toast('Ошибка загрузки');
        });
    }

    // Регистрация плагина
    if (!window.plugins) window.plugins = {};
    window.plugins['random_movie'] = plugin;

    // Сообщаем Lampa, что плагин готов
    if (window.Lampa) {
        Lampa.Plugin.register(plugin);
    }
})();
