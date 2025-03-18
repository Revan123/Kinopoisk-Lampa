(function() {
    var plugin = {
        name: 'KP Rating on Cards',
        version: '1.0',
        run: function() {
            // Перехватываем событие отрисовки карточек
            Lampa.Listener.follow('hover', function(e) {
                var item = e.data; // Данные фильма/сериала
                var element = e.element; // DOM-элемент карточки

                // Проверяем наличие рейтинга Кинопоиска
                var kp_rating = item.ratingKinopoisk || item.kp_rating || 'N/A';
                if (kp_rating && kp_rating !== 'N/A') {
                    // Находим блок рейтинга TMDB
                    var rating_block = element.find('.card__rating');
                    if (rating_block.length) {
                        // Удаляем старый рейтинг KP, если он уже есть (чтобы не дублировать)
                        rating_block.find('.kp-rating').remove();
                        // Добавляем рейтинг Кинопоиска рядом с TMDB
                        rating_block.append(
                            '<span class="kp-rating" style="margin-left: 5px; color: #f5c518; font-size: 12px; font-weight: bold;">KP: ' + kp_rating + '</span>'
                        );
                    }
                }
            });
        }
    };

    // Регистрация плагина
    if (window.Lampa) {
        window.Lampa.Plugin.add(plugin);
    }
})();
