import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import './SoundChart.scss';
import moment from "moment";

function SoundChart(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      props.data.map(item => ({
          "decibel": item.value, 
          "xValue": new Date(item.datetime).getTime()
        })
      )
    )
  }, [props])

  function formatXAxis(value) {
    return moment(value).format("DD-MM HH:mm")
  }

  return (
    <ResponsiveContainer width='100%' height={400}>
      <ScatterChart
        className='chart'
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid stroke="#5e5e5e" strokeDasharray="3 3" />
        <XAxis padding={{ left: 30, right: 30 }} type="number" dataKey="xValue" name="Tempo" stroke="black" domain={["auto", "auto"]} tickFormatter={formatXAxis}/>
        <YAxis padding={{ top: 30, bottom: 30 }} type="number" dataKey="decibel" name="Rumore" unit="db" stroke="black" domain={["auto", "auto"]} />
        <Scatter type="monotone" dataKey="decibel" stroke="blue"  fill="#0d6efd"  strokeWidth={3}  lineJointType='monotoneX' line />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export {SoundChart};
