import bucketRoutes from '../routes/bucketRoutes.js';
import ballRoutes from '../routes/ballRoutes.js'
import fs from 'fs'

// importing the swagger doc and swagger ui
import swaggerUI from 'swagger-ui-express'; 
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const swaggerDoc = loadJSON('../swagger/Basket-swagger.json');

export default function (app) {
    app.get('/', (req, res) => {
        return res.status(201).send({ message: 'Welcome to app Backet Test Backend' })
    }) // this is just a test route of our app.
    app.use('/api/v1/bucket', bucketRoutes)
    app.use('/api/v1/ball', ballRoutes)

    app.use('/api-doc',swaggerUI.serve, swaggerUI.setup(swaggerDoc))

    app.use('*', (req, res) => {
        return res.status(404).send({ message: 'The route you are looking for not exists !' }) // if the route not exists.
    })
}