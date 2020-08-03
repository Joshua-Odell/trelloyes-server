require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { v4: uuid}= require('uuid');
const cardRouter = require('./card/card-router')
const listRouter = require('./list/list-router')


const app = express()

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended: false})


  const lists = [{
    id: 1,
    header: 'List One',
    cardIds: [1]
  }];



const morganOption = ( NODE_ENV === 'production')
    ? 'tiny'
    : 'common' ;

app.use(function validateBearerToken(req, res, next){
     const apiToken = process.env.API_TOKEN
     const authToken = req.get('Authorization')

     if (!authToken || authToken !== apiToken) {
         logger.error(`Unauthorized request to path: ${req.path} `);
         return res.status(401).json({ error: 'Unauthorized request' })
     }
     next()
})

app.use(morgan(NODE_ENV))
app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(cardRouter)
app.use(listRouter)



app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: {message: 'server error'} }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app
