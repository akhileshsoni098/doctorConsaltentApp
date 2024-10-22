const express = require('express');

const patient = express()


const patientAuth = require('../../routes/patientRoutes/patientAuthRoutes')

patient.use('/patient/auth',patientAuth)

module.exports = patient