(function() {
    var plugin = {
        name: 'KP Rating on Cards',
        version: '1.0',
        run: function() {
            // Проверка авторизации
            var token = Lampa.Storage.get('kinopoisk_token', '');
            if (!token) {
                Lampa.Noty.show('Авторизуйтесь в Кинопоиске через настройки плагина');
                return;
            }

            // Перехват отрисовки карточек в списке
            Lampa.Listener.follow('hover', function(e) {
                var item = e.data;
                var element = e.element;

                // Предполагаем, что рейтинг уже доступен как item.ratingKinopoisk
                var kp_rating = item.ratingKinopoisk || 'N/A';
                if (kp_rating !== 'N/A') {
                    var rating_block = element.find('.card__rating');
                    if (rating_block.length) {
                        rating_block.find('.kp-rating').remove();
                        rating_block.append(
                            '<span class="kp-rating" style="margin-left: 5px; color: #f5c518; font-size: 12px; font-weight: bold;">KP: ' + kp_rating + '</span>'
                        );
                    }
                }
            });
        }
    };

    if (window.Lampa) {
        window.Lampa.Plugin.add(plugin);
    }
})();
