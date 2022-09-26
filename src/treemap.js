document.addEventListener('DOMContentLoaded', async () => {
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = 445 - margin.left - margin.right;
  const height = 445 - margin.top - margin.bottom;

  const svg = d3
    .select('#treemap')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const treemapDataResponse = await diagramDataRequest();

  console.log(treemapDataResponse);

  d3.json(
    'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json',
    function (data) {
      const root = d3.hierarchy(data).sum(function (d) {
        return d.value;
      });

      console.log(root);
    }
  );
});
