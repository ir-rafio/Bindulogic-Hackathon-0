const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const port = 3000;

const routeMap = {
  '': 'home.html',
  'projects': 'projects.html',
  'about': 'about.html'
}

const redirectMap = {
  'home': ''
}

const redirect = (res, location, statusCode = 302) => {
  res.writeHead(statusCode, {'Location': location});
  res.end();
}

const server = http.createServer((req, res) => {
  const method = req.method.toUpperCase();
  const parsedUrl = url.parse(req.url, true);
  const {pathname, query} = parsedUrl;
  const trimmedPath = pathname.replace(/^\/|\/$/g, '').toLowerCase();

  console.log(`${method} Request for ${trimmedPath}`);
  if(Object.keys(query).length > 0)
  {
    console.log(`Query: ${JSON.stringify(query)}`);

    if (trimmedPath === '' && 'location' in query) {
      const redirectPage = query.location.replace(/^\/|\/$/g, '').toLowerCase();
      console.log(`Redirecting to ${redirectPage}`);
      redirect(res, redirectPage, 301);
      return;
    }
  }
  
  if(method === 'POST') {
    let requestBody = '';
    req.on('data', (buffer) => requestBody += buffer);
    req.on('end', () => {
      formData = querystring.parse(requestBody);
      if(Object.keys(formData).length > 0) console.log(`Form Data: ${JSON.stringify(formData)}`);

      if(trimmedPath === 'about') {
        const page = 'html/about-post.html';
        console.log(`Opening ${page}`);

        const data = fs.readFileSync(page, 'utf-8').replace('{{about}}', formData.about);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
        return;
      }
    });
  }

  if(trimmedPath in redirectMap) {
    const redirectPage = redirectMap[trimmedPath];
    console.log(`Redirecting to ${redirectPage}`);
    redirect(res, redirectPage, 301);
    return;
  }

  if(!(trimmedPath in routeMap)) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Error 404 Not Found');
    return;
  }

  const page = `html/${routeMap[trimmedPath]}`;
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
  });
});

server.listen(port, () => console.log(`Listening on port ${port}...`));