const http = require('http');
const https = require('https');

const PORT = 5098;

const server = http.createServer((req, res) => {
  // 将请求数据读取到一个字符串中
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // 创建一个代表OpenAI API的请求
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        authorization: req.headers.authorization
      },
    };

    // 发送请求到OpenAI API
    const request = https.request(options, (response) => {
      let apiResponse = '';
      response.on('data', (chunk) => {
        res.write(chunk)
        apiResponse += chunk;
      });

      response.on('end', () => {
        res.writeHead(response.statusCode, response.headers);
        // 将OpenAI API的响应转发回原始请求
        res.end();
      });
    });

    // 将请求数据写入OpenAI API的请求中
    request.write(body);
    request.end();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
