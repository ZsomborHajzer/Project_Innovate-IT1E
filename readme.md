<!--
Hey, thanks for using the awesome-readme-template template.  
If you have any enhancements, then fork this project and create a pull request 
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <h1>Project Innovate IT1E Backend repository</h1>
  
<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
- [Tech Stack](#space_invader-tech-stack)
- [Features](#dart-features)
- [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
- [Prerequisites](#bangbang-prerequisites)
- [Installation](#gear-installation)
- [Running Tests](#test_tube-running-tests)
- [Run Locally](#running-run-locally)
- [Deployment](#triangular_flag_on_post-deployment)
- [Usage](#eyes-usage)
- [PostMan](#shipit)

</br>


<!-- About the Project -->
## :star2: About the Project


<!-- TechStack -->
### :space_invader: Tech Stack

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nodejs.org/">NodeJS</a></li>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://restfulapi.net/">REST API</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
  </ul>
</details>

<details>
<summary>Other Tools</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">PostMan</a></li>
    <li><a href="https://railway.app">Railway</a></li>
  </ul>
</details>

<details>
<summary>Dependencies</summary>
  <ul>
    <li><a href="https://www.npmjs.com/package/bcrypt">bcryptjs version: 2.4.3</a></li>
    <li><a href="https://www.npmjs.com/package/body-parser">body-parser version: 1.20.2</a></li>
    <li><a href="https://www.npmjs.com/package/cors">cors version: 2.8.5</a></li>
    <li><a href="https://www.npmjs.com/package/dotenv">dotenv version: 16.0.3 </a></li>
    <li><a href="https://www.npmjs.com/package/express">express version: 4.18.2 </a></li>
    <li><a href="https://www.npmjs.com/package/express-validator">express-validator version: 7.0.1</a></li>
    <li><a href="https://www.npmjs.com/package/fs">fs version: 0.0.1-security</a></li>
    <li><a href="https://www.npmjs.com/package/helmet">helmet version: 7.0.0</a></li>
    <li><a href="https://www.npmjs.com/package/jsonwebtoken">jsonwebtoken version: 9.0.0</a></li>
    <li><a href="https://www.npmjs.com/package/mongoose">mongoose version: 7.1.1</a></li>
    <li><a href="https://www.npmjs.com/package/morgan">morgan version: 1.10.0</a></li>
    <li><a href="https://www.npmjs.com/package/nodemon">nodemon version: 2.0.22</a></li>
    <li><a href="https://www.npmjs.com/package/openai">openai version: 3.2.1</a></li>
    <li><a href="https://www.npmjs.com/package/path">path version: 0.12.7</a></li>
  </ul>
</details>



<!-- Env Variables -->
### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_DB_URI`

`OPENAI_API_KEY`

`PORT`

These values are provided in a .txt file named envVariables when the project is turned in

<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses Node.js as a javascript runtime enviroment version 20.3.1, If you do not have Node.js downloaded or if it is an older version you can download it from <a href=https://nodejs.org>HERE</a>
   
<!-- Running Tests -->
### :test_tube: Running Tests

Current testing part of the backend is still under developement

<!-- Run Locally -->
### :running: Run Locally

Clone the project

```bash
  git clone https://github.com/ZsomborHajzer/Project_Innovate-IT1E-BackEnd.git
```

Go to the project directory

```bash
  cd Project_Innovate-IT1E-BackEnd
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

<!-- Usage -->  
### :eyes: Usage

Since this is a back-end server that communicates with the frontend through REST APIs, it is difficult to represent all of its capabilities visually.

For this we have built a PostMan request collection to both test and present our work thoughout this project.

This collection can be accessed from the following link:
<a href=https://www.postman.com/galactic-space-226728/workspace/project-innovate-backend>https://www.postman.com/galactic-space-226728/workspace/project-innovate-backend</a>

Sadly we have managed to break the postman description by uploading a screenshot therefore as of right now we are unable to edit the description in postman.

For this reason we ask you to ignore the description written there.


Currently the server is hosted on Railway.app and has the DNS of : https://projectinnovate-it1e-backend-production.up.railway.app

Please use the following link and store it as a global variable in PostMan with the variable name of webBaseURL and with the current value of ---link---.

If you decide to run the server locally, please replace  the ---link--- value with "localhost:8082" and create a 
.env file with the provided information from the envVariables.txt file

<!-- PostMan -->  
### :shipit::PostMan 

**Introduction**
This is the Backend API request demo for Project Innovate IT1E. This description includes the variables needed to get this collection working,
 and the order of operations required to mimic the front end. Due to the our limited experience with postman, this collection is semi-dynamic 
 with variable automaziation therefore at some parts we ask you to follow the order of requests to show the capabilities of the backend server.