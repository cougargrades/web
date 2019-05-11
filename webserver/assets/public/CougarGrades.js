
class CougarGrades {
    constructor(baseurl) {
        this.baseurl = baseurl;
    }

    Main() {
        let $ = (q) => document.querySelector(q)
        let $$ = (q) => document.querySelectorAll(q)

        //M.AutoInit();
        let chips = M.Chips.init($('.chips'), {
            limit: 6
        })
        chips.addChip({
            tag: 'COSC 1430',
            image: null
        })
        chips.addChip({
            tag: 'MATH 2331',
            image: null
        })
        let autocomplete = M.Autocomplete.init($('input.autocomplete'))
        M.Modal.init(document.querySelectorAll('.modal'));

        $(`.form #submit`).addEventListener('click', async () => {
            let searchbar = chips.chipsData.map(value => {
                return value.tag
            })
            let container = $('#results')

            let results = $$('#results .zcollapsible')
            let preloaded = []
            // populate preloaded elements
            for(let i = 0; i < results.length; i++) {
                preloaded.push(results[i].innerText)
            }
            // check for elements that are from a previous query and aren't requested anymore
            for(let i = 0; i < preloaded.length; i++) {
                if(!searchbar.includes(preloaded[i])) {
                    console.log(`removing ${preloaded[i]}`)
                    let offenders = document.querySelectorAll(`[x-cougargrades-course=\'${preloaded[i]}\']`)
                    for(let j = 0; j < offenders.length; j++) {
                        offenders[j].parentNode.removeChild(offenders[j])
                    }
                }
            }
            
            // check for new searchbar requests that aren't preloaded yet and make them
            for(let elem of searchbar) {
                if(!preloaded.includes(elem)) {
                    let course = new Course(elem.split(' ')[0], elem.split(' ')[1])
                    let collap = new Collapsible(this.baseurl, course, container)
                    await collap.create()
                }
            }
        })
    }
}

class Undesired {
    constructor() {
        //
    }
}