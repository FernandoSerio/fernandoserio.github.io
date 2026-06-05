// scrape pages folder for markdown files
const markdown = fs.readdirSync(PAGES);
const fs = require('fs');
const marked = require('./lib/marked-node');
const highlight = require('./lib/highlight-node');
const checkBox = require('./lib/checkBox');

markdown.forEach(file => {

    const fullPath = PAGES + file;

    // Ignorar directorios
    if (!file.endsWith('.md')) {
        return;
    }

    checkBox(`building ${file}...`);

    // Get markdown text
    const markdownText = fs.readFileSync(fullPath, 'utf8');

    // Convert markdown to html
    const content = marked(markdownText);

    // Replace index dev script with page content
    let output = index.replace(
        '<script type="module" src="./utils/dev.js"></script>',
        content
    );

    // Replace title with content of first <h1> tag
    const match = output.match(/>(.*?)<\/h1>/);
    const newTitle = match ? match[1] : null;

    if (newTitle) {
        output = output.replace(
            /<title>(.*?)<\/title>/,
            `<title>${newTitle}</title>`
        );
    }

    // Replace 'docs/assets' links with 'assets'
    output = output.replace(/docs\/assets/g, 'assets');

    // Replace local '?' dev links with built '.html'
    output = output.replace(/href="\?(.*?)"/g, 'href="$1.html"');

    // Output built html to build folder
    const outputFile = file.replace('.md', '.html');

    fs.writeFileSync(BUILD + outputFile, output);

    checkBox(`${outputFile} built`, true);
});
