$(function () {
    async function main() {
        'use strict';

        const matchSuffix = '2'


        function setInvalid(elem) {
            elem.classList.remove('is-valid')
            elem.classList.add('is-invalid')
        }

        function setValid(elem, willVisualise) {
            elem.classList.remove('is-invalid')
            if (willVisualise) {
                elem.classList.add('is-valid')
            }
        }

        function checkMatch(e, elem, suffix) {

            match = $(`#${elem.id}${suffix}`)

            if (!(match.length !== 1)) {

                setInvalid(elem)
            } else {

                setValid(elem, true)
                setValid(match[0], true)
            }
        }

        function preventBadInput(e, badChars) {
            
            while (badChars.testAny(e.target.value)) {
                
                for (let exp of badChars.collection) {
                    
                    e.target.value = e.target.value.replace(exp, '')
                    e.target.textContent = e.target.textContent.replace(exp, '')
                    e.target.innerHTML = e.target.innerHTML.replace(exp, '')
                }
            }
        }

        function validateEmail(e, elem) {
            if(!(/([a-z]|[0-9])+@([a-z]|[0-9])+\.([a-z]|[0-9])+/.test(elem.value))){
                setInvalid(elem)
            }else{
                setValid(elem, false)
            }
        }
        
        function validateWord(e, elem) {
            
        }


        // represents a group of regular expressions
        class regExpCollection {
            constructor(regexArray) {
                this.collection = regexArray

                // returns true if any of the expressions are matched in the input string,
                // else returns false.
                this.testAny = (string) => {
                    for (let exp of this.collection) {
                        if (exp.test(string)) {
                            return true
                        }
                    }
                    return false
                }

                // returns true if all of the expressions are matched in the input string,
                // else returns false.
                this.test = (string) => {
                    for (let exp of this.collection) {
                        if (!(exp.test(string))) {
                            return false
                        }
                    }
                    return true
                }


                // returns an array of all substrings that any of the expressions match.
                this.exec = (string) => {
                    let result = []
                    for (let exp in this.collection) {
                        result = result.concat(exp.exec(string))
                    }
                    return result
                }

                // adds a regular expression to the collection.
                this.add = (regex) => this.collection.push(regex)
            }
        }

        class validator {
            constructor(elem) {

                this.element = elem
                this.toValidate = []    // array of functions

                this.badChars = new regExpCollection([/[<>\\]/])

                for (let HTMLClass of elem.classList) {
                    switch (HTMLClass) {
                        case 'no-validate':
                            this.validate = (e) => { }
                            this.limitCharInput = (e) => { }
                            return;
                        case 'word':
                            this.badChars.add(/[\.\,\;\|\:\*\'\^\¨\~\%\¤\&\#\"\`\´\!\?\@\£\${\[\]\}\\\+\-\_\/\=\(\)\€\s]/)
                            this.toValidate.push((e) => validateWord(e, this.element, this.badChars))
                            break;
                        case 'passwd':
                            this.badChars.add(/[\.\,\;\|\:\'\^\¨\~\¤\"\`\´{\[\]\}\/\=\(\)\s]/)
                            this.toValidate.push((e) => validatePasswd(e, this.element, this.badChars))
                            break;
                        case 'email':
                            this.badChars.add(/[\,\;\|\:\*\'\^\¨\~\%\¤\&\#\"\`\´\!\?\£\${\[\]\}\\\+\-\_\/\=\(\)\€\s]/)
                            this.toValidate.push((e) => validateEmail(e, this.element))
                            break;
                        case 'paragraph':
                            this.badChars.add(/[\¨\¤{\[\]\}\\\_]/)
                            this.toValidate.push((e) => validateWord(e, this.element, this.badChars))
                            break;
                        case 'match':
                            this.toValidate.push((e) => checkMatch(e, this.element, matchSuffix))
                            break;
                        default:
                            break;
                    }
                }

                this.limitCharInput = (e) => preventBadInput(e, this.badChars)

                this.validate = (e) => {
                    for (let func of this.toValidate) {
                        func(e)
                    }
                }
            }
        }

        console.log($('form input, form textarea'))

        const validators = []

        for (let elem of $('form input, form textarea')) {
            let eventHandler = new validator(elem)
            validators.push(eventHandler)
            elem.addEventListener('keyup', eventHandler.limitCharInput)
            elem.addEventListener('blur', eventHandler.limitCharInput)
        }

        $('#pp6-form').on('submit', (e) => {
            e.preventDefault()

            let valid = true;

            for (validator in validators) {
                validator.validate(e)
                if (validator.elem.classList.includes('is-invalid')) {
                    valid = false
                }
            }

            if (valid) {
                window.location.href = window.location.pathname.replace('index', 'login') //TODO: bugfix
            }
        })

    }
    main();
});

        // function isTextField(elem) {

        //     const nonTextTypes = ['button', 'radio', 'checkbox', 'color', 'hidden', 'image', 'reset', 'submit']

        //     switch (elem.tagName) {
        //         case 'TEXTAREA': return true;
        //         case 'INPUT': 
        //             for (let type of nonTextTypes) {
        //                 if (elem.type == type) {
        //                     return false
        //                 }
        //             }
        //             return true;
        //         default: return false;
        //     }
        // }