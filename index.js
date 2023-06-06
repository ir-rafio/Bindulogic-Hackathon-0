const http = require('http');
const fs = require('fs');
const url = require('url');

const port = 3000;

const routeMap = {
  '/': 'home.html',
  '/projects': 'projects.html',
  '/about': 'about.html'
}

const server = http.createServer((req, res) => {
  const {method} = req;
  const parsedUrl = url.parse(req.url, true);
  const {pathname, query} = parsedUrl;

  console.log(`${method} Request for ${pathname}`);
  if(Object.keys(query).length > 0) console.log(`Query: ${JSON.stringify(query)}`);
  
  if(pathname === '/favicon.ico') return;

  const page = `html/${routeMap[pathname]}`;
  console.log(`Opening ${page}`);

  fs.readFile(page, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Error 404 Not Found');
      return;
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  })
})

server.listen(port, () => console.log(`Listening on port ${port}...`))