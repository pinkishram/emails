const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/puplic`));

app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/signup.html`);
});

app.post('/', function (req, res) {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;

    console.log(firstname, lastname, email);

    const subscriber = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname,
                },
            },
        ],
    };

    const jsonSub = JSON.stringify(subscriber);

    console.log(jsonSub);

    const urlMail = 'https://us17.api.mailchimp.com/3.0/lists/9d47f2bde8';

    const options = {
        method: 'POST',
        auth: 'pinkishram:16014bb7438848aa149c9b94e5ea9e8d-us17', //authentication,
    };

    const request = https.request(urlMail, options, (response) => {
        response.on('data', (data) => {
            if (response.statusCode === 200) return res.sendFile(`${__dirname}/sucess.html`);
            if (response.statusCode !== 200) return res.sendFile(`${__dirname}/failuer.html`);

            console.log(JSON.parse(data));
        });
    });

    request.write(jsonSub);
    request.end();
});

app.post('/failuer', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
    console.log('server start');
});

// api key  16014bb7438848aa149c9b94e5ea9e8d-us17
// list id 9d47f2bde8.
