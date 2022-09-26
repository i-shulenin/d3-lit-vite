async function diagramDataRequest() {
  const response = await fetch('/data/diagram_data.json').catch((error) => {
    console.log(
      '%c*** error ***',
      'background: #FF0000; color: #FFFFFF; font-weight: bold;'
    );
    console.log(error);
    window.alert('Произошла ошибка загрузки данных');
  });

  return response.json();
}
