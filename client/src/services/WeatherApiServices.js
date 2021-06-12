const base_url = "http://localhost:3001";

exports.getWeather = async (city = {}) => {
  try {
    const JSONweather = await fetch(`${base_url}/weather`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(city),
    });
    const weather = await JSONweather.json();
    return weather;
  } catch (err) {
    return err;
  }
};