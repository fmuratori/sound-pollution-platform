import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import "./Barchart.scss";

function renderCustomAxisTick(x, period) {
  var date = moment(x)
  switch (period) {
    case 'day':
      return moment(x).format('DD-MM-YYYY');
    case 'week':
      return 'W' + date.isoWeek() + '-' + date.year();
    case 'month':
      return moment(x).format('MM-YYYY');
    case 'quarter':
      return 'Q' + date.quarter() + '-' + date.year();
    default:
      return 'Error';
  }
}

function Barchart(props) {
  const [data, setData] = useState([])

  useEffect(() => {
    if (props.data !== null) {
      setData(props.data)
    }
  }, [props.data])

  return (
    <ResponsiveContainer width='90%' height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis name='Data' dataKey='date' tickFormatter={(x, y, payload) => renderCustomAxisTick(x, props.period)}  stroke='black' tick={{ fill: 'black' }} tickLine={{ stroke: 'black' }}/>
        <YAxis  stroke='black' tick={{ fill: 'black' }} tickLine={{ stroke: 'black' }} />
        <Tooltip content={props.customTooltip} />
        <Legend />
        {
          props.columns.map((c, index) => {
            return <Bar key={index} name={c.label} dataKey={c.dataKey} stackId='a' fill={c.color} />
          })
        }
      </BarChart>
    </ResponsiveContainer>
);
}

// CUSTOM TOOLTIPS

// Tooltip used in Warnings view
function WarningsBarchartTooltip({ payload, label, active, period }) {
  
  if (active) {
    return (
      <div className='my-tooltip m-0 p-0'>
      <p className='text-center p-2 m-0'>{`${renderCustomAxisTick(label, period)}`}</p>
      <hr className='m-0 p-0'/>
      <p className='p-2 m-0'>Fermi: {`${payload[0].value}`}</p>
      <p className='p-2 m-0'>Altri guasti: {`${payload[1].value}`}</p>
      <hr className='m-0 p-0'/>
      <p className='p-2 m-0'>Guasti: {parseInt(payload[0].value) + parseInt(payload[1].value)}</p>
      </div>
    );
  }

  return null;
}

// Tooltip used in Maintenance view
function MaintenanceBarchartTooltip({ payload, label, active, period }) {
  
  if (active) {
    return (
      <div className='my-tooltip m-0 p-0'>
      <p className='label text-center p-2 m-0'>{`${renderCustomAxisTick(label, period)}`}</p>
      <hr className='m-0 p-0'/>
      <p className='label p-2 m-0'>Guasti: {`${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
}

export {Barchart, WarningsBarchartTooltip, MaintenanceBarchartTooltip};
