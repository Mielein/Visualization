import * as vega from "vega"
import * as vegaLite from "vega-lite"
import * as vl from "vega-lite-api"


console.log("Hello in the console");
//alert('Boooooo')


vl.register(vega,vegaLite, {});

const data = vl.csv("iris.csv");

vl.markPoint()
.data(data)
.encode(
    vl.x().fieldQ(vl.repeat('column')).scale({zero:false}),
    vl.y().fieldQ(vl.repeat('row')).scale({zero:false}),
    vl.color().fieldN('species')
)
.repeat({
    column: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],

    row: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
})
.render()
.then(chart =>{
    document.getElementById('forVega').append(chart);
})