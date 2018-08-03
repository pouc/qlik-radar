define( [ "qlik", "./d3.min", "./radarChart.min", "text!./qlik-radar.css", "./objectGet"
],
function ( qlik, d3, RadarChart, cssContent, objGet ) {

	$("<style>").html(cssContent).appendTo("head");
	
	function createRows ( rows, dimensionInfo, measureInfo ) {
		return measureInfo.map((measure, index) => ({
			className: measure.title,
			axes: rows.map((row) => ({
				axis: row[0].qText,
				value: row[index + 1].qNum
			}))
		}))
	}

	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1
				},
				measures: {
					uses: "measures",
					min: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				},
				props: {
					component: "expandable-items",
					label: "Properties",
					items: {
						header1: {
							type: "items",
							label: "Axes",
							items: {
								header1_item1: {
									ref: "props.axes.maxValue",
									label: "Max value",
									type: "string",
									expression: "optional"
								}
							}
						}

					}
				}
			}
		},
		paint: function ($element, layout) {
		
			// Data
			var data = createRows( layout.qHyperCube.qDataPages[0].qMatrix, layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qMeasureInfo )
			
			// Chart object width
			var width = $element.width();
			
			// Chart object height
			var height = $element.height();
			
			// Chart object id
			var id = "container_" + layout.qInfo.qId;
			
			// Check if chart already exists
			if (document.getElementById(id)) {
			
				// if so clear it & reset width & height
				$('#' + id).empty();
				$('#' + id).width(width).height(height)
			}
			else {
				
				// if not create it
				$element.append($('<div />;').attr('id', id).width(width).height(height));
				$('#' + id).addClass('radar-chart')
			}		
			
			var svg = d3.select('#' + id).append('svg')
			  .attr('width', width + 10)
			  .attr('height', height);
			  
			var size = Math.min(width, height)
			
			var radarConfig = {
				w: size,
				h: size,
				maxValue: objGet(layout, 'props.axes.maxValue')
			}

			var chart = RadarChart.chart(width, height);
			var cfg = chart.config(radarConfig);
			svg.append('g').classed('single', 1).datum(data).call(chart);

			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

