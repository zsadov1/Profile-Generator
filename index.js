const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const puppeteer = require('puppeteer');
const util = require('util');
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
            name: "username",
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

userPrompt()


