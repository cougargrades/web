
class CougarGrades {
    constructor(baseurl) {
        this.baseurl = baseurl;
    }

    elem(query) {
        return document.querySelector(query)
    }

    Main() {
        this.elem(`.form input[type='submit']`).addEventListener('click', async () => {
            delete (new Chart(this.baseurl, this.elem(`.form input[name='dept']`).value, this.elem(`.form input[name='number']`).value, this.elem('#chart_div')).process())
            delete (new Table(this.baseurl, this.elem(`.form input[name='dept']`).value, this.elem(`.form input[name='number']`).value, this.elem('#table_div')).process())
        })
    }
}

class Undesired {
    constructor() {
        //
    }
}