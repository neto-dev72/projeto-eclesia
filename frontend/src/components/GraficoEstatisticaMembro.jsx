import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#AA336A', '#9933FF', '#33CCFF', '#FF3399'
];

export default function GraficoEstatisticaMembro({ dados, campo }) {
  // Quando o campo for "departamentos", usamos 'nome' em vez de 'valor'
  const dadosFormatados = dados.map(d => ({
    name:
      campo === 'departamentos'
        ? d.nome || 'N/A'           // ✅ Nome do departamento
        : d.valor?.toString() || 'N/A',
    value: d.total
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={dadosFormatados}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {dadosFormatados.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
