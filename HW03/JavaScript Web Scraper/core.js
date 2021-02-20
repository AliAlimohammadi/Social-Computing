// Prerequisites
const axios = require('axios');
const cheerio = require('cheerio');
const { NONAME } = require('dns');
const fs = require('fs');

// Fetch the HTML content of a URL
async function fetchHTML(url) {
  const {
    data
  } = await axios.get(url).catch(function(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  });
  return cheerio.load(data);
}

// Obtain post number from link to the post
function getPostNumber(postLink) {
  startIndex = postLink.indexOf('/post/') + 6;
  endIndex = postLink.indexOf('/', startIndex);
  var postNumber;
  if (endIndex != -1) {
    postNumber = postLink.substr(startIndex, endIndex - startIndex);
  } else {
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
  if (!fs.existsSync('data/')) {
    fs.mkdirSync('data');
  }
  if (fs.existsSync(fileName)) {
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

  while (postNumber > 0 && iter < 10) {
    const page = await axios.get(baseLink + postNumber--).catch(function(error) {
      if (error.response) {
        console.log('404: Post not found!');
      }
    }) || null;
    if (page) {
      savePostContent(cheerio.load(page.data), baseLink);
      iter++;
    }
  }
}

// Obtain a list of updated blogs + the driver code
(async () => {
  const $ = await fetchHTML('http://www.blogfa.com/updated/')

  const anchorTags = $('.ull > li > a');
  for (let tag of anchorTags) {
    saveLastTenPosts(tag.attribs['href']);
  }
})();