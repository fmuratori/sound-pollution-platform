import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import "./Piechart.scss";

// const COLOR_MAP = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const COLOR_MAP = ['#ac92eb', '#4fc1e8', '#a0d568', '#FFce54', '#ed5564'];
const RADIAN = Math.PI / 180;

function Piechart(props) {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data])

  function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill='black' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
      <ResponsiveContainer width='90%' height={275}>
        <PieChart>
          <Pie data={data}
          dataKey='value'
          isAnimationActive={true}
          nameKey='name'
          cx='50%'
          cy='50%'
          outerRadius={100}
          labelLine={false}
          label={renderCustomizedLabel}>
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLOR_MAP[index % COLOR_MAP.length]} />
              ))
            }
          </Pie>
          <Tooltip content={props.customTooltip}/>
          {
            props.legend === 'vertical' ? 
              <Legend layout="vertical" verticalAlign="middle" align="right" iconType='circle'/>
            : props.legend === 'horizontal' ?
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType='circle'/>
            : null
          }

        </PieChart>
      </ResponsiveContainer>
  );
}

// CUSTOM TOOLTIPS

//Tooltip used in Jobs view
const ConsumptionPiechartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="my-tooltip p-2">
        <p className="m-0 p-0">{`Consumi : ${payload[0].value} kWh`}</p>
      </div>
    );
  }

  return null;
};

export {Piechart, ConsumptionPiechartTooltip};
