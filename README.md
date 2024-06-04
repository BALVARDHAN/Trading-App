<h1>Trading Platform</h1>
<h4>This is a MERN stack-based virtual trading platform that uses WebSockets for real-time market data integration. This app enables users to practice trading with virtual money, offering a risk-free environment to enhance their trading skills. The project highlights my proficiency in full-stack development and handling live data streams.</h4>
<h5>Technologies Used : React, WebSockets, TailwindCSS, ApexCharts, Node, Express, MongoDB</h5>

https://github.com/BALVARDHAN/Trading-app/assets/68677559/9ffc5fe3-cb53-4531-9013-54c02bfea860
<h2>How to use this app</h2>
For the real time market data i am using WebSocket API provide by Upstox, so in order to use this app you should have an account in upstox.
<h4>STEP-1 =>Generate the Access token to use upstox API</h4>
<code>cd backend</code><br>
<code>node token.js</code><br>
<h4>STEP-2 => Now go to "http://localhost:8085/token", enter your upstox account credentials and then you will recieve a token key</h4>
<h4>STEP-3 => Now go to /frontend/src/App.js and assign the token key toh "auth_token" variable, and then your app is ready to run</h4>
<h4>STEP-4 => Start the Backend</h4>
<code>cd backend</code><br>
<code>node server.js</code><br>
<h4>STEP-5 => Start the Frontend</h4>
<code>cd frontend</code><br>
<code>npm start</code><br>

