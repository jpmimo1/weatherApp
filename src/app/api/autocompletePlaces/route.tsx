import { AutocompletePlaces, Result } from "@/types";

const API_KEY = '961b7aa4067643588f03a410e3e9dc0f' //TODO: guardar esta variable en un .env

export async function POST(request: Request) {
  const { text } = await request.json();
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=${API_KEY}&format=json`
  ).then(res => res.json()); //TODO: agregar optimizaciones como exclusiones a la url, revalidates, manejo de errores, etc

  const { results } = res as AutocompletePlaces;

  const newResults = results.filter(({ state, city }) => state || city);

  const newResultsWR = newResults.reduce<Result[]>((prev, cR) => {
    const { country: countryC, state: stateC, city: cityC, region: regionC } = cR;
    const prevT = prev as Result[];
    const findIndex = prevT.findIndex(({ country, state, city, region }) => {
      return (
        country === countryC &&
        state === stateC &&
        city === cityC &&
        region === regionC
      );
    });
    if (findIndex !== -1) {
      return prev;
    }

    return [...prev, cR]
  }, []);


  return Response.json({ ...res, results: newResultsWR });
}
