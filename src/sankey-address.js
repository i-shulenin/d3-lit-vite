document.addEventListener('DOMContentLoaded', async () => {
  const address =
    '0:9adfb81ccdc5cba74d1b90fdde035b71693c17e93cb31ada304ae1e2170a1b9a';

  function sankeyAddressParse(source) {
    const links = [
      ...source.diagram_in.map((item) => ({
        source: address,
        target: `${item.name}_in`,
        value:
          isNaN(parseFloat(item.size)) || parseFloat(item.size) < 1
            ? 1
            : parseFloat(item.size),
      })),
      ...source.diagram_out.map((item) => ({
        source: `${item.name}_out`,
        target: address,
        value:
          isNaN(parseFloat(item.size)) || parseFloat(item.size) < 1
            ? 1
            : parseFloat(item.size),
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

  const sankeyAddressSource = await transfersDataRequest();
  const sankeyAddressData = sankeyAddressParse(
    sankeyAddressSource.addresses_diagram
  );
});
