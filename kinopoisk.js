(function() {
    // Проверяем наличие Lampa
    if (!window.Lampa) {
        console.log('Lampa не найдена. Плагин не может быть загружен.');
        return;
    }

    var plugin = {
        name: 'KP Rating on Cards',
        version: '1.4',
        run: function() {
            console.log('Плагин KP Rating on Cards запущен.');

            // Проверяем наличие Lampa.Listener
            if (!Lampa.Listener) {
                console.log('Lampa.Listener не найден.');
                return;
            }

            // Используем событие render для работы с карточками
            Lampa.Listener.follow('render', function(e) {
                try {
                    // Данные карточки могут быть в e.card или e.item
                    var item = e.card || e.item || e.data;
                    var element = e.element;

                    // Проверяем наличие данных
                    if (!item || !element) {
                        console.log('Данные карточки или элемент недоступны:', e);
                        return;
                    }

                    // Проверяем наличие рейтинга Кинопоиска
                    var kp_rating = item.ratingKinopoisk || item.kp_rating || item.rating?.kinopoisk || null;
                    if (!kp_rating) {
                        console.log('Рейтинг Кинопоиска недоступен для:', item);
                        return;
                    }

                    // Находим блок рейтинга TMDB
                    var rating_block = element.find('.card__rating');
                    if (!rating_block.length) {
                        console.log('Блок .card__rating не найден в элементе:', element);
                        return;
                    }

                    // Удаляем старый рейтинг KP, чтобы избежать дублирования
                    rating_block.find('.kp-rating').remove();

                    // Определяем цвет в зависимости от значения рейтинга
                    var rating_color = kp_rating >= 7 ? '#00cc00' : kp_rating >= 5 ? '#f5c518' : '#ff3333';

                    // Добавляем рейтинг Кинопоиска
                    rating_block.append(
                        '<span class="kp-rating" style="margin-left: 5px; color: ' + rating_color + '; font-size: 12px; font-weight: bold;">KP: ' + kp_rating + '</span>'
                    );
                    console.log('Рейтинг Кинопоиска добавлен:', kp_rating);
                } catch (err) {
                    console.error('Ошибка в плагине KP Rating:', err);
                }
            });
        }
    };

    // Регистрация плагина
    console.log('Регистрация плагина KP Rating on Cards...');
    Lampa.Plugin.add(plugin);
})();
