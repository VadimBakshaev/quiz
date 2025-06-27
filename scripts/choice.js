(function () {
    /use strict/;

    const Choice = {
        quizzes: [],
        init() {
            checkUserData();
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quizzes', false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quizzes = JSON.parse(xhr.responseText);
                } catch (e) {
                    console.log(e);
                };
                this.processQuizzes();
            } else {
                console.log(xhr.status);
            }
        },
        processQuizzes() {
            if (this.quizzes && this.quizzes.length > 0) {
                const contentEl = document.querySelector('.choice-content');
                const that = this;
                this.quizzes.forEach(quiz => {
                    const choiseEl = document.createElement('div');
                    choiseEl.className = 'choice-option';
                    choiseEl.setAttribute('data-id', quiz.id);
                    choiseEl.addEventListener('click', function () {
                        that.chooseQuiz(this);
                    });

                    const choiceTextEl = document.createElement('div');
                    choiceTextEl.className = 'choice-option-text';
                    choiceTextEl.innerText = quiz.name;

                    const choiseArrowEl = document.createElement('div');
                    choiseArrowEl.className = 'choice-option-arrow';

                    const choiseArrowImgEl = document.createElement('img');
                    choiseArrowImgEl.setAttribute('src', './images/arrow.svg');
                    choiseArrowImgEl.setAttribute('alt', 'Arrow to right');

                    choiseArrowEl.appendChild(choiseArrowImgEl);
                    choiseEl.appendChild(choiceTextEl);
                    choiseEl.appendChild(choiseArrowEl);
                    contentEl.appendChild(choiseEl);
                });
            };
        },
        chooseQuiz(element) {
            const datId = element.getAttribute('data-id');
            if (datId) {
                location.href = './test.html' + location.search + '&id=' + datId;
            };
        }

    };
    Choice.init();
})()