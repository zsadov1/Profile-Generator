const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const puppeteer = require('puppeteer');


// const generateHTML = require('./generateHTML.js')

var conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
  });


let data = {};

let questions = [
    {
        message: 'What is your github username?',
        name: 'username',
    },
    {
        message: 'What is your favorite color?',
        name: 'color',
        type: 'list',
        choices: ['green', 'blue', 'pink', 'red'],
    }
]
