
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
        // autocomplete.updateData({
        //     "Apple": null,
        //     "Microsoft": null,
        //     "Google": null
        // });

        $(`.form #submit`).addEventListener('click', async () => {
            let list = chips.chipsData.map(value => {
                return value.tag
            })

            let container = $('#results')
            let fc = container.firstChild
            while(fc) {
                container.removeChild(fc)
                fc = container.firstChild
            }
            for(let elem of list) {
                console.log(elem)
                let course = new Course(elem.split(' ')[0], elem.split(' ')[1])
                let collap = new Collapsible(this.baseurl, course, container)
                await collap.create()
            }
        })
    }
}

class Undesired {
    constructor() {
        //
    }
}