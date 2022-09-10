document.addEventListener('DOMContentLoaded', async () => {
  const sankeyAddressSource = await fetch('/data/addresses_diagram.json').then(
    (result) => result.json()
  );

  console.log(sankeyAddressSource);
});
