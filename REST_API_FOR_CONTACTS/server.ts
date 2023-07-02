import express from 'express';
import routes from './routes/index';
import errorHandler from './middleware/errorHandler';

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
