const apiKey= "fa7d8544b472293402a15429257396ed";
var userCity = ""; //the user's input city preference
var latlong = "http://api.openweathermap.org/geo/1.0/direct?q=" + userCity +"&limit=5&appid=" + apiKey; //the link that accepts city input to give lat and long values.
var lat = ""  //this brings the lat from latlong link
var long= ""  //this brings the long from latlong link, and we can sub to the weather url
var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid="+apiKey; //all the elements will create the link with the right weather
          


var searchBtn = document.querySelector("#search")
    

searchBtn.addEventListener('click', function(){
    var cityInput = document.querySelector("#input");
    var userCity =cityInput.value; //the user's input city preference
    fetch_weather(userCity);
}) 


function fetch_weather (userCity){

    //this section makes sure that when the user clicks a saved button then the data inside these divs are cleared out.
    var present = document.querySelector('#present');
    var forecast_container = document.querySelector('#fivedays');
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
        var remakeData = fetch_weather(event.target.textContent);

        localStorage.setItem(userCity,remakeData.value);


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
         
    }
    )
    
    //.............
    .then(function(){
        return fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid="+apiKey+"&units=imperial")
     })
     .then(function(res){
         return res.json();
     })
 
     .then(function(data){
         console.log(data);
        var nameCity = document.querySelector('.nameCity');
        var present = document.querySelector('#present');
        var currentlist = document.createElement('ul');


        
        if ( (0 <=data.clouds.all) && (data.clouds.all <= 45)){
            nameCity.textContent= userCity+ " ☀️";
            
            }
            else{
            nameCity.textContent= userCity+ " ☁️";
            
            }


        
        

        var currentemp = data.main.temp;
        var currentwind = data.wind.speed;
        var currenthum = data.main.humidity;

        var currentarray = ["Temperature: "+currentemp+"°F","Wind:"+currentwind+" MPH", "Humidity: " + currenthum+" %"];

        for (y = 0; y < currentarray.length; ++y) {
                
            var currectsect = document.createElement('li'); //create a header for each day

            currectsect.textContent = currentarray[y];     
            
            
            currentlist.append(currectsect);
            
            }
            
            present.append(currentlist);

     })

     
    //................
    .then(function(){
       return fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid="+apiKey+"&units=imperial")
    })
    .then(function(res){
        return res.json();
    })

    .then(function(data){
        console.log(data);

        var forecast = data.list;

        for (let index = 0; index < forecast.length; index++) {
            
            if(forecast[index].dt_txt.includes("00:00:00")){
                console.log(forecast[index]);
                
                
                var forecast_container = document.querySelector('#fivedays'); //call the variable that we are going to place all these elements we've created
                var card = document.createElement('ul')
                var header = document.createElement('h4');
                var icon = document.createElement('h5');

                header.textContent = forecast[index].dt_txt;
                card.append(header);

                if ( (0 <=forecast[index].clouds.all) && (forecast[index].clouds.all <= 45)){
                icon.textContent = "☀️"
                card.append(icon);
                }
                else{
                icon.textContent = "☁️";
                card.append(icon);
                }


                var daystemp = forecast[index].main.temp;
                var daywind = forecast[index].wind.speed;
                var dayhum = forecast[index].main.humidity;

                var array = ["Temperature: "+daystemp +"°F", "Wind: " +daywind + " MPH ", "Humidity: "+ dayhum+ " %"];

                for (i = 0; i < array.length; ++i) {
                
                var section = document.createElement('li'); //create a header for each day

                
                section.textContent = array[i];

                card.append(section);
                
                }
                
                forecast_container.append(card);
                
            }
            
        }



    })

}