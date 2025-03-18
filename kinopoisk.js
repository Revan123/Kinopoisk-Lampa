(function() {
    // Ждём полной загрузки Lampa
    function checkLampa() {
        if (window.Lampa) {
            startPlugin();
        } else {
            setTimeout(checkLampa, 100);
        }
    }

    function startPlugin() {
        var plugin = {
            name: 'KP Rating on Cards',
            version: '1.6',
            run: function() {
                Lampa.Listener.follow('app', function() {
                    // Ждём загрузки компонента карточек
                    function checkCardComponent() {
                        if (Lampa.Component && Lampa.Component.card) {
                            initializePlugin();
                        } else {
                            setTimeout(checkCardComponent, 100);
                        }
                    }
                    checkCardComponent();
                });
            }
        };

        function initializePlugin() {
            var originalCardRender = Lampa.Component.card;
            
            Lampa.Component.card = function(card, element) {
                var result = originalCardRender.apply(this, arguments);
                
                // Добавляем try-catch для безопасности
                try {
                    if (card && element) {
                        var rating = parseFloat(card.rating_kp || card.kinopoisk_rating || 
                                             card.kp_rating || (card.ratings && card.ratings.kp) || 
                                             (card.rating && card.rating.kp));
                        
                        if (rating && !isNaN(rating)) {
                            var rating_block = $(element).find('.card__rating');
                            if (rating_block.length) {
                                var rating_color = rating >= 7 ? '#00cc00' : 
                                                 rating >= 5 ? '#f5c518' : '#ff3333';
                                
                                // Проверяем, нет ли уже добавленного рейтинга
                                if (!rating_block.find('.kp-rating').length) {
                                    rating_block.append(
                                        $('<div class="kp-rating"></div>')
                                            .css({
                                                'margin-left': '5px',
                                                'color': rating_color,
                                                'font-size': '1em',
                                                'font-weight': 'bold',
                                                'display': 'inline-block'
                                            })
                                            .text('KP ' + rating.toFixed(1))
                                    );
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('KP Rating plugin error:', error);
                }
                
                return result;
            };
        }

        // Регистрируем плагин
        Lampa.Plugin.add(plugin);
    }

    // Запускаем проверку наличия Lampa
    checkLampa();
})();
