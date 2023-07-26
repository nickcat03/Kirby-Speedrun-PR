const express = require('express')
const path = require('path');
const cors = require('cors'); //security protection
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());


