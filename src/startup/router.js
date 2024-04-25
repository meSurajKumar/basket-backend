import bucketRoutes from '../routes/bucketRoutes.js';
import ballRoutes from '../routes/ballRoutes.js'


export default function (app) {
    app.get('/', (req, res) => {
        return res.status(201).send({ message: 'Welcome to app Backet Test Backend' })
    }) // this is just a test route of our app.
    app.use('/api/v1/bucket', bucketRoutes)
    app.use('/api/v1/ball', ballRoutes)

    app.use('*', (req, res) => {
        return res.status(404).send({ message: 'The route you are looking for not exists !' }) // if the route not exists.
    })
}