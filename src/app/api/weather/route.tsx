const API_KEY = 'c54d895e7fc50bf5cbfd09ddec810448' //TODO: guardar esta variable en un .env

export async function POST(request: Request) {
  const { lat, lon } = await request.json();
  const res = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  ).then(res => res.json()); //TODO: agregar optimizaciones como exclusiones a la url, revalidates, manejo de errores, etc

  return Response.json(res);
}
