const API_KEY = '961b7aa4067643588f03a410e3e9dc0f' //TODO: guardar esta variable en un .env

export async function POST(request: Request) {
  const { lat, lon } = await request.json();
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`
  ).then(res => res.json()); //TODO: agregar optimizaciones como exclusiones a la url, revalidates, manejo de errores, etc

  return Response.json(res);
}
