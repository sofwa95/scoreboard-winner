# iSaham Web Template

One page web template used by iSaham

## Download and Installation

To begin using this template, choose one of the following options to get started:
* Download as zip folder
* Clone the repo: `git clone https://github.com/AmirinNS/isaham-web-template.git`
* [Fork, Clone, or Download on GitHub](https://github.com/AmirinNS/isaham-web-template)

## Usage

### Basic Usage

After downloading, simply edit the HTML and add files to the respective folders. To preview the changes that has been made to the code, just open the `index.html` file in your web browser.

### Steps
- Put CSS files in `css` folder
- To compile the CSS files, place in the `css/concat` folder. `all-styles.css` file will be created
- Put JavaScript files in `js` folder
- To compile the JavaScript files, place in the `js/concat` folder. `all-scripts.js` file will be created
- Put image files in `img` folder
- Put font files in `font` folder
- Other files or library can be placed in `vendor` folder
- Do not create `all-scripts.js` and `all-styles.css`
- Do not compile `*.min.css` and `*.min.js`

### Gulp Tasks

Open terminal or command prompt. Change the directory to the project folder and run these command.

- `gulp` run development
- `gulp styles-concat` compiles JS files and minifies the compiled JS
- `gulp scripts-concat` compiles CSS files and minifies the compiled CSS
- `gulp build` build production code. Exported in `build` folder

You must have npm and Gulp installed globally on your machine in order to use these features.
