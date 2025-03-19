let Kinopoisk = {
    API_KEY: '6EFFPRV-1314X37-GEJ8XB9-04D4GQ5',
    BASE_URL: 'https://api.kinopoisk.dev/v1.4',

    // Универсальная функция для запросов к API
    fetchAPI: function (url, params, callback) {
        let fullUrl = this.BASE_URL + url;
        let headers = {
            'X-API-KEY': this.API_KEY
        };

        Network.get(fullUrl, params, headers).then((response) => {
            let json = JSON.parse(response);
            callback(json);
        }).catch((error) => {
            console.error('Kinopoisk API Error:', error);
            callback({ error: true });
        });
    },

    // Поиск фильмов
    search: function (params, callback) {
        let query = params.query || '';
        this.fetchAPI('/movie/search', { query: query, limit: 10 }, (data) => {
            if (data.error || !data.docs) {
                callback({ results: [] });
                return;
            }

            let results = data.docs.map(item => ({
                id: item.id,
                title: item.name || item.alternativeName || 'Без названия',
                year: item.year,
                poster: item.poster?.url || '',
                rating: item.rating?.kp || item.rating?.imdb || 0,
                type: item.type
            }));

            callback({ results: results });
        });
    },

    // Получение полной информации о фильме по ID
    full: function (id, callback) {
        this.fetchAPI('/movie/' + id, {}, (data) => {
            if (data.error || !data) {
                callback({ error: true });
                return;
            }

            let movie = {
                id: data.id,
                title: data.name || data.alternativeName || 'Без названия',
                original_title: data.alternativeName || data.name,
                description: data.description || '',
                year: data.year,
                poster: data.poster?.url || '',
                rating: data.rating?.kp || data.rating?.imdb || 0,
                genres: data.genres?.map(g => g.name) || [],
                countries: data.countries?.map(c => c.name) || [],
                actors: data.persons?.filter(p => p.enProfession === 'actor').map(p => p.name) || [],
                directors: data.persons?.filter(p => p.enProfession === 'director').map(p => p.name) || [],
                runtime: data.movieLength || 0,
                release_date: data.premiere?.world || ''
            };

            callback(movie);
        });
    },

    // Получение похожих фильмов
    similar: function (id, callback) {
        this.fetchAPI('/movie/' + id, {}, (data) => {
            if (data.error || !data.similarMovies) {
                callback([]);
                return;
            }

            let similar = data.similarMovies.map(item => ({
                id: item.id,
                title: item.name || item.alternativeName || 'Без названия',
                poster: item.poster?.url || ''
            }));

            callback(similar);
        });
    },

    // Категории (пример для популярных фильмов)
    category: function (params, callback) {
        let page = params.page || 1;
        this.fetchAPI('/movie', { 
            sortField: 'rating.kp', 
            sortType: '-1', 
            limit: 10, 
            page: page 
        }, (data) => {
            if (data.error || !data.docs) {
                callback({ results: [] });
                return;
            }

            let results = data.docs.map(item => ({
                id: item.id,
                title: item.name || item.alternativeName || 'Без названия',
                year: item.year,
                poster: item.poster?.url || '',
                rating: item.rating?.kp || item.rating?.imdb || 0
            }));

            callback({ results: results, total_pages: data.pages });
        });
    }
};

// Пример использования (оставлен для совместимости с исходным кодом)
if (typeof module !== 'undefined') {
    module.exports = Kinopoisk;
}
