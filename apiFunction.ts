
export async function getCountrySpec(phone: string):Promise<string[]> {
    const API_KEY = Deno.env.get("API_KEY");
    if (!API_KEY) {
        throw new Error("API_KEY not found");
    }
    const url = "https://api.api-ninjas.com/v1/validatephone?number=" + phone;
    const data = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });
  if (data.status !== 200) {
    console.error("Error:", data.status, data.statusText);
    throw new Error("Error en el telefono");
  }
  const response = await data.json()
  if(!response.is_valid){
    throw new Error("Telefono no valido");
  }

  const splited = response.timezones[0].split('/')
  const cosas:string[] = []

  cosas.push(response.country)

  cosas.push(response.format_e164)

  cosas.push(splited[0])

  cosas.push(splited[1])
  return cosas
}

export async function getTime(timezone:string):Promise<string> {
    const API_KEY = Deno.env.get("API_KEY");
    if (!API_KEY) {
        throw new Error("API_KEY not found");
    }
  const url = "https://api.api-ninjas.com/v1/worldtime?timezone=" + timezone;
  const data = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });
  if (data.status !== 200) {
    console.error("Error:", data.status, data.statusText);
    throw new Error("Error");
  }
  const response = await data.json();
  const hour:string = response.hour
  const minute:string = response.minute

  return hour+":"+minute  
} 