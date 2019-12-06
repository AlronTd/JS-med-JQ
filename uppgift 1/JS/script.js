$(function () {
    async function main() {
        'use strict';
        
        const matchSuffix = '2'
        
        
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



        class validator {
            constructor(elem) {
                const validationClasses = [  , ]
                
                this.element = elem
                for(let HTMLClass of elem.classList){
                    switch (HTMLClass) {
                        case 'no-validate':
                            this.validate = () => {}
                            this.limitCharInput = () => {}
                            return;
                        case 'word': 
                            this.upperCharLimit = 40
                            this.badChars = /([^0-9\u0041-\u005A\u0061-\u007A\u00C0-00D6\u00D8-00F6\u00F8-00FF]|\s)+/
                            this.validate = (e) => validateWord(e, this.element, this.upperCharLimit,  this.badChars)
                            break;
                        case 'passwd':
                            this.upperCharLimit = 40
                            this.badChars = /([^0-9\u003F-\u005A\u0061-\u007A\u00C0-00D6\u00D8-00F6\u00F8-00FF\u0021\u0023-\u0026\u005F]|\s)+/
                            this.validate = (e) => validatePasswd(e, this.element, this.upperCharLimit,  this.badChars)
                            break;
                        case 'match':
                            
                            break;
                        case 'email':
                            
                            break;
                        default:
                            throw new Error('Feature not implemented!');
                    }
                }
                
                this.limitCharInput = (e) => preventBadInput(e, this.upperCharLimit, this.badChars)

            }
        }


        for (let elem of $('form input, form textarea')) {
            console.log(elem)
            console.log(elem.classList)
        }

    }
    main();
});