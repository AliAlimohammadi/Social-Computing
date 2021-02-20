
# Blogfa Scraper

Blogfa Scraper is a piece of JavaScript (Node.js) code that scrapes a list of most recently updated blogs and then crawls each blog and scrapes them to find the last 10 posts.

## Prerequisites

You must have [Node.js](https://nodejs.org/) installed on your machine.

To install [Node.js](https://nodejs.org/en/download/), you might proceed with one of the following commands depending on your operating system:
+ Linux: Debian and Ubuntu based Linux distributions
[Node.js binary distributions](https://github.com/nodesource/distributions/blob/master/README.md) are available from *NodeSource*.
+ Windows:
Using [Chocolatey](https://chocolatey.org/)
```bash
cinst nodejs
# or for full install with npm
cinst nodejs.install
```
+ Mac:
```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

## Usage
Open *command prompt*/*terminal* at the project directory. Then run the following command:
```bash
node core.js
```

## Output
Crawled data will be stored in the `data` folder in the project directory. The name of each file represents the name of the blog that it was retrieved from. Data is in plain text format. This is due to the fact that blogs do not have a uniform theme; in fact, each blog has its own customized theme, making it nearly impossible to be formalized by an automated machine code.

## License
[MIT](https://choosealicense.com/licenses/mit/)