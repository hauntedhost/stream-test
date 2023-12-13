const crypto = require('crypto');
const fs = require('fs');
const http2 = require('http2');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

const server = http2.createSecureServer({
  key: fs.readFileSync(path.join(dataDir, 'privkey.pem')),
  cert: fs.readFileSync(path.join(dataDir, 'cert.pem')),
  allowHTTP1: false,
});

const generateData = () =>
  crypto.createHash('sha256').update(crypto.randomBytes(20)).digest('hex');

// generate and save a json file that's at least sizeInKb kilobytes
const writePayloadFile = (filePath, sizeInKb) => {
  let data = generateData();
  const repetitions = Math.ceil((sizeInKb * 1024) / data.length);
  const result = [];

  for (let i = 0; i < repetitions; i++) {
    result.push(data);
    data = generateData();
  }

  fs.writeFileSync(filePath, JSON.stringify(result));
};

// generate data.json
const filePath = path.join(dataDir, 'data.json');
if (!fs.existsSync(filePath)) {
  writePayloadFile(filePath, 65);
}

server.on('stream', (stream, headers) => {
  if (['POST', 'PUT'].includes(headers[':method'])) {
    let body = [];

    stream.on('data', (chunk) => {
      console.log('received chunk', chunk);
      body.push(chunk);
    });

    stream.on('end', () => {
      body = Buffer.concat(body).toString();
      console.log('end!', body.length);
      stream.respond({
        'content-type': 'text/plain',
        ':status': 200,
      });
      stream.end('Request received');
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
    });
  } else {
    stream.respond({ ':status': 405 });
    stream.end();
  }
});

server.listen(5050, () => {
  console.log('Server listening on https://localhost:5050');
});
