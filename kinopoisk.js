(function() {
    // Отладка: Проверяем, что Lampa доступна
    if (!window.Lampa) {
        console.log('Lampa не найдена. Плагин не может быть загружен.');
        return;
    }

    var plugin = {
        name: 'KP Rating on Cards',
        version: '1.3',
        run: function() {
            console.log('Плагин KP Rating on Cards запущен.');

            // Проверяем наличие Lampa.Listener
            if (!Lampa.Listener) {
                console.log('Lampa.Listener не найден. Плагин не может работать.');
                return;
            }

            // Используем событие card_ready вместо hover
            Lampa.Listener.follow('card_ready', function(e) {
                try {
                    console.log('Событие card_ready сработало:', e);
                    var item = e.data || e.card;
                    var element = e.element;

                    if (!item || !element) {
                        console.log('Данные карточки или элемент недоступны:', e);
                        return;
                    }

                    // Проверяем наличие рейтинга Кинопоиска
                    var kp_rating = item.ratingKinopoisk || item.kp_rating || null;
                    if (!kp_rating) {
                        console.log('Рейтинг Кинопоиска недоступен для:', item);
                        return;
                    }

                    // Находим блок рейтинга TMDB
                    var rating_block = element.find('.card__rating');
                    if (rating_block.length) {
                        rating_block.find('.kp-rating').remove();
                        var rating_color = kp_rating >= 7 ? '#00cc00' : kp_rating >= 5 ? '#f5c518' : '#ff3333';
                        rating_block.append(
                            '<span class="kp-rating" style="margin-left: 5px; color: ' + rating_color + '; font-size: 12px; font-weight: bold;">KP: ' + kp_rating + '</span>'
                        );
                        console.log('Рейтинг Кинопоиска добавлен:', kp_rating);
                    } else {
                        console.log('Блок .card__rating не найден в элементе:', element);
                    }
                } catch (err) {
                    console.error('Ошибка в плагине KP Rating:', err);
                }
            });
        }
    };

    // Регистрация плагина
    console.log('Регистрация плагина в Lampa...');
    Lampa.Plugin.add(plugin);
})();
