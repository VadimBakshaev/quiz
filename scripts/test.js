(function () {
    const Test = {
        titleEl: null,
        optionsEl: null,
        quiz: null,
        currentQuestionIndex: 1,
        init() {
            checkUserData();
            const url = new URL(location.href);
            const testId = url.searchParams.get('id');
            if (testId) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quiz = JSON.parse(xhr.responseText);
                    } catch (e) {
                        console.log(e);
                    };
                    this.startQuiz();
                } else {
                    console.log(xhr.status);
                }
            } else {
                console.log(testId);
            }
        },
        startQuiz() {
            console.log(this.quiz);
            this.titleEl = document.querySelector('.test-question');
            this.optionsEl = document.querySelector('.test-question-options');
            this.showQuestion();
        },
        showQuestion() {
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
            this.titleEl.innerHTML = `<span>Вопрос ${this.currentQuestionIndex}:</span> ${activeQuestion.question}`;
            this.optionsEl.innerHTML = '';
            activeQuestion.answers.forEach(answer => {
                const optionEl = document.createElement('div');
                optionEl.className = 'test-question-option';

                const inputEl = document.createElement('input');
                inputEl.setAttribute('id', 'answer-' + answer.id);
                inputEl.setAttribute('type', 'radio');
                inputEl.setAttribute('name', 'answer');
                inputEl.setAttribute('value', answer.id);

                const labelEl = document.createElement('label');
                labelEl.setAttribute('for', 'answer-' + answer.id);
                labelEl.innerText = answer.answer;

                optionEl.appendChild(inputEl);
                optionEl.appendChild(labelEl);
                this.optionsEl.appendChild(optionEl);
            });

        }
    };
    Test.init();
})();