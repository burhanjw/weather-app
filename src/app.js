const path = require('path');
const express = require('express')
const hbs = require('hbs');

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather',
        name: 'Burhan'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About',
        name: 'Burhan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'This is some helpful text',
        name: 'Burhan'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'An address is needed'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
             return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error',
        message: 'Help article not found',
        name: 'Burhan'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error',
        message: 'Page not found',
        name: 'Burhan'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})