
class CougarGrades {
    constructor(baseurl) {
        this.baseurl = baseurl;
    }

    Main() {
        let $ = (q) => document.querySelector(q)
        let $$ = (q) => document.querySelectorAll(q)

        $(`.form input[type='submit']`).addEventListener('click', async () => {
            //delete (new Chart(this.baseurl, elem(`.form input[name='dept']`).value, elem(`.form input[name='number']`).value, elem('#chart_div')).process())
            //delete (new Table(this.baseurl, elem(`.form input[name='dept']`).value, elem(`.form input[name='number']`).value, elem('#table_div')).process())

            let list = [
                'COSC 1430',
                'MATH 3336'
            ]
            let container = $('#results')
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