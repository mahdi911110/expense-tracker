import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './ExpenseChart.css';

export function ExpenseChart({ list, isPersian }) {
  const chartData = Object.values(
    list.reduce((acc, item) => {
      const keyword = item.keyWord;
  
      if (!acc[keyword]) {
        acc[keyword] = {
          name: keyword,
          value: 0
        };
      }
  
      acc[keyword].value += item.priceCents;
  
      return acc;
    }, {})
  );
  if (chartData.length === 0) {
    return (
      <div className='chart-empty-title'>
        {isPersian ? 'هنوز چیزی اضافه نشده' : 'Nothing Added yet'}
      </div>
    );
  }
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label>
        {chartData.map((entry, index) => {
          const hue = (index * 137.5) % 360;

          return (
            <Cell
              key={`cell-${index}`}
              fill={`hsl(${hue}, 70%, 60%)`}
            />
          );
        })}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  );
}
