function optionChanged(selectedID){

    d3.json("data/samples.json").then((data) => {
    d3.select("#selDataset").html("");   
    data.metadata.forEach(item =>{
         d3.select ("#selDataset").append('option').attr('value', item.id).text(item.id);
    });

    d3.select("#selDataset").node().value = selectedID;
    const dataID = data.metadata.filter(item=> (item.id == selectedID));
    const panelDisplay = d3.select("#sample-metadata");
    panelDisplay.html("");

    Object.entries(dataID[0]).forEach(item=> {
        panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
    });


    // BAR CHART
    const sampleID = data.samples.filter(item => parseInt(item.id) == selectedID);
    var sampleValue = sampleID[0].sample_values.slice(0,10);
    sampleValue= sampleValue.reverse();
    var otuID = sampleID[0].otu_ids.slice(0,10);
    otuID = otuID.reverse();
    var otuLabels = sampleID[0].otu_labels
    otuLabels = otuLabels.reverse();
    const yAxis = otuID.map(item => 'OTU' + " " + item);

    const trace = {
        y: yAxis,
        x: sampleValue,
        type: 'bar',
        orientation: "h",
        text:  otuLabels,
        marker: {
            color: 'rgb(0, 100, 250)',
            line: {width: 1}
        }
    },
    
    layout = {
        title: "Sample's Top 10 OTU/Individual",
        xaxis: {title: 'Number of Samples Collected'},
        yaxis: {title: 'OTU ID'}
    };

    Plotly.newPlot('bar', [trace], layout,  {responsive: true});    
       
 // BUBBLE CHART
    const trace1 = {
        x: sampleID[0].otu_ids,
        y: sampleID[0].sample_values,
        text: sampleID[0].otu_labels,
        mode: 'markers',
        marker: {
            color: sampleID[0].otu_ids,
            colorscale: "Jet",
            size: sampleID[0].sample_values
        }
    },
 
    layout1 = {
        title: '<b>Sample Bubble Chart</b>',
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Number of Samples Collected'},
        showlegend: false,
    };

    Plotly.newPlot('bubble', [trace1], layout1, {responsive: true, scrollZoom: true});
 
    // BONUS: GAUGE CHART
    const guageDisplay = d3.select("#gauge");
    guageDisplay.html(""); 
    const washFreq = dataID[0].wfreq;
 
    const guageData = [{
        domain: {x: [0, 1], y: [0, 1]},
        value: washFreq,
        title: {text: "<b>Belly Button Washing Frequency </b><br> Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",     
        gauge: {
            axis: {range: [0,9]},
            bar: {color: "#000000"},
            steps: [
                {range: [0, 1], color: "#EDFFCE"},
                {range: [1, 2], color: "#D1FFAF"},
                {range: [2, 3], color: "#AAFF90"},
                {range: [3, 4], color: "#78FF73"},
                {range: [4, 5], color: "#56FF70"},
                {range: [5, 6], color: "#3BFC7C"},
                {range: [6, 7], color: "#20F891"},
                {range: [7, 8], color: "#19DCA9"},
                {range: [8, 9], color: "#56B870"}
                
            ],
            threshold: {value: washFreq}
        }
    }]; 
    const gaugeLayout = {width: 600, height: 400, margin: { t: 0, b: 0 }};

    Plotly.newPlot('gauge', guageData, gaugeLayout); 
 
});
}

optionChanged(940);

d3.select("#selDataset").on('change',() => {
    optionChanged(d3.event.target.value);
});