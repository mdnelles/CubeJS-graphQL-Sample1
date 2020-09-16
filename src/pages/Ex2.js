import React from "react";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import { Chart, Axis, Tooltip, Geom, Coord, Legend } from "bizcharts";

require('dotenv').config()

const stackedChartData = (resultSet) => {
   const data = resultSet
      .pivot()
      .map(({ xValues, yValuesArray }) =>
         yValuesArray.map(([yValues, m]) => ({
            x: resultSet.axisValuesString(xValues, ", "),
            color: resultSet.axisValuesString(yValues, ", "),
            measure: m && Number.parseFloat(m),
         }))
      )
      .reduce((a, b) => a.concat(b), []);

   return data;
};

const lineRender = ({ resultSet }) => (
   <Chart
      scale={{ x: { tickCount: 8 } }}
      height={400}
      data={stackedChartData(resultSet)}
      forceFit
   >
      <Axis name="x" />
      <Axis name="measure" />
      <Tooltip crosshairs={{ type: "y" }} />
      <Geom type="line" position={`x*measure`} size={2} color="color" />
   </Chart>
);

const API_URL = process.env.REACT_APP_API_URL; // change to your actual endpoint

const cubejsApi = cubejs(process.env.REACT_APP_AK
   ,
   { apiUrl: API_URL + "/cubejs-api/v1" }
);

const renderChart = (Component, pivotConfig) => ({ resultSet, error }) =>
   (resultSet && (
      <Component resultSet={resultSet} pivotConfig={pivotConfig} />
   )) ||
   (error && error.toString()) || <Spin />;

export const Ex2 = () => (
   <QueryRenderer
      query={{
         "dimensions": [],
         "timeDimensions": [
            {
               "dimension": "BalanceSheetMeasures.apEndDate",
               "granularity": "day",
            },
         ],
         "measures": ["BalanceSheetMeasures.equity"],
         "order": {},
         "filters": [],
      }}
      cubejsApi={cubejsApi}
      render={renderChart(lineRender, {
         "x": ["BalanceSheetMeasures.apEndDate.day"],
         "y": ["measures"],
         "fillMissingDates": true,
         "joinDateRange": false,
      })}
   />
);
