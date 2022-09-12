document.addEventListener('DOMContentLoaded', async () => {
  const address =
    '0:9adfb81ccdc5cba74d1b90fdde035b71693c17e93cb31ada304ae1e2170a1b9a';
  color = '#dddddd';

  function sankeyAddressParse(source) {
    const links = [
      ...source.diagram_in.map((item) => ({
        source: address,
        target: `${item.name}_in`,
        value:
          isNaN(parseFloat(item.size)) || parseFloat(item.size) < 1
            ? 1
            : parseFloat(item.size),
        color,
      })),
      ...source.diagram_out.map((item) => ({
        source: `${item.name}_out`,
        target: address,
        value:
          isNaN(parseFloat(item.size)) || parseFloat(item.size) < 1
            ? 1
            : parseFloat(item.size),
        color,
      })),
    ];

    const nodeByName = new Map();

    for (const link of links) {
      if (!nodeByName.has(link.source)) {
        nodeByName.set(link.source, { name: link.source });
      }
      if (!nodeByName.has(link.target)) {
        nodeByName.set(link.target, { name: link.target });
      }
    }

    return { nodes: Array.from(nodeByName.values()), links };
  }

  const sankeyAddressResponse = await transfersDataRequest();
  const sankeyAddressData = sankeyAddressParse(
    sankeyAddressResponse.addresses_diagram
  );

  console.log(sankeyAddressData);

  const margin = { top: 10, right: 100, bottom: 10, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 360 - margin.top - margin.bottom;
});
