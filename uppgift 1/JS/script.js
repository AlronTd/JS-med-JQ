$(function () {
    async function main() {
        'use strict';

        function isTextField(elem) {

            const nonTextTypes = ['button', 'radio', 'checkbox', 'color', 'hidden', 'image', 'reset', 'submit']

            switch (elem.tagName) {
                case 'TEXTAREA': return true;
                case 'INPUT': 
                    for (let type of nonTextTypes) {
                        if (elem.type == type) {
                            return false
                        }
                    }
                    return true;
                default: return false;
            }
        }



        class validator {
            constructor(elem) {
                this.element = elem
                

                this.limitCharInput = (e) => {
                    this.charLimit
                }


            }
        }


        for (let elem of $('form input, form textarea, form button')) {
            console.log(elem)
        }

    }
    main();
});