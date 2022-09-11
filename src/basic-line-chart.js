document.addEventListener('DOMContentLoaded', async () => {
  const margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 60,
  };
  const width = 783 - margin.left - margin.right;
  const height = 245 - margin.top - margin.bottom;

  const svg = d3
    .select('#basic-line-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('background', '#F0F4F7')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  const balanceDynamicSource = await fetch('/data/balance_dynamic.json').then(
    (result) => result.json()
  );
  const data = balanceDynamicSource.balance_dynamic
    .map((d) => ({
      date: d3.timeParse('%Y-%m-%d')(d.date),
      value: d.USDT,
    }))
    .reduce((a, c, i, d) => {
      if (i === 0) {
        return [...a, c];
      } else {
        const p = d[i - 1];

        return [...a, { date: c.date, value: p.value }, c];
      }
    }, []);

  const x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.value;
      }),
    ])
    .range([height, 0]);
  svg.append('g').call(d3.axisLeft(y));

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#A6AFBD')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        })
    );
});
