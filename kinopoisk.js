(function() {
    var plugin = {
        name: 'KP Rating on Cards',
        version: '1.1',
        run: function() {
            // Перехватываем событие отрисовки карточек в главном меню
            Lampa.Listener.follow('hover', function(e) {
                try {
                    var item = e.data; // Данные фильма/сериала
                    var element = e.element; // DOM-элемент карточки

                    // Проверяем наличие рейтинга Кинопоиска
                    var kp_rating = item.ratingKinopoisk || item.kp_rating || null;
                    if (!kp_rating) {
                        // Если рейтинга нет, можно вывести уведомление (один раз)
                        if (!Lampa.Storage.get('kp_rating_missing_notified', false)) {
                            Lampa.Noty.show('Рейтинг Кинопоиска недоступен. Убедитесь, что данные загружаются.');
                            Lampa.Storage.set('kp_rating_missing_notified', true);
                        }
                        return;
                    }

                    // Находим блок рейтинга TMDB
                    var rating_block = element.find('.card__rating');
                    if (rating_block.length) {
                        // Удаляем старый рейтинг KP, чтобы избежать дублирования
                        rating_block.find('.kp-rating').remove();

                        // Определяем цвет в зависимости от значения рейтинга
                        var rating_color = kp_rating >= 7 ? '#00cc00' : kp_rating >= 5 ? '#f5c518' : '#ff3333';

                        // Добавляем рейтинг Кинопоиска рядом с TMDB
                        rating_block.append(
                            '<span class="kp-rating" style="margin-left: 5px; color: ' + rating_color + '; font-size: 12px; font-weight: bold;">KP: ' + kp_rating + '</span>'
                        );
                    }
                } catch (err) {
                    console.error('Ошибка в плагине KP Rating:', err);
                }
            });
        }
    };

    // Регистрация плагина в Lampa
    if (window.Lampa) {
        window.Lampa.Plugin.add(plugin);
    }
})();
