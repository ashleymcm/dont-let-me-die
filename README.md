# dont-let-me-die
Taplytics #StayConnected Hackday Project

# run locally
1. Set environment variables based on .env.sample
2. npm install
3. npm start
4. ngrok http ${server port:5000}

To test it out, try `curl -X POST -H 'Content-type: application/json' --data "`cat ./alert.json`" ${ngrok url}/incoming`

