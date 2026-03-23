console.log("quiz.js loaded");

// Функция для загрузки вопросов из JSON
async function loadQuestions() {
    const response = await fetch('/static/rsci/quiz.json');  // Указываем путь к JSON
    const data = await response.json();

    console.log(data);

    const quizContainer = document.getElementById('quizForm');
    data.questions.forEach((questionData, index) => {
        // Перемешиваем варианты ответов
        const shuffledOptions = shuffle(questionData.options);

        const questionHtml = `
            <div class="mb-4">
                <label class="form-label">${index + 1}. ${questionData.question}</label>
                ${shuffledOptions.map((option, i) => `
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="q${index}" value="${option}" id="q${index}a${i}">
                        <label class="form-check-label" for="q${index}a${i}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        quizContainer.innerHTML += questionHtml;
    });
}

// Функция для перемешивания массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Меняем местами элементы
    }
    return array;
}

// Функция для проверки ответов
function checkAnswers() {
    const quizData = fetch('/static/rsci/quiz.json')
        .then(response => response.json())
        .then(data => {
            let score = 0;
            data.questions.forEach((questionData, index) => {
                const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
                if (selectedAnswer && selectedAnswer.value === questionData.correctAnswer) {
                    score++;
                }
            });
            alert(`Вы набрали ${score} из ${data.questions.length} правильных ответов.`);
        });
}

// Загружаем вопросы при загрузке страницы
window.onload = loadQuestions;
