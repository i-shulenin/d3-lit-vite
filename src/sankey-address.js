document.addEventListener('DOMContentLoaded', async () => {
  const address =
    '0:9adfb81ccdc5cba74d1b90fdde035b71693c17e93cb31ada304ae1e2170a1b9a';

  function sankeyAddressParse(source) {
    const nodes = [
      address,
      ...source.diagram_in.map((item) => `${item.name}_in`),
      ...source.diagram_out.map((item) => `${item.name}_out`),
    ].map((name, index) => ({ node: index, name }));

    const links = [
      ...source.diagram_in.map((item) => ({
        source: 0,
        target: nodes.find((address) => address.name == `${item.name}_in`).node,
        value:
          isNaN(parseFloat(item.size)) || parseFloat(item.size) < 1
            ? 1
            : parseFloat(item.size),
      })),
      ...source.diagram_out.map((item) => ({
        source: nodes.find((address) => address.name == `${item.name}_out`)
          .node,
        target: 0,
        value:
          isNaN(parseFloat(item.size)) || parseFloat(item.size) < 1
            ? 1
            : parseFloat(item.size),
      })),
    ];

    return {
      nodes,
      links,
    };
  }

  const sankeyAddressResponse = await transfersDataRequest();
  const sankeyAddressData = sankeyAddressParse(
    sankeyAddressResponse.addresses_diagram
  );

  console.log(sankeyAddressData);

  const margin = { top: 10, right: 150, bottom: 10, left: 150 };
  const width = 800 - margin.left - margin.right;
  const height = 160 - margin.top - margin.bottom;

  const sankeyAddressSvg = d3
    .select('#sankey-address')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const color = d3.scaleOrdinal(d3.schemeCategory20);

  const sankeyAddress = d3
    .sankey()
    .size([width, height])
    .nodes(sankeyAddressData.nodes)
    .links(sankeyAddressData.links)
    .nodeWidth(36)
    .nodePadding(20)
    .layout(1);

  sankeyAddressSvg
    .append('g')
    .selectAll('.link')
    .data(sankeyAddressData.links)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', sankeyAddress.link())
    .style('stroke-width', function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return b.dy - a.dy;
    });

  const sankeyAddressNode = sankeyAddressSvg
    .append('g')
    .selectAll('.node')
    .data(sankeyAddressData.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  sankeyAddressNode
    .append('rect')
    .attr('height', function (d) {
      return d.dy;
    })
    .attr('width', sankeyAddress.nodeWidth())
    .style('fill', function (d) {
      return (d.color = color(d.name.replace(/ .*/, '')));
    })
    .style('stroke', function (d) {
      return d3.rgb(d.color).darker(2);
    });

  sankeyAddressNode
    .append('text')
    .attr('class', 'value')
    .filter((d) => d.node !== 0)
    .attr('x', 42)
    .attr('y', function (d) {
      return d.dy / 2;
    })
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .attr('transform', null)
    .text(function (d) {
      const source = d.name.split('_')[0];
      const name =
        source.substring(0, 3) === '-1:' || source.substring(0, 2) === '0:'
          ? `${source.substring(
              0,
              source.indexOf(':') + 6
            )}...${source.substring(source.length - 5)}`
          : source;

      return name;
    })
    .filter(function (d) {
      return d.x < width / 2;
    })
    .attr('x', 30 - sankeyAddress.nodeWidth())
    .attr('text-anchor', 'end');

  sankeyAddressNode
    .append('text')
    .attr('class', 'value')
    .filter((d) => d.node !== 0)
    .attr('x', 120)
    .attr('y', function (d) {
      return d.dy / 2;
    })
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .attr('transform', null)
    .text(function (d) {
      const source = d.name.split('_');
      const direction = source[1];
      const name = source[0];
      const size = sankeyAddressResponse.addresses_diagram[
        `diagram_${direction}`
      ].find((item) => item.name === name).size;

      return isNaN(size)
        ? `${(0).toFixed(2)}%`
        : `${parseFloat(size).toFixed(2)}%`;
    })
    .filter(function (d) {
      return d.x < width / 2;
    })
    .attr('x', 0 - (sankeyAddress.nodeWidth() + 50))
    .attr('text-anchor', 'end');
});
