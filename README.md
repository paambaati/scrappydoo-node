# ![pageres](media/256x256.png)

Companion crawl server for the [ScrappyDoo Chrome Extension](https://bitbucket.org/paambaati/scrappydoo-chrome). Given a URL and a set of CSS selectors, the server goes through the markup, parses for and returns the values found at those selectors.


## Dependencies

1. Node.js (>= 6.9.0)
2. yarn (`npm i yarn --global`)

## Installation

```
$ yarn install
```

## Usage

TO start up the server (on `localhost` and default port `6969`), use the command -

```
$ npm start
```

## API

### POST /api/data

#### Request Headers
```
{
    "Content-Type": "application/json"
}
```

#### Request
##### url

Type: `String` *(Page URL)*  
Required: `true`

Fully-qualified URL to crawl.

##### data

Type: `Array` *(Selector information)*  
Required: `true`

Array of selectors.

##### data > name

Type: `String` *(Unique name for the selector)*  
Required: `true`

Unique name for the selector. Will be used in the response to identify selector in results.

##### data > selector

Type: `String` *(CSS selector to select from page)*  
Required: `true`

CSS selector for element to select.

##### data > attribute

Type: `String` *(HTML attribute to pick from selected element)*  
Required: `true`

HTML attribute to pick from the selected element.

#### Sample Request

```
{
    "url": "https://www.reddit.com",
    "data": [
        {
            "name": "header_logo",
            "selector": "#header-img",
            "attribute": "href"
        },
        {
            "name": "sidebar_donate_link",
            "selector": "html>body>div:eq(2)>div:eq(7)>div>div>a",
            "attribute": "href"
        }
    ]
}
```

#### Sample Response
```
{
    "header_logo": "/",
    "sidebar_donate_link": "/gold?goldtype=code&source=progressbar"
}
```

## License

WTFPL © [GP](https://github.com/paambaati)
