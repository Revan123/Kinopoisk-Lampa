(function() {
    var plugin = {
        name: 'KP Rating on Cards',
        version: '1.2',
        run: function() {
            Lampa.Listener.follow('render', function(e) {
                try {
                    var item = e.data;
                    var element = e.element;
                    var kp_rating = item.ratingKinopoisk || item.kp_rating || null;
                    if (!kp_rating) {
                        if (!Lampa.Storage.get('kp_rating_missing_notified', false)) {
                            Lampa.Noty.show('Рейтинг Кинопоиска недоступен.');
                            Lampa.Storage.set('kp_rating_missing_notified', true);
                        }
                        return;
                    }
                    var rating_block = element.find('.card__rating');
                    if (rating_block.length) {
                        rating_block.find('.kp-rating').remove();
                        var rating_color = kp_rating >= 7 ? '#00cc00' : kp_rating >= 5 ? '#f5c518' : '#ff3333';
                        rating_block.append('<span class="kp-rating" style="margin-left: 5px; color: ' + rating_color + '; font-size: 12px; font-weight: bold;">KP: ' + kp_rating + '</span>');
                    }
                } catch (err) {
                    console.error('Ошибка в плагине:', err);
                }
            });
        }
    };
    if (window.Lampa) {
        window.Lampa.Plugin.add(plugin);
    }
})();
