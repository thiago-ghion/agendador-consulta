let URL_API;

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  URL_API = "http://localhost:5000";
} else {
  URL_API = "https://api-agendador-consulta.herokuapp.com";
}

export { URL_API };
