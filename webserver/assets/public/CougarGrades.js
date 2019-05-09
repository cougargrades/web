
class CougarGrades {
    constructor(baseurl) {
        this.baseurl = baseurl;
    }

    elem(query) {
        return document.querySelector('#table_div')
    }

    Main() {
        document.getElementById('fetch').addEventListener('click', async () => {
            delete (new Query(this.baseurl, 'COSC', '1304', this.elem('#table_div')).process())
        })
    }
}

/*

google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(() => {
    var data = new google.visualization.DataTable();
    var options = {
        showRowNumber: true, 
        width: '100%', 
        height: '100%',
        cssClassNames: {
            headerRow: 'headerRow',
            tableRow: 'tableRow',
            oddTableRow: 'oddTableRow',
            selectedTableRow: 'selectedTableRow',
            hoverTableRow: 'hoverTableRow',
            headerCell: 'headerCell',
            tableCell: 'tableCell',
            rowNumberCell: 'rowNumberCell'
        }
    }

    data.addColumn('string', 'Name');
    data.addColumn('number', 'Salary');
    data.addColumn('boolean', 'Full Time Employee');
    data.addRows([
        ['Mike',  {v: 10000, f: '$10,000'}, true],
        ['Jim',   {v:8000,   f: '$8,000'},  false],
        ['Alice', {v: 12500, f: '$12,500'}, true],
        ['Bob',   {v: 7000,  f: '$7,000'},  true]
    ]);

    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, options);
});

document.getElementById('fetch').addEventListener('click', () => {
    fetch(`${this.baseurl}/api/table/201803/COSC/1304`).then(table => {
        console.log(table)
    })
})

*/