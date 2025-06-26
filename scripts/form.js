(function () {
    /use strict/;

    const Form = {
        formElement: null,
        agreeElement: null,
        processElement: null,
        fields: [
            {
                name: 'firstName',
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false
            },
            {
                name: 'lastName',
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false
            },
            {
                name: 'email',
                element: null,
                regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                valid: false
            }
        ],
        init() {
            const that = this;
            this.fields.forEach(item => {
                item.element = document.getElementById(item.name);
                item.element.addEventListener('change', function () {
                    that.validateField(item, this);
                })
            });
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.addEventListener('change', function () {
                that.validateForm();
            });
            this.formElement = document.querySelector('.form');
            this.formElement.addEventListener('submit', function () {
                that.processForm();
            });
            this.processElement = document.querySelector('.form-btn');
        },
        validateField(field, element) {
            if (!element.value || !element.value.match(field.regex)) {
                element.parentNode.style.borderColor = 'red';
                field.valid = false;
            } else {
                element.parentNode.removeAttribute('style');
                field.valid = true;
            }
            this.validateForm();
        },
        validateForm() {
            if (this.fields.every(item => item.valid) && this.agreeElement.checked) {
                this.processElement.removeAttribute('disabled');
                return true;
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
                return false;
            }
        },
        processForm() {
            if (this.validateForm()) {
                let paramString = '';
                this.fields.forEach(item => {
                    paramString += `${(paramString ? '&' : '?')}${item.name}=${item.element.value}`
                });

                location.href = 'https://dzen.ru';
                //document.location.assign('https://www.cyberforum.ru/javascript/thread310584.html') //+ paramString;
            }
        }
    };
    Form.init();
})();