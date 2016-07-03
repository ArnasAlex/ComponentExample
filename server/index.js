import http from 'http';
import express from 'express';
import path from 'path';
import compress from 'compression';

var app = express();
app.server = http.createServer(app);

app.use(compress());
app.use(express.static('dist'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
});

app.server.listen(process.env.PORT || 3000, () => {
    console.log(`Started on port ${app.server.address().port}`);
});

export default app;