const express = require('express')
const app = express()

const PORT = process.env.PORT || 80
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res, next) => {
    res.end('<h1>HELLO WORLD!!!</h1>')
   });
   
   app.get('/about', (req, res, next) => {
    res.end('<h1>about</h1>')
   });
   
    