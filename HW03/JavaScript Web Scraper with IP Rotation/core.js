// Prerequisites
const axios = require('axios')
const cheerio = require('cheerio');
const { NONAME } = require('dns');
const fs = require('fs');

const PROXIES = ['5.181.156.226:3128',
    '150.109.32.166:80',
    '203.198.94.132:80',
    '159.65.171.69:80',
    '5.189.133.231:80',
    '172.104.171.106:80',
    '104.244.75.218:8080',
    '174.138.0.99:80',
    '103.115.14.158:80',
    '89.187.177.88:80',
    '69.63.170.74:3128',
    '89.187.177.107:80',
    '46.4.96.137:3128',
    '52.53.148.127:8081',
    '88.198.50.103:8080',
    '91.229.246.21:80',
    '20.50.107.111:80',
    '88.198.24.108:8080']

// Fetch the HTML content of a URL (using proxies)
async function fetchHTML(url) {
    let httpsProxyAgent = require('https-proxy-agent');
    let agent = new httpsProxyAgent('http://' + PROXIES[0]);

    var config = {
    method: 'GET',
    url,
    httpsAgent: agent,
    };
  const { data } = await axios.request(config).catch(function (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  });
  return cheerio.load(data);
}

// Obtain post number from link to the post
function getPostNumber(postLink){
    startIndex = postLink.indexOf('/post/') + 6;
    endIndex = postLink.indexOf('/', startIndex);
    var postNumber;
    if(endIndex != -1) {
        postNumber = postLink.substr(startIndex, endIndex - startIndex);
    }
    else {
        postNumber = postLink.substr(startIndex);
    }
    return +postNumber;
}

// Save & store the contents of a post
function savePostContent($, postUrl) {
    var pageContent = $('body').text();
    const firstSlash = postUrl.indexOf('//') + 2;
    const nextSlash = postUrl.indexOf('/', firstSlash);
    const fileName = 'data\\' + postUrl.substr(firstSlash, nextSlash - firstSlash) + '.txt';
    
    const delim = '\n************************************************************************************\n';
    
	if(!fs.existsSync('data/')) {
        fs.mkdirSync('data');
    }
	
    if(fs.existsSync(fileName)) {
        fs.appendFileSync(fileName, delim + pageContent);
    } else {
        fs.writeFileSync(fileName, pageContent);
    }
    
}

// Obtain the last ten posts & save their data
async function saveLastTenPosts(lastPostLink) {
    var postNumber = getPostNumber(lastPostLink);
    const baseLink = lastPostLink.substr(0, lastPostLink.indexOf('/post/') + 6);
    var iter = 0;

    while(postNumber > 0 && iter < 10) {
        let httpsProxyAgent = require('https-proxy-agent');
        let agent = new httpsProxyAgent('http://' + PROXIES[iter % PROXIES.length]);

        let url = baseLink + postNumber--;
        
        var config = {
        method: 'GET',
        url,
        httpsAgent: agent,
        };
		
        const page = await axios.request(config).catch(function (error) {
            if (error.response) {
              console.log('404: Post not found!');
            }
        }) || null;
		
        if(page) {
            savePostContent(cheerio.load(page.data), baseLink);
            iter++;
        }
    }
    console.log(baseLink);
}

// Obtain a list of updated blogs + the driver code
(async() => {
    const $ = await fetchHTML('http://www.blogfa.com/updated/')

    const anchorTags = $('.ull > li > a');
    for(let tag of anchorTags){
        saveLastTenPosts(tag.attribs['href']);
    }
})();
