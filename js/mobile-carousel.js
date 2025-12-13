// mobile-carousel.js
document.addEventListener('DOMContentLoaded', function () {
    // Переменные для хранения элементов и состояния
    let buttons, cards;
    let isMobile = window.innerWidth <= 575;
    let currentCardIndex = 0; // Храним текущую карточку

    // Инициализация элементов
    function initElements() {
        buttons = [
            document.getElementById('card-item-1'),
            document.getElementById('card-item-2'),
            document.getElementById('card-item-3'),
            document.getElementById('card-item-4')
        ];

        cards = [
            document.getElementById('card-container-item-1'),
            document.getElementById('card-container-item-2'),
            document.getElementById('card-container-item-3'),
            document.getElementById('card-container-item-4')
        ];

        // Проверяем, что все элементы найдены
        const allButtonsExist = buttons.every(btn => btn !== null);
        const allCardsExist = cards.every(card => card !== null);

        return allButtonsExist && allCardsExist;
    }

    // Функция для мобильного режима
    function enableMobileMode() {
        console.log('Включаем мобильный режим');

        // Скрываем все карточки кроме текущей
        cards.forEach((card, index) => {
            card.style.display = index === currentCardIndex ? 'flex' : 'none';
        });

        // Обновляем кнопки
        buttons.forEach((button, index) => {
            button.style.backgroundColor = index === currentCardIndex
                ? 'var(--primary_green)'
                : 'var(--background-shade)';
        });

        // Показываем контейнер с кнопками
        const paginationAlt = document.querySelector('.pagination-container-alt');
        if (paginationAlt) {
            paginationAlt.style.display = 'flex';
        }
    }

    // Функция для десктопного режима
    function enableDesktopMode() {
        console.log('Включаем десктопный режим');

        // Показываем ВСЕ карточки
        cards.forEach(card => {
            card.style.display = 'flex';
        });

        // Сбрасываем кнопки (они будут скрыты CSS)
        buttons.forEach(button => {
            button.style.backgroundColor = 'var(--background-shade)';
        });

        // Скрываем контейнер с кнопками
        const paginationAlt = document.querySelector('.pagination-container-alt');
        if (paginationAlt) {
            paginationAlt.style.display = 'none';
        }
    }

    // Функция переключения карточки
    function switchToCard(index) {
        currentCardIndex = index;

        if (isMobile) {
            // В мобильном режиме показываем только одну карточку
            cards.forEach((card, i) => {
                card.style.display = i === index ? 'flex' : 'none';
            });

            // Обновляем кнопки
            buttons.forEach((button, i) => {
                button.style.backgroundColor = i === index
                    ? 'var(--primary_green)'
                    : 'var(--background-shade)';
            });
        }
    }

    // Основная функция инициализации
    function initCarousel() {
        // Инициализируем элементы
        if (!initElements()) {
            console.error('Не все элементы карусели найдены!');
            return;
        }

        // Определяем текущий режим
        isMobile = window.innerWidth <= 575;

        if (isMobile) {
            enableMobileMode();
        } else {
            enableDesktopMode();
        }

        // Добавляем обработчики кликов на кнопки
        buttons.forEach((button, index) => {
            // Удаляем старые обработчики (если есть)
            button.removeEventListener('click', button.clickHandler);

            // Создаем новый обработчик
            button.clickHandler = () => switchToCard(index);
            button.addEventListener('click', button.clickHandler);
        });

        // Инициализируем свайп для мобильных
        initSwipe();
    }

    // Функция для свайпа
    function initSwipe() {
        const cardContainer = document.querySelector('.card-container');
        if (!cardContainer) return;

        let startX = 0;

        cardContainer.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
        });

        cardContainer.addEventListener('touchend', function (e) {
            if (!isMobile) return;

            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const swipeThreshold = 50;

            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0) {
                    // Свайп влево - следующая карточка
                    const nextIndex = (currentCardIndex + 1) % 4;
                    switchToCard(nextIndex);
                } else {
                    // Свайп вправо - предыдущая карточка
                    const prevIndex = (currentCardIndex - 1 + 4) % 4;
                    switchToCard(prevIndex);
                }
            }
        });
    }

    // Обработчик изменения размера окна
    function handleResize() {
        const nowIsMobile = window.innerWidth <= 575;

        // Если режим изменился
        if (nowIsMobile !== isMobile) {
            isMobile = nowIsMobile;

            if (isMobile) {
                enableMobileMode();
            } else {
                enableDesktopMode();
            }
        }
    }

    // Инициализируем карусель при загрузке
    initCarousel();

    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', handleResize);

    // Также переинициализируем при изменении ориентации устройства
    window.addEventListener('orientationchange', function () {
        // Небольшая задержка для корректного определения размеров
        setTimeout(initCarousel, 100);
    });
});
