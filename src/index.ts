import express from 'express';
import bodyParser from 'body-parser';
import {videoRouter} from "./routes/video-router";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser());

app.use('/api', videoRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})