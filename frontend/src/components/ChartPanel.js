import { useContext, useEffect, useState, memo } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

function ChartPanel({ instrumentKey }) {
  const [candles, setCandles] = useState([]);
  console.log("HELLO");

  function fetchIntradayData() {
    const url = `https://api.upstox.com/v2/historical-candle/intraday/${instrumentKey}/1minute`;
    fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let candleLength = data.data.candles.length;
        let tempArray = [];
        for (let i = candleLength - 1; i >= 0; i--) {
          let tempObj = {};
          tempObj["x"] = new Date(data.data.candles[i][0]);
          let rep = data.data.candles[i].slice(1, 5);
          tempObj["y"] = rep;
          tempArray.push(tempObj);
        }
        console.log(tempArray);
        setCandles(tempArray);
      });
  }

  useEffect(() => {
    fetchIntradayData();
    const timer = setInterval(() => {
      fetchIntradayData();
    }, 60000);
    return clearInterval(timer);
  }, [instrumentKey]);

  let state = {
    series: [
      {
        data: candles,
      },
    ],
    options: {
      chart: {
        type: "candlestick",
        height: "100px",
        animations: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: function (value, timestamp) {
            return new Date(timestamp).toLocaleTimeString(); // The formatter function overrides format property
          },
        },
        tickAmount: 8,
      },
      yaxis: {
        opposite: true,
        labels: {
          style: {
            colors: ["#ddd"],
            fontSize: "13px",
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#444",
        strokeDashArray: 0,
        position: "back",
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        row: {
          colors: undefined,
          opacity: 0.5,
        },
        column: {
          colors: undefined,
          opacity: 0.5,
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  };
  return (
    <Chart
      options={state.options}
      series={state.series}
      type="candlestick"
      height="100%"
      width="100%"
    />
  );
}

export default memo(ChartPanel);
