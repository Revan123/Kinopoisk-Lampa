var plugin = {
    version: "1.0.9", // Обновляем версию для ясности
    name: "Кинопоиск",
    description: "Показывает оценки с Кинопоиска в карточках Lampa",
    autor: "Revan",
    icon: "https://www.kinopoisk.ru/favicon.ico",
    settings: {
        status: true,
        auth: {
            name: "Авторизация",
            description: "Авторизоваться в Кинопоиске",
            onPress: function () {
                plugin.auth();
            }
        },
        logout: {
            name: "Выйти",
            description: "Сбросить авторизацию",
            onPress: function () {
                Lampa.Storage.set('kinopoisk_token', '');
                Lampa.Storage.set('kinopoisk_user', '{}');
                plugin.check();
            }
        }
    },

    // Проверка авторизации
    check: function () {
        var token = Lampa.Storage.get('kinopoisk_token', '');
        if (token) {
            plugin.get('https://kinopoiskapiunofficial.tech/api/v1/staff', function (data) {
                if (data.error) {
                    Lampa.Storage.set('kinopoisk_token', '');
                    Lampa.Storage.set('kinopoisk_user', '{}');
                    plugin.auth();
                } else {
                    Lampa.Storage.set('kinopoisk_user', JSON.stringify(data));
                    Lampa.Noty.show('Авторизация успешна');
                }
            });
        }
    },

    // Метод авторизации
    auth: function () {
        var token = Lampa.Storage.get('kinopoisk_token', '');
        if (!token) {
            var uuid = Lampa.Utils.uid(32);
            Lampa.Iframe.show({
                url: 'https://www.kinopoisk.ru/api/auth/authorize?client_id=web&response_type=code&state=' + uuid,
                onBack: function () {
                    Lampa.Modal.close();
                },
                onComplite: function (data) {
                    var code = data.url.match(/code=([^&]+)/);
                    if (code) {
                        plugin.get('https://kinopoiskapiunofficial.tech/api/v1/auth/token?code=' + code[1], function (token_data) {
                            if (token_data.access_token) {
                                Lampa.Storage.set('kinopoisk_token', token_data.access_token);
                                plugin.check();
                            } else {
                                Lampa.Noty.show('Ошибка авторизации: ' + (token_data.error_description || 'Неизвестная ошибка'));
                            }
                        }, function () {
                            Lampa.Noty.show('Не удалось получить токен. Проверьте подключение к интернету.');
                        });
                    }
                }
            });
        } else {
            plugin.check();
        }
    },

    // Метод для выполнения запросов к API с повторными попытками
    get: function (url, onsuccess, onerror, retryCount = 3) {
        var token = Lampa.Storage.get('kinopoisk_token', '');
        var network = new Lampa.Network();

        var headers = {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        };

        var attemptRequest = function (attempt) {
            network.silent(url, function (data) {
                if (data) {
                    onsuccess(data);
                } else {
                    if (attempt < retryCount) {
                        setTimeout(function () {
                            attemptRequest(attempt + 1);
                        }, 1000 * attempt); // Задержка увеличивается с каждой попыткой
                    } else {
                        if (onerror) onerror();
                        Lampa.Noty.show('Ошибка загрузки данных с Кинопоиска после ' + retryCount + ' попыток');
                    }
                }
            }, function () {
                if (attempt < retryCount) {
                    setTimeout(function () {
                        attemptRequest(attempt + 1);
                    }, 1000 * attempt);
                } else {
                    if (onerror) onerror();
                    Lampa.Noty.show('Ошибка сети при запросе к Кинопоиску после ' + retryCount + ' попыток');
                }
            }, false, { headers: headers });
        };

        attemptRequest(1);
    },

    // Добавление оценок в карточки фильмов
    card: function (item) {
        var token = Lampa.Storage.get('kinopoisk_token', '');
        if (token && item.movie && (item.movie.imdb_id || item.movie.kinopoisk_id)) {
            var id = item.movie.kinopoisk_id || item.movie.imdb_id;
            var type = item.movie.kinopoisk_id ? 'kp' : 'imdb';

            plugin.get('https://kinopoiskapiunofficial.tech/api/v2.2/films/' + id + '/ratings?type=' + type, function (data) {
                if (data.rating) {
                    item.rating_kinopoisk = '★ ' + data.rating;
                    Lampa.Controller.refresh();
                }
            }, function () {
                console.log('Kinopoisk: Не удалось загрузить рейтинг для фильма ' + id);
            });
        }
    },

    // Меню плагина
    menu: function (menu_items) {
        var token = Lampa.Storage.get('kinopoisk_token', '');
        menu_items.push({
            title: 'Кинопоиск',
            subtitle: token ? 'Авторизован' : 'Не авторизован',
            onSelect: function () {
                if (token) {
                    plugin.settings.logout.onPress();
                } else {
                    plugin.auth();
                }
            }
        });
    },

    // Подписка на события Lampa
    bind: function () {
        Lampa.Listener.follow('render', function (e) {
            var items = e.items || [];
            items.forEach(function (item) {
                if (item.movie) plugin.card(item);
            });
        });

        Lampa.Listener.follow('menu', function (e) {
            plugin.menu(e.items);
        });
    },

    // Инициализация плагина
    init: function () {
        plugin.check();
        plugin.bind();
    }
};

// Запуск плагина
plugin.init();
