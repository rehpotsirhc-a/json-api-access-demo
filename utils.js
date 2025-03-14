let utils = {}; //create a namespace for our utility functions

//get function to make an HTTP GET request
utils.get = (url) => {

    //start promise object
    return new Promise(function (resolve, reject) {

        //create a new XMLHttpRequest object
        let request = new XMLHttpRequest();

        //initialize the request
        request.open('GET', url);

        request.onload = function () {
            //resolve on success
            if (request.status == 200) { // HTTP: OK
                console.log('Response OK');
                resolve(request.response);
            }
            //reject on error
            else {
                reject(Error(`promise error with ${request.status}`))
            }
        };
        //handle network errors
        request.onerror = function (error) {
            reject(Error(`Network Error with ${url}: ${error}`))
        };
        //send the request
        request.send();
    }); //end Promise Object
}

//getJSON function to get JSON data from the server
utils.getJSON = async function (url) {
    let string = null;
    //get the JSON string from the server
    try {
        string = await utils.get(url);
    }
    catch (error) {
        console.log(error)
    }
    //parse the JSON string and return the data
    let data = JSON.parse(string);
    return data;
}

async function init() {
    //get the root element of the web page
    let root = document.querySelector('#root');

    //create a variable to hold the URL of the JSON data source
    let url = 'https://eecu-data-server.vercel.app/data/2024';

    //create a variable to hold the JSON data
    let occupations = null; 

    //try to retrieve the JSON data from the server
    try {
        //retrieve the JSON data from the server
        occupations = await utils.getJSON(url);
    }
    //catch any errors and display them in the root element
    catch(error){
        root.style.color = 'red';
        root.textContent = `error: ${error}`;
    }

    //show JSON data on the html page
    root.innerHTML = buildList(occupations);

    function buildList(jobs) {
        //create an empty string to hold the HTML
        let html = '<select>';

        //loop through the array of job objects retrieved from the JSON data
        for (let job of jobs) {
            //create an option for each job
            html += `<option value="${job.salary}">${job.occupation}</option>`;
        }

        //close the select element
        html += '</select>';
        html += '<div id="salaryDisplay"></div>';

        // Add event listener to the <select> element
        const selectElement = document.querySelector('select');
        selectElement.addEventListener('change', function(event) {
            // Log the selected occupation's salary to the console
            console.log(`Selected Salary: ${event.target.value}`);
        });

        //return the HTML string
        return html;
    }
}

//initialize the web page when the DOM is ready
document.addEventListener('DOMContentLoaded', init);