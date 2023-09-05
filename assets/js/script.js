const apiKey= "fa7d8544b472293402a15429257396ed"; //API key from OpenWeather
var userCity = ""; //the user's input city preference
var latlong = "http://api.openweathermap.org/geo/1.0/direct?q=" + userCity +"&limit=5&appid=" + apiKey; //the link that accepts city input to give lat and long values.
var lat = ""  //this brings the lat from latlong link
var long= ""  //this brings the long from latlong link, and we can sub to the weather url
var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid="+apiKey; //all the elements will create the link with the right weather
          

//call elements from html
var searchBtn = document.querySelector("#search")
    
//the button search will do the following after click
searchBtn.addEventListener('click', function(){
    var cityInput = document.querySelector("#input");
    var userCity =cityInput.value; //the user's input city preference
    fetch_weather(userCity); //call on the function fetch_weather
    localStorage.setItem(userCity,fetch); //stores the value
}) 

//function that makes the present and future weather
function fetch_weather (userCity){

    //call elements from html
    var present = document.querySelector('#present');
    var forecast_container = document.querySelector('#fivedays');

    //this section makes sure that when the user clicks a saved button then the data inside these divs are cleared out.
    forecast_container.innerHTML="";
    present.innerHTML="";

    var latlong = "http://api.openweathermap.org/geo/1.0/direct?q=" + userCity +"&limit=5&appid=" + apiKey;//the link that accepts city input to give lat and long values.
    var lat = ""  //this brings the lat from latlong link
    var long= ""  //this brings the long from latlong link, and we can sub to the weather url
    
    var otherBtn = document.createElement('button'); //create a button
    var btnOptions = document.querySelector('#btnOptions');//this calls the elements of the buttons
    otherBtn.textContent = userCity; // the text of the buttons is the input of the City

    //then when it clicks the saved city buttons it will call fetch_weather function again, restaring the data
    btnOptions.append(otherBtn);
    otherBtn.addEventListener('click', function(event){
        fetch_weather(event.target.textContent);
    })

    //helps see the information on the console
    console.log(userCity);
    console.log(latlong);

    //fetch the latlong url
    fetch(latlong)
    .then(function(res){
        return res.json();
    })
    
    .then(function(data){
        //Gets the lat data and the long data from the latlong url
       lat= data[0].lat;
       long = data[0].lon;
       console.log(data);
    })
    
    //............. CURRENT WEATHER
    .then(function(){
        return fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid="+apiKey+"&units=imperial") //fetch the current (present) weather link
     })
     .then(function(res){
         return res.json();
     })
 
     .then(function(data){
         console.log(data);

        //call elements from html as well as create elements
        var nameCity = document.querySelector('.nameCity');
        var present = document.querySelector('#present');
        var currentlist = document.createElement('ul');

        //obtain the todays date
        var now = dayjs().format("YYYY-MM-DD");

        //determines if the weather is sunny or cloudy and displays it as well as displays the date
        if ( (0 <=data.clouds.all) && (data.clouds.all <= 45)){
            nameCity.textContent= userCity+ " "+now + " ☀️";
            
        }
        else{
            nameCity.textContent= userCity+ " "+now +" ☁️";
            
        }

        //from the link data, it picks the data for each cathegory
        var currentemp = data.main.temp;
        var currentwind = data.wind.speed;
        var currenthum = data.main.humidity;
        
        //then creates an array
        var currentarray = ["Temperature: "+currentemp+"°F","Wind:"+currentwind+" MPH", "Humidity: " + currenthum+" %"];

        //then a for loop that will go through each and create a list for the current day
        for (y = 0; y < currentarray.length; ++y) {
                
            var currectsect = document.createElement('li'); //create a list

            currectsect.textContent = currentarray[y];           
            
            currentlist.append(currectsect);
            
        }
            
        present.append(currentlist); //then it places the list inside the div

    })

     
    //................ 5-DAY FORECAST
    .then(function(){
       return fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid="+apiKey+"&units=imperial")//URL for the 5 Day / 3 Hour Forecast, as well as changing the units
    })
    .then(function(res){
        return res.json();
    })

    .then(function(data){
        console.log(data);

        var forecast = data.list; //gets the data from the array called list, that contains all the 5 Day / 3 Hour Forecast

        // the for lopp will go through all elements inside the array
        for (let index = 0; index < forecast.length; index++) {
            
            //if the element contains "00:00:00" that indicates the start or begining of a day, then do the following
            if(forecast[index].dt_txt.includes("00:00:00")){
                console.log(forecast[index]);
                
                //it calls the elements from the html as well as create elements
                var forecast_container = document.querySelector('#fivedays'); 
                var card = document.createElement('ul')
                var header = document.createElement('h4');
                var icon = document.createElement('h5');
                
                
                //It displays the date of the future 5 days
                var parts= forecast[index].dt_txt.split(' ');
                header.textContent = parts[0];
                card.append(header);
                
                //it displays and append the icon if the weather is sunny or cloudy.
                if ( (0 <=forecast[index].clouds.all) && (forecast[index].clouds.all <= 45)){
                icon.textContent = "☀️"
                card.append(icon);
                }
                else{
                icon.textContent = "☁️";
                card.append(icon);
                }

                //from the variable forecast, it picks the data for each cathegory, temperature, wind and humidity.
                var daystemp = forecast[index].main.temp;
                var daywind = forecast[index].wind.speed;
                var dayhum = forecast[index].main.humidity;

                //it then arranges it into an array
                var array = ["Temperature: "+daystemp +"°F", "Wind: " +daywind + " MPH ", "Humidity: "+ dayhum+ " %"];

                //the loop will create the elements in the array into a list form, each day will contain the elements of the array.
                for (i = 0; i < array.length; ++i) {
                
                var section = document.createElement('li'); //create a header for each day

                section.textContent = array[i];

                card.append(section);
                
                }
                
                //then the list inside the <ul> will be appended to the div in the html
                forecast_container.append(card);
                
            
            }
            
        }

    })

}