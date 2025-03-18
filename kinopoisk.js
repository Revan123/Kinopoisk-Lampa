(function() {
    // Проверка наличия Lampa и jQuery
    if (!window.Lampa || !window.$) {
        console.log('Lampa или jQuery не найдены. Плагин не может быть загружен.');
        return;
    }

    var plugin = {
        name: 'KP Rating on Cards',
        version: '1.6',
        run: function() {
            console.log('Плагин KP Rating on Cards запущен.');

            // Ждём полной загрузки приложения
            Lampa.Listener.follow('app_ready', function() {
                console.log('Приложение Lampa полностью загружено.');

                // Задержка для стабильности на Tizen
                setTimeout(function() {
                    // Перехватываем компонент карточек
                    var originalCardRender = Lampa.Component.card;
                    if (!originalCardRender) {
                        console.log('Lampa.Component.card не найден.');
                        return;
                    }

                    Lampa.Component.card = function(card, element) {
                        try {
                            // Вызываем оригинальную функцию рендеринга
                            var result = originalCardRender.apply(this, arguments);

                            // Проверяем наличие данных карточки
                            if (!card || !element) {
                                console.log('Данные карточки или элемент недоступны:', card);
                                return result;
                            }

                            // Проверяем наличие рейтинга Кинопоиска
                            var kp_rating = card.ratingKinopoisk || card.kp_rating || card.rating?.kinopoisk || null;
                            if (!kp_rating || isNaN(kp_rating)) {
                                console.log('Рейтинг Кинопоиска недоступен для:', card);
                                return result;
                            }

                            // Находим блок рейтинга TMDB
                            var rating_block = $(element).find('.card__rating');
                            if (rating_block.length === 0) {
                                console.log('Блок .card__rating не найден в элементе:', element);
                                return result;
                            }

                            // Удаляем старый рейтинг KP
                            rating_block.find('.kp-rating').remove();

                            // Определяем цвет
                            var rating_color = kp_rating >= 7 ? '#00cc00' : kp_rating >= 5 ? '#f5c518' : '#ff3333';

                            // Добавляем рейтинг Кинопоиска
                            rating_block.append(
                                '<span class="kp-rating" style="margin-left: 5px; color: ' + rating_color + '; font-size: 12px; font-weight: bold;">KP: ' + kp_rating + '</span>'
                            );
                            console.log('Рейтинг Кинопоиска добавлен:', kp_rating);

                            return result;
                        } catch (err) {
                            console.error('Ошибка в плагине KP Rating:', err);
                            return result;
                        }
                    };
                }, 1000); // Задержка 1 секунда
            });
        }
    };

    // Регистрация плагина
    console.log('Регистрация плагина KP Rating on Cards...');
    Lampa.Plugin.add(plugin);
})();
