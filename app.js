const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Assigning Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server Started on Port Number ${PORT}`));

//BodyParser MiddleWare
app.use(bodyParser.urlencoded({ extended: true }));
//Signup Route
app.post('/signup', (req, res) =>{
    const {firstName, lastName, email} = req.body;
    // Make sure fields are filled
    if (!firstName || !lastName || !email) {
        res.redirect('/fail.html');
        return;
    }

    // Construct req data
    const data = {
        members: [
        {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
            FNAME: firstName,
            LNAME: lastName
            }
        }
        ]
    };

    const postData = JSON.stringify(data);

    const options = {
        url: 'https://us20.api.mailchimp.com/3.0/lists/393fbe810a',
        method: 'POST',
        headers: {
        Authorization: 'auth e01ab707902fe172c94db1612fa11fd1-us20'
        },
        body: postData
    };

    request(options, (err, response, body) => {
        if (err) {
        res.redirect('/fail.html');
        } else {
        if (response.statusCode === 200) {
            res.redirect('/success.html');
        } else {
            res.redirect('/fail.html');
        }
        }
    });

});