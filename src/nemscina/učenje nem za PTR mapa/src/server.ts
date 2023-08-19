export async function makeRequest(
url: string,
method: string,
formData: FormData | string = new FormData()) 

{
let headers = {"Authorization": localStorage.getItem("key")};
let response = await fetch(
`https://nem-dev.beziapp.si${url}`,

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
/*
let fd = new FormData();
fd.append(spremenljivka, "vrednostspremenljivke"); 
let f = await makeRequest("/moj/url", "POST", fd);
*/