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
            if(willVisualise){
                elem.classList.add('is-valid')
            }
        }
        
        function checkMatch(e, elem, suffix){
            match = $(`#${elem.id}${suffix}`)
            if(!(match.length !== 1)){
                e.preventDefault()
                setInvalid(elem)
            }else{
                setValid(elem, true)
                setValid(match[0], true)
            }
        }
        
        function validateEmail(e, elem){
            
        }
        
        
        // represents a group of regular expressions
        class regExpCollection{
            constructor(regexArray) {
                this.collection = regexArray
                
                // returns true if any of the expressions are matched in the input string,
                // else returns false.
                this.testAny = (string) => {
                    for(let exp in this.collection){
                        if(exp.test(string)){
                            return true
                        }
                    }
                    return false
                }
                
                // returns true if all of the expressions are matched in the input string,
                // else returns false.
                this.testAll = (string) => {
                    for(let exp in this.collection){
                        if(!(exp.test(string))){
                            return false
                        }
                    }
                    return true
                }
                
                
                // returns an array of all substrings that any of the expressions match.
                this.exec = (string) => {
                    let result = []
                    for(let exp in this.collection){
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
                
                this.badChars = new regExpCollection([/[<>/]/])
                
                for(let HTMLClass of elem.classList){
                    switch (HTMLClass) {
                        case 'no-validate':
                            this.validate = (e) => {}
                            this.limitCharInput = (e) => {}
                            return;
                        case 'word': 
                            this.badChars.add(/^(?!.*([0-9]|[\u0041-\u005A]|[\u0061-\u007A]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u00FF]))/)
                            this.toValidate.push((e) => validateWord(e, this.element, this.badChars))
                            break;
                        case 'passwd':
                            this.badChars.add(/^(?!.*([0-9]|[\u003F-\u005A]|[\u0061-\u007A]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u00FF]|\u0021|[\u0023-\u0026]|\u005F))/)
                            this.toValidate.push((e) => validatePasswd(e, this.element, this.badChars))
                            break;
                        case 'email':
                            this.badChars.add(/^(?!.*([0-9]|[a-z]|\.|@))/)
                            this.toValidate.push((e) => validateEmail(e, this.element))
                            break;
                        case 'paragraph':
                            this.badChars.add(/^(?!.*([0-9]|[\u0041-\u005A]|[\u0061-\u007A]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u00FF]|\.|\s|:|\\))/)
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
                    for(let func of this.toValidate){
                        func(e)
                    }
                }
            }
        }

        console.log($('form input, form textarea'))
        for (let elem of $('form input, form textarea')) {
            console.log(elem)
            console.log(elem.classList)
        }

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