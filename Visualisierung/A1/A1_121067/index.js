import * as vega from "vega"
import * as vegaLite from "vega-lite"
import * as vl from "vega-lite-api"


console.log("cars.csv");

vl.register(vega,vegaLite, {});

const data = vl.csv("cars.csv");



const mpg_displacement =
vl.markCircle()
.data(data)
.encode(
    vl.x().fieldQ('mpg').scale({zero:false}),
    vl.y().fieldQ('displacement').scale({zero:false}),
    /* vl.color().fieldN('name') */
).render()
.then(chart =>{
    document.getElementById('forVega').append(chart);
})

const mpg_weight =
vl.markCircle()
.data(data)
.encode(
    vl.x().fieldQ('mpg').scale({zero:false}),
    vl.y().fieldQ('weight').scale({zero:false}),
    /* vl.color().fieldN('name') */
).render()
.then(chart =>{
    document.getElementById('forVega').append(chart);
})

const mpg_acceleration =
vl.markCircle()
.data(data)
.encode(
    vl.x().fieldQ('mpg').scale({zero:false}),
    vl.y().fieldQ('acceleration').scale({zero:false}),
    /* vl.color().fieldN('name') */
).render()
.then(chart =>{
    document.getElementById('forVega').append(chart);
})

const mpg_year =
vl.markLine()
.data(data)
.encode(
    vl.y().average('mpg').scale({zero:false}),
    vl.x().fieldN('year').scale({zero:false})
)
.render()
.then(chart =>{
    document.getElementById('forVega').append(chart);
})
const horse_country =
vl.markBar()
.data(data)
.encode(
    vl.y().fieldN('origin'),
    vl.x().average('horsepower').scale({zero:false})
)
.render()
.then(chart =>{
    document.getElementById('forVega').append(chart);
})

const car_year =
vl.markLine()
.data(data)
.encode(
    vl.y().count('year').scale({zero:false}),
    vl.x().fieldQ('year'),
    vl.color().fieldN('origin')
)
.render()
.then(chart =>{
    document.getElementById('forVega').append(chart);
})

/* vl.hconcat(
    mpg_displacement,
    mpg_acceleration, mpg_year)
.render()
.then(chart =>{
    document.getElementById('forVega').append(chart);
}) */