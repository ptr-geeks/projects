// Telo POST/PATCH/DELETE, ne pa GET zahtevka mora biti enkodirano
// s FormData. V JavaScriptu se to naredi nekako tako:

/*
let fd = new FormData();
fd.append(”spremenljivka”, ”vrednostspremenljivke”);

let f = await fetch("https://nem−dev.beziapp.si/moj/url",
{
body: fd,
method: "POST",
headers: {”Header1”: ”header1value”}
});
*/

// pri čemer upoštevamo, da je zahtevek definiran kot tak:

/*
POST /moj/url
Header1: header1value
{”spremenljivka”: ”vrednostspremenljivke”}
*/

//  Kodo, uporabljeno za pošiljanje zahtevkov v JavaScriptu lahko ukradeš kar
// iz BežiApp-a z manjšimi prilagoditvami:

export async function makeRequest(
url: string,
method: string = "GET",
formData: FormData | string = new FormData()) 


{
let headers = {"Authorization": localStorage.getItem("key")};
let response = await fetch(
`https://nem−dev.beziapp.si${url}`,

{ 
method: method,
body: (method === "GET") ? null : formData,
headers: headers,
});

if ((response.status < 200 || response.status >= 300)) {
throw Error("Error␣while␣fetching␣the␣requested␣URL");
}

return await response.json();
}

// Z uporabo zgornje kode lahko dobimo malo bolj preprosto zadevo:

let fd = new FormData();
fd.append(spremenljivka, "vrednostspremenljivke"); 
let f = await makeRequest(
"/moj/url",
"POST", // ali se to spreminja ?????????
fd
);

// Za vse headerje (Authorization) vedno poskrbi makeRequest(), tako da ti o
// njih ni potrebno razmišljati.