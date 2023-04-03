
// Параметры по умолчанию
let cardCount = 9;
let arrowType = 'black';

const cardItems = document.querySelectorAll('.card-list-item');
const gameSizeInputs = document.querySelectorAll('input[name="grid-size"]');
gameSizeInputs.forEach(item => {
    item.addEventListener('change', (e) => {
        const selectedCardCount = +e.target.value;
        cardCount = selectedCardCount;
        //Скрываем все карточки
        for (let index = 0; index < cardItems.length; index++) {
            const card = cardItems[index];
            card.classList.remove('show', "_error");
        }
        // Показываем нужно колличество карточек
        for (let index = 0; index < selectedCardCount; index++) {
            const card = cardItems[index];
            card.classList.add('show');
        }
    });
});


const arrowInputs = document.querySelectorAll('input[name="arrow-type"]');
arrowInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        const inputArrowType = e.target.value;
        arrowType = inputArrowType;
    });
});


const cardFileInputs = document.querySelectorAll('.card-list-item input[type="file"]');
cardFileInputs.forEach(fileInput => {
    fileInput.addEventListener('change', (e) => {
        fileInput.closest('.card-list-item.show').classList.remove('_error');
        const fileNameArea = fileInput.closest('.list-item__image-load');
        const fileNameText = fileNameArea.querySelector('.file-name');
        //Получаем формат файла
        const isfile = e.target.files[0];
        if (isfile) {
            const fileFormat = e.target.files[0].type.toLowerCase();
            //Проверяем подходит ли файл
            if (fileFormat == 'image/png' || fileFormat == 'image/jpg' || fileFormat == 'image/bmp' || fileFormat == 'image/jpeg') {
                const fileName = e.target.files[0].name;
                fileNameArea.classList.add('file-selected');
                fileNameText.innerHTML = fileName;
            } else {
                alert('Выберите файлы PNG, JPG или BMP');
                fileInput.value = '';
            }
        } else {
            fileNameArea.classList.remove('file-selected');
            fileNameText.innerHTML = '';
        }

    });
});


const gameResultMessage = document.querySelector('.game-result__textarea');
gameResultMessage.addEventListener('input', (e) => {
    const messageValue = e.target.value.trim();
    if (messageValue.length < 1) {
        gameResultMessage.closest('.game-result-massage').classList.add('_error');
    } else {
        gameResultMessage.closest('.game-result-massage').classList.remove('_error');
    }
});



const cardForm = document.querySelector('#card-game-form');
cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cardsFiles = document.querySelectorAll('.card-list-item.show input[type="file"]');
    // Валидируем на наличие подгруженного файла
    cardsFiles.forEach(fileInput => {
        const fileInputValue = fileInput.value;
        if (!fileInputValue) {
            fileInput.closest('.card-list-item.show').classList.add('_error');
        }
    });
    // Проверка наличия текста в поле ввода поздравления пользователя.
    const gameResultMessageValue = gameResultMessage.value.trim();
    if (gameResultMessageValue.length < 1) {
        gameResultMessage.closest('.game-result-massage').classList.add('_error');
    } else {
        gameResultMessage.closest('.game-result-massage').classList.remove('_error');
    }

    // Колличество ошибок в форме
    const formErrorsLength = document.querySelectorAll('#card-game-form ._error').length;
    if (formErrorsLength > 0) return;

    // Текст из карточек в виде массива
    const cardItems = document.querySelectorAll('.card-list-item.show');
    const cardsText = Array.from(cardItems).reduce((acc, item, index) => {
        const cardItemText = item.querySelector('textarea').value.trim();
        acc.push({
            [`Карточка № ${index + 1}`]: cardItemText,
        });
        return acc;
    }, []);

    // Собираем карточки в FormData;
    const formImages = new FormData();
    Array.from(cardItems).forEach((item, index) => {
        const cardFileInput = item.querySelector('input[type="file"]');
        formImages.append(`Изображение карточки ${index + 1}`, cardFileInput.files[0]);
    });
    const cardFormData = {
        arrowType,
        cardsText,
        formImages,
        'resultMessage': gameResultMessageValue,
    }
    console.log(cardFormData);
});
