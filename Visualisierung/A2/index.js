import * as vl from "vega-lite-api"
import * as vega from "vega"
import * as vegaLite from "vega-lite"

vl.register(vega, vegaLite, {})

const data = vl.csv("./data/reduced_daily_climate_summary.csv")

// base construct of chart 
// please adjust to match your questions
vl.markBar({size: 15})
    .data(data)
    .encode(
        // define which data to encode in here
        vl.y().fieldN("STATION_NAME"),
        vl.x().average('HUMIDITY'),
        vl.color().fieldN('STATION_NAME')
    )
    .render()
    .then(chart => {
        // define to which element the chart should be attached
        document.getElementById("q1").appendChild(chart);
    });

    vl.markLine()
    .data(data)
    .encode(
        // define which data to encode in here
        vl.y().average("SUNSHINE_DURATION").scale({zero:false}),
        vl.x().month('DATE').scale({zero:false}),
        vl.color().fieldN('STATION_NAME')
    )
    .render()
    .then(chart => {
        // define to which element the chart should be attached
        document.getElementById("q2").appendChild(chart);
    });

    vl.markCircle()
    .data(data)
    .encode(
        // define which data to encode in here
        vl.x().fieldQ("SUNSHINE_DURATION").scale({zero:false}),
        vl.y().average('TEMPERATURE_AIR').scale({zero:false}),
        //vl.color().fieldN('STATION_NAME')
    )
    .render()
    .then(chart => {
        // define to which element the chart should be attached
        document.getElementById("q3").appendChild(chart);
    });

    const date_tmp = vl.markBar()
    .data(data)
    .encode(
        vl.x().month("DATE").type('ordinal').title('Month'),
        vl.y().average("TEMPERATURE_AIR").scale({zero:false}).type('quantitative').title('average air temperature (C°)').axis({orient:'left'}),
        
    );
    const snow = vl.markLine({stroke: 'firebrick'})
    .data(data)
    .encode(
        vl.y().average('SNOW_DEPTH').type('quantitative').title('average snow depth (cm)',{color:'red'} ).axis({orient:'right'}),
        vl.x().month("DATE").type('ordinal').title('Month'),
        
    );

    vl.layer(date_tmp, snow)
    .render()
    .then(chart => {
        // define to which element the chart should be attached
        document.getElementById("composite").appendChild(chart);
    });
