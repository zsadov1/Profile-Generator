const fs = require("fs");
const util = require('util');
const inquirer = require("inquirer");
const axios = require("axios");
const puppeteer = require('puppeteer');


const asyncFileWrite = util.promisify(fs.writeFile);


// Prompt user for Github name and favorite color out of the colors listedno.

function userPrompt()  {
    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "What is your Github Username?"
        },
        {
            type: "list",
            name: "color",
            message: "What is your favorite color below?",
            choices: [
                "Yellow",
                "Orange",
                "Red",
                "Green",
                "Pink",
                "Teal"
            ]
        }
    ]);
}


function htmlProfile (userData, gitData, starsData) {
    // Generating user github data 
    return `
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${gitData.name}</title>
    <link re="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"/>
    <style>
    body {
        background-color: ${userData.color};
        color: black;
      }
      
      h3 {
        color: #333;
      }
      
      .header-position {
        position: relative;
        top: 60px;
        border-radius: 6px;
        padding: 20px;
        padding-top: 0;
      }
      
      .header-position img {
        position: relative;
        top: -40px;
        border-radius: 50%;
        border: 9px solid #fff;
      }
      
      
      .data-card {
        margin: 30px;
        padding: 20px;
        border-radius: 6px;
      }
      
      #boxOne {
        display: flex;
        flex-direction: row;
        justify-content: start;
      }
      
      #boxTwo {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      
      #boxThree {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      
      #boxFour {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      
      #boxFive {
        display: flex;
        flex-direction: row;
        justify-content: end;
      }

    </style>
    </head>


    <body>

    <header>
        <div class="container">
                <img src="${gitData.data.avatar_url}"/>
                <h1 class="jumbo">${gitData.data.name}</h1>
                <a href="https://www.google.com/maps/place/${gitData.data.location}">${gitData.data.location}</a>
                <a href="${gitData.data.html_url}">GitHub Profile</a>
                </p>
            </div>
        </div>
    </header>
    
    <!-- Container below contains github repo stats -->
    
    
        <div class="container">
    
            <div class="row" id="boxOne">
                <div class="col text-center">
                <h4>${gitData.data.bio}</h4>
                </div>
            </div>
    
        <div class="row" id="boxTwo">
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h4 class="card-title">
                        <a>Public Repos:</a>
                        </h4>
                        <p>${gitData.data.public_repos}</p>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="row" id="boxThree">
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h4 class="card-title">
                        <a>Followers</a>
                        </h4>
                        <p>${gitData.data.followers}</p>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="row" id="boxFour">
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h4 class="card-title">
                    <a>Following:</a>
                    </h4>
                    <p>${gitData.data.following}</p>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="row" id="boxFive">
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                    <h4 class="card-title">
                    <a>Stars:</a>
                    </h4>
                    <p>${starsData.data.length}</p>
                    </div>
                </div>
            </div>
        </div>
    
        </div>
    
    
    </body>
    </html>
`;
}

async function init() {

    try {
        const userData = await userPrompt();
        const gitData = await axios.get(
            `https://api.github.com/users/${userData.username}`
        );

        const starsData = await axios.get(`https://api.github.com/users/${gitData.username}/starred`);

        const html = htmlProfile(userData, gitData, starsData);

        await asyncFileWrite(`profile_${userData.username}.html` , html);
        console.log(`Successfully wrote profile_${userData.username}.html`);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);
        await page.emulateMediaFeatures("screen");
    
        await page.pdf({
        path: `profile_${userData.username}.pdf`,
        format: "A4",
        printBackground : true
    });

    console.log(`Successfully wrote profile_${userData.username}.pdf`);
    await browser.close();
    process.exit();
 } catch (err) {
    console.log(err);
    }
}

init();
