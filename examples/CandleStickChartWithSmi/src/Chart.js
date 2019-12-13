
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	StraightLine,
	CandlestickSeries,
	LineSeries,
	SmiSeries,
	StochasticSeries,
	ChoppinessSeries
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
	MovingAverageTooltip,
	StochasticTooltip,
	SingleValueTooltip
} from "react-stockcharts/lib/tooltip";
import { ema, smiOscillator, stochasticOscillator, choppinessOscillator } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const smiAppearance = {
	stroke: Object.assign({},
		SmiSeries.defaultProps.stroke)
};

const stoAppearance = {
	stroke: Object.assign({},
		StochasticSeries.defaultProps.stroke)
};

const choppinessAppearance = {
	stroke: Object.assign({},
		ChoppinessSeries.defaultProps.stroke)
};

class CandleStickChartWithFullSmiIndicator extends React.Component {
	render() {
		const height = 750;
		const { type, data: initialData, width, ratio } = this.props;
		const margin = { left: 70, right: 70, top: 20, bottom: 30 };

		const gridHeight = height - margin.top - margin.bottom;
		const gridWidth = width - margin.left - margin.right;

		const showGrid = true;
		const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 } : {};
		const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 } : {};

		const ema20 = ema()
			.id(0)
			.options({ windowSize: 20 })
			.merge((d, c) => {d.ema20 = c;})
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(2)
			.options({ windowSize: 50 })
			.merge((d, c) => {d.ema50 = c;})
			.accessor(d => d.ema50);

		const smi = smiOscillator()
			.options({ emaWindowSize: 3, kWindowSize: 14, dWindowSize: 14 })
			.merge((d, c) => {d.smi = c;})
			.accessor(d => d.smi);
		
		const fullSTO = stochasticOscillator()
			.options({ windowSize: 3, kWindowSize: 14, dWindowSize: 3 })
			.merge((d, c) => {d.fullSTO = c;})
			.accessor(d => d.fullSTO);
		
		const choppiness = choppinessOscillator()
			.options({ windowSize: 14 })
			.merge((d, c) => {d.choppiness = c;})
			.accessor(d => d.choppiness);

		const index = 100;
		console.log(JSON.stringify(initialData[index]));
		const calculatedData = ema20(ema50(smi(fullSTO(choppiness(initialData)))));
		console.log(JSON.stringify(calculatedData[index]));

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];
		return (
			<ChartCanvas height={750}
				width={width}
				ratio={ratio}
				margin={margin}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart id={1} height={325}
					yExtents={d => [d.high, d.low]}
					padding={{ top: 10, bottom: 20 }}
				>
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid}/>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries />

					<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

					<CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
					<CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<StraightLine type="vertical" xValue={608} />;
					<StraightLine type="vertical" xValue={558} strokeDasharray="Dot" />;
					<StraightLine type="vertical" xValue={578} strokeDasharray="LongDash" />;

					<OHLCTooltip origin={[-40, -10]} xDisplayFormat={timeFormat("%Y-%m-%d %H:%M:%S")}/>
					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 5]}
						options={[
							{
								yAccessor: ema20.accessor(),
								type: ema20.type(),
								stroke: ema20.stroke(),
								windowSize: ema20.options().windowSize,
							},
							{
								yAccessor: ema50.accessor(),
								type: ema50.type(),
								stroke: ema50.stroke(),
								windowSize: ema50.options().windowSize,
							},
						]}
					/>
				</Chart>
				<Chart id={2}
					yExtents={[-100, 100]}
					height={125} origin={(w, h) => [0, h - 375]} padding={{ top: 10, bottom: 10 }}
				>
					{/*<XAxis axisAt="bottom" orient="bottom" {...xGrid} />*/}
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right"
						tickValues={[-40, 0, 40]} />

					{/*<MouseCoordinateX*/}
					{/*	at="bottom"*/}
					{/*	orient="bottom"*/}
					{/*	displayFormat={() => ""}*/}
					{/*/>*/}
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<SmiSeries
						yAccessor={d => d.smi}
						{...smiAppearance} />

					<StochasticTooltip
						origin={[-38, 15]}
						yAccessor={d => d.smi}
						options={smi.options()}
						appearance={smiAppearance}
						label="SMI" />
				</Chart>
				<Chart id={3}
				       yExtents={[0, 100]}
				       height={125} origin={(w, h) => [0, h - 250]} padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} {...xGrid} />
					<YAxis axisAt="right" orient="right"
					       tickValues={[20, 50, 80]} />
					
					{/*<MouseCoordinateX*/}
					{/*	at="bottom"*/}
					{/*	orient="bottom"*/}
					{/*	displayFormat={() => ""}*/}
					{/*	// displayFormat={timeFormat("%Y-%m-%d %H:%M:%S")}*/}
					{/*/>*/}
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<StochasticSeries
						yAccessor={d => d.fullSTO}
						{...stoAppearance} />
					
					<StochasticTooltip
						origin={[-38, 15]}
						yAccessor={d => d.fullSTO}
						options={fullSTO.options()}
						appearance={stoAppearance}
						label="Full STO" />
				</Chart>
				<Chart id={4}
				       yExtents={[0, 100]}
				       height={125} origin={(w, h) => [0, h - 125]} padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom" {...xGrid} />
					<YAxis axisAt="right" orient="right"
					       tickValues={[20, 50, 80]} />
					
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d %H:%M:%S")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<ChoppinessSeries
						yAccessor={d => d.choppiness}
						{...choppinessAppearance} />
					
					<SingleValueTooltip
						origin={[-38, 15]}
						yAccessor={d => d.choppiness}
						options={choppiness.options()}
						appearance={choppinessAppearance}
						label="Choppiness" />
				</Chart>
				
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}
CandleStickChartWithFullSmiIndicator.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithFullSmiIndicator.defaultProps = {
	type: "hybrid",
};

CandleStickChartWithFullSmiIndicator = fitWidth(CandleStickChartWithFullSmiIndicator);

export default CandleStickChartWithFullSmiIndicator;
