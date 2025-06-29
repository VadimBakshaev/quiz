(function () {
    /use strict/;

    const Test = {
        titleEl: null,
        optionsEl: null,
        quiz: null,
        progressBar: null,
        prevBtnEl: null,
        nextBtnEl: null,
        currentQuestionIndex: 1,
        userResult: [],
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
            document.querySelector('.test-pre-title').innerText = this.quiz.name;
            this.progressBar = document.querySelector('.test-progress-bar');
            this.titleEl = document.querySelector('.test-question');
            this.optionsEl = document.querySelector('.test-question-options');
            this.prevBtnEl = document.querySelector('.test-actions-prev');
            this.prevBtnEl.addEventListener('click', () => {
                this.move('prev');
            });
            this.nextBtnEl = document.querySelector('.test-actions-next');
            this.nextBtnEl.addEventListener('click', () => {
                this.move('next');
            });
            document.querySelector('.test-action-skip').addEventListener('click', () => {
                this.move('skip');
            })
            this.prepareProgressBar();
            this.showQuestion();

            const timer = document.querySelector('.test-actions-time-clock');
            let seconds = 59;
            const interval = setInterval(function () {
                timer.innerText = seconds;
                seconds--;
                if (seconds === 0) {
                    clearInterval(interval);
                    this.complete();
                };
            }.bind(this), 1000)
        },
        prepareProgressBar() {
            for (let i = 0; i < this.quiz.questions.length; i++) {
                const progressEl = document.createElement('div');
                progressEl.className = 'progress-bar-item' + (i === 0 ? ' active' : '');

                const progressCircleEl = document.createElement('div');
                progressCircleEl.className = 'progress-bar-item-circle';

                const progressTextEl = document.createElement('div');
                progressTextEl.className = 'progress-bar-item-text';
                progressTextEl.innerText = `Вопрос ${i + 1}`;

                progressEl.appendChild(progressCircleEl);
                progressEl.appendChild(progressTextEl);
                this.progressBar.appendChild(progressEl);
            };
        },
        showQuestion() {
            const that = this;
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
            const choosenOption = this.userResult.find(el => {
                return el.questionId === activeQuestion.id
            });
            
            this.titleEl.innerHTML = `<span>Вопрос ${this.currentQuestionIndex}:</span> ${activeQuestion.question}`;
            this.optionsEl.innerHTML = '';
            activeQuestion.answers.forEach(answer => {
                const optionEl = document.createElement('div');
                optionEl.className = 'test-question-option';

                const inputEl = document.createElement('input');
                inputEl.className = 'option-answer';
                inputEl.setAttribute('id', 'answer-' + answer.id);
                inputEl.setAttribute('type', 'radio');
                inputEl.setAttribute('name', 'answer');
                inputEl.setAttribute('value', answer.id);
                if (choosenOption && choosenOption.choosenAnswerId === answer.id) {
                    inputEl.setAttribute('checked', 'checked');
                };
                inputEl.addEventListener('change', function () {
                    that.chooseAnswer();
                });

                const labelEl = document.createElement('label');
                labelEl.setAttribute('for', 'answer-' + answer.id);
                labelEl.innerText = answer.answer;

                optionEl.appendChild(inputEl);
                optionEl.appendChild(labelEl);
                this.optionsEl.appendChild(optionEl);
            });
            if (choosenOption && choosenOption.choosenAnswerId) {
                this.nextBtnEl.removeAttribute('disabled');
            } else {
                this.nextBtnEl.setAttribute('disabled', 'disabled');
            };
            if (this.currentQuestionIndex === this.quiz.questions.length) {
                this.nextBtnEl.innerText = 'Завершить';
            } else {
                this.nextBtnEl.innerText = 'Дальше';
            };
            if (this.currentQuestionIndex > 1) {
                this.prevBtnEl.removeAttribute('disabled');
            } else {
                this.prevBtnEl.setAttribute('disabled', 'disabled');
            };
        },
        chooseAnswer() {
            this.nextBtnEl.removeAttribute('disabled');
        },
        move(action) {
            const chosenAnswer = Array.from(document.querySelectorAll('.option-answer')).find(el => {
                return el.checked;
            });
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
            let chosenAnswerId = null;
            if (chosenAnswer && chosenAnswer.value) {
                chosenAnswerId = Number(chosenAnswer.value);
            };

            const existingResult = this.userResult.find(el => {
                return el.questionId === activeQuestion.id;
            });
            if (existingResult) {
                existingResult.chosenAnswerId = chosenAnswerId;
            } else {
                this.userResult.push({
                    questionId: activeQuestion.id,
                    chosenAnswerId: chosenAnswerId
                });
            };

            if (action === 'next' || action === 'skip') {
                this.currentQuestionIndex++;
            } else {
                this.currentQuestionIndex--;
            };

            if (this.currentQuestionIndex > this.quiz.questions.length) {
                this.complete();
                return;
            };

            Array.from(this.progressBar.children).forEach((item, index) => {
                item.classList.remove('complete');
                item.classList.remove('active');

                if (index + 1 === this.currentQuestionIndex) {
                    item.classList.add('active');
                } else if (index + 1 < this.currentQuestionIndex) {
                    item.classList.add('complete');
                }
            });

            this.showQuestion();
        },
        complete() {
            const url = new URL(location.href);
            const id = url.searchParams.get('id');
            const firstName = url.searchParams.get('firstName');
            const lastName = url.searchParams.get('lastName');
            const email = url.searchParams.get('email');

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://testologia.ru/pass-quiz?id=' + id, false);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            console.log(this.userResult);
            xhr.send(JSON.stringify({
                name: firstName, 
                lastName, email,
                results: this.userResult
            }));
            if (xhr.status === 200 && xhr.responseText) {
                let result = null;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    console.log(e);
                };
                if (result) {
                    location.href = `./result.html?score=${result.score}&total=${result.total}`;

                }
            } else {
                console.log(xhr.status);
            };
        }
    };
    Test.init();
})();