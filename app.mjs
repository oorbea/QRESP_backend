import express from 'node:express';
import cors from 'node:cors';
import bodyParser from 'node:body-parser';
import dbConnection from './dbConnection.mjs';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dbConnection();

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server is running on port ' + process.env.PORT ?? 3000);
});

app.post('/qresp_api', (req, res) => {

});
