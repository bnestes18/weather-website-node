const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000

// Define paths for Express config - Where the html doc lives
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Sets up our template engine - handle bars - Handle bars allows us to render dynamic content
app.set('view engine', 'hbs')
// Sets up our views location
app.set('views', viewsPath);
// Sets up our partials location
hbs.registerPartials(partialsPath);

// Serves up our static docs in the public folder
// This line checks every request that comes into our server
app.use(express.static(publicDirectoryPath));

// req - object containing info about incoming request to server
// res - contains methods to customize what we're gonna send back to requester
app.get('/', (req, res) => {
    // Renders index.hbs template - dynamic file
    res.render('index', {
        title: 'Weather',
        name: 'Brittney Estes'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Brittney Estes'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is the help text',
        title: 'Help',
        name: 'Brittney Estes'
    })
})

app.get('/weather', (req, res) => {
    // If no address query was provided, return a json error message
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an adress to continue.'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            } else {
                res.send({
                    location,
                    forecast: forecastData,
                    address: req.query.address
                })
            }
        })
    })
})

app.get('/products', (req, res) => {
    // If there is no 'search' (property) requested, send an error
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('notfound', {
        error: 'Help article not found.',
        title: '404',
        name: 'Brittney Estes'
    });
})

// Match any route that hasn't been matched so far
app.get('*', (req, res) => {
    res.render('notfound', {
        error: 'Page not found.',
        title: '404',
        name: 'Brittney Estes'
    });
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
}) // Starts up the server at a specific port