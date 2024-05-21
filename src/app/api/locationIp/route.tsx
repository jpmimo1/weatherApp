export async function POST(request: Request) {
  const { ip } = await request.json();
  const res = await fetch(
    `http://ip-api.com/json/${ip}`
  ).then(res => res.json()); //TODO: agregar optimizaciones como revalidates, manejo de errores, etc

  return Response.json(res);
}
