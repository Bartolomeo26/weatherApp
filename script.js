const citySearch = document.querySelector('#citySearch');
const clouds = document.querySelector('#clouds');
const temperature = document.querySelector('#temp');
const cityName = document.querySelector('#cityName');
const pressure = document.querySelector('#pressure');
const humidity = document.querySelector('#humidity');
const date = document.querySelector('#date');

citySearch.addEventListener('submit', async function (e)
{
    e.preventDefault();
    const anyFigure = document.querySelector('figure');
    clouds.innerHTML = '';
    clouds.nextElementSibling.innerHTML = '';
    temperature.innerHTML = '';
    cityName.innerHTML = '';
    pressure.innerHTML = '';
    humidity.innerHTML = '';
    date.innerHTML = '';
    if (!anyFigure.classList.contains('is-hidden'))
    {
        classHidden();
    }
    const dateObject = new Date();
    let todayDate = dateObject.toUTCString();
    const p = document.createElement('p');
    p.innerHTML = todayDate.slice(0, 11);
    p.classList.add('subtitle', 'is-size-4');

    const city = this.elements.city.value;
    const appid = 'acea379140b11445dc78568635ba06c7'
    const apiTime = 'lwgoIhKvdFurykjI6U1GwQ==k4gTlzYK3P6xNBMQ';
    const config = { params: { q: city, APPID: appid, units: 'metric' } }
    const configTime = { params: { city: city }, headers: { 'X-Api-Key': apiTime } }
    const dataTime = await getData('https://api.api-ninjas.com/v1/worldtime', configTime);
    const data = await getData('https://api.openweathermap.org/data/2.5/weather', config);
    console.log(data);
    console.log(dataTime);
    if (data)
    {

        changeCity(data, dataTime);
        classHidden();
        date.append(p);

    }
    else console.log("No such city.");
    this.elements.city.value = '';
})

const getData = async (url, cfg) =>
{
    try
    {
        const res = await axios.get(url, cfg);
        return res.data;
    }
    catch (e)
    {
        console.log(e);
    }
}
function changeCity(data, dataTime)
{
    weatherProperty(temperature, data, dataTime);
    weatherProperty(cityName, data, dataTime);
    weatherProperty(clouds, data, dataTime);
    weatherProperty(pressure, data, dataTime);
    weatherProperty(humidity, data, dataTime);
}
function weatherProperty(type, data, dataTime)
{
    const p = document.createElement('p');
    if (type === temperature)
    { p.innerHTML = `${data.main.temp} ℃`; p.classList.add('is-size-2'); }
    else if (type === cityName)
    { p.innerHTML = `${data.name}, ${data.sys.country}`; p.classList.add('is-size-3'); }
    else if (type === clouds)
    {
        const img = document.createElement('img');
        img.src = weatherIcon(data, dataTime);
        img.classList.add('has-image-centered');
        type.append(img);
        p.innerHTML = `${data.weather[0].main} - ${data.weather[0].description}`;

        type.nextElementSibling.innerHTML = `${data.weather[0].main} - ${data.weather[0].description}`;
        return;
    }
    else if (type === pressure)
    { type.innerHTML = '<p class="subtitle mb-1">Pressure</p>'; p.innerHTML = `${data.main.pressure} HPa`; }
    else if (type === humidity)
    { type.innerHTML = '<p class="subtitle mb-1">Humidity</p>'; p.innerHTML = `${data.main.humidity} %`; }
    p.classList.add('subtitle')
    type.append(p);
}
function weatherIcon(data, dataTime)
{
    let hr = parseInt(dataTime.hour);
    if (data.weather[0].description === 'clear sky')
    {
        if (hr >= 22 && hr <= 24 || hr >= 0 && hr <= 5)
        { document.body.style.backgroundImage = 'url(icons/starfall-gif-51.gif)'; return 'icons/moon.png'; }
        else
        { document.body.style.backgroundImage = 'url(icons/sunnyW.jpg)'; return 'icons/sun.png'; }
    }
    else if (data.weather[0].main === 'Thunderstorm')
    { document.body.style.backgroundImage = 'url(icons/thunderGif.gif)'; return 'icons/storm.png'; }
    else if (data.weather[0].description === 'few clouds')
        return 'icons/sunAndClouds.png'
    else if (data.weather[0].main === 'Clouds')
    { document.body.style.backgroundImage = 'url(icons/clouds.png)'; return 'icons/cloud.png'; }
    else if (data.weather[0].main === 'Snow')
    { document.body.style.backgroundImage = 'url(icons/snowing.gif)'; return 'icons/snow.png' }
    else if (data.weather[0].main === 'Rain')
    { document.body.style.backgroundImage = 'url(icons/rain.gif)'; return 'icons/raining.png' }
    else if (data.weather[0].main === 'Drizzle')
    { document.body.style.backgroundImage = 'url(icons/drizzle.jpg)'; return 'icons/weather.png' }
    else
    { document.body.style.backgroundImage = 'url(icons/mist.jpg)'; return 'icons/fog.png' }
}

function classHidden()
{
    const figures = document.querySelectorAll('figure');
    for (let figure of figures)
    {
        figure.classList.toggle('is-hidden');
    }
}