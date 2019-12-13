$(function () {
    async function main() {
        'use strict';

        
        function validateCheckBox(name) {
            let all = $(`input[name=${name}`)
    
            if(all.is(':checked')) {
                all.removeClass('is-invalid')
                $('#reg-check-error').css('display', 'none')
                
                for(let radio of all) {
                    if(radio.checked) {
                        setValid(radio, true)
                    }
                }
            }
            else {
                all.addClass('is-invalid')
                $('#reg-check-error').addClass('d-block')
            }
        }
        
        
        const matchSuffix = '2'


        function setInvalid(elem) {
            console.log(`setting invalid: ${elem.id}`)
            elem.classList.remove('is-valid')
            elem.classList.add('is-invalid')
        }

        function setValid(elem, willVisualise) {
            console.log(`setting valid: ${elem.id}`)
            elem.classList.remove('is-invalid')
            if (willVisualise) {
                elem.classList.add('is-valid')
            }
        }

        function checkMatch(e, elem, suffix) {

            let match = $(`#${elem.id}${suffix}`)

            if (!(match.length !== 1 || match.value !== elem.value)) {
                console.log(`found no match for ${elem.id}`)
                setInvalid(elem)
            } else {
                if (elem.value) {
                    setValid(elem, true)
                    setValid(match[0], true)
                }
                console.log(`found match for ${elem.id}`)
                
            }
        }

        function preventBadInput(e, badChars) {

            while (badChars.testAny(e.target.value)) {

                for (let exp of badChars.collection) {

                    e.target.value = e.target.value.replace(exp, '')
                    e.target.textContent = e.target.textContent.replace(exp, '')
                    e.target.innerHTML = e.target.innerHTML.replace(exp, '')
                }
                console.log(`preventing ${e.key}`)

            }
        }

        function validateEmail(e, elem) {
            if (!(/^(?:[a-z]|[0-9]|\.)+@(?:[a-z]|[0-9]|\.)+\.(?:[a-z]|[0-9])+$/.test(elem.value))) {
                console.log(`email ${elem.id} invalid`)
                setInvalid(elem)

            } else {
                console.log(`email ${elem.id} valid`)

                setValid(elem, false)

            }
        }

        function validateWord(e, elem) {
            console.log(`validating ${elem.id}`)

            const hasWhitespace = /\s/.test(elem.value)
            const startsWithLetter = /^(?:[a-z]|[A-Z]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F7-\u00F7]).*/.test(elem.value)
            if (hasWhitespace || !(startsWithLetter)) {
                console.log(`word ${elem.id} invalid`)

                setInvalid(elem)

            } else {
                console.log(`word ${elem.id} valid`)

                setValid(elem, false)

            }
        }

        function validateParagraph(e, elem) {
            if (!(/^.+$/.test(elem.value))) {
                console.log(`paragraph ${elem.id} invalid`)

                setInvalid(elem)

            } else {
                console.log(`paragraph ${elem.id} valid`)

                setValid(elem, false)
            }
        }

        function validatePasswd(e, elem) {
            console.log(`validating ${elem.id}`)

            const containsNumber = /\d/.test(elem.value)
            const containsLetter = /[a-z]|[A-Z]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F7-\u00F7]/.test(elem.value)
            validateWord(e, elem)
            if (elem.value.length < 5 || !(containsNumber && containsLetter)) {
                console.log(`passwd ${elem.id} invalid`)

                setInvalid(elem)

            } else {
                console.log(`passwd ${elem.id} valid`)

                setValid(elem, false)
            }
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
                            this.toValidate.push((e) => validateWord(e, this.element))
                            break;
                        case 'passwd':
                            this.badChars.add(/[\.\,\;\|\:\'\^\¨\~\"\`\´{\[\]\}\/\=\(\)\s]/)
                            this.toValidate.push((e) => validatePasswd(e, this.element))
                            break;
                        case 'email':
                            this.badChars.add(/[\,\;\|\:\*\'\^\¨\~\%\¤\&\#\"\`\´\!\?\£\${\[\]\}\\\+\-\_\/\=\(\)\€\s]/)
                            this.toValidate.push((e) => validateEmail(e, this.element))
                            break;
                        case 'paragraph':
                            this.badChars.add(/[\¨\¤{\[\]\}\\\_\n]/)
                            this.toValidate.push((e) => validateParagraph(e, this.element))
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
                    console.log(`running validate on ${this.element.id}`)

                    for (let func of this.toValidate) {
                        func(e)
                    }
                }

                elem.addEventListener('click', this.limitCharInput)
                elem.addEventListener('blur', this.limitCharInput)
                elem.addEventListener('keyup', this.limitCharInput)
                console.log(`created validator for ${elem.id}`)
            }
        }

        const validators = []

        for (let elem of $('form input, form textarea, form select')) {
            let eventHandler = new validator(elem)
            validators.push(eventHandler)
        }
        
        console.log(window.location.href.replace('index', 'register-success'))
        console.log(window.location.href.replace('login', 'login-success'))
        
        $('#pp6-form').on('submit', (e) => {
            e.preventDefault()

            let valid = true;
            
            $('#reg-check-error').removeClass('d-block')
            validateCheckBox('reg-eula')
            validateCheckBox('sex')
            
            for (let v of validators) {
                v.validate(e)
                if (v.element.classList.contains('is-invalid')) {
                    valid = false
                }
            }

            
            
            if (valid) {
                console.log(`redirecting...`)
                
                if(window.location.href.includes('index')){
                    window.location.href = window.location.href.replace('index', 'register-success')
                }else if(window.location.href.includes('login')){
                    window.location.href = window.location.href.replace('login', 'login-success')
                }
                

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