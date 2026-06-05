const INDEX = `${__dirname}/../index.html`;
const PAGES = `${__dirname}/../pages`;
const BUILD = `${__dirname}/../docs`;

const fs = require('fs');
const path = require('path');

const marked = require('./lib/marked-node');
const highlight = require('./lib/highlight-node');
const checkBox = require('./lib/checkBox');

marked.setOptions({
    langPrefix: '',
    highlight: function(code) {
        return highlight.highlightAuto(code).value;
    },
});

// Get index.html text
const index = fs.readFileSync(INDEX, 'utf8');

/**
 * Crear directorio si no existe
 */
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Procesar un archivo markdown
 */
function buildMarkdown(sourceFile, relativeFile) {

    checkBox(`building ${relativeFile}...`);

    const markdownText = fs.readFileSync(sourceFile, 'utf8');

    const content = marked(markdownText);

    let output = index.replace(
        '<script type="module" src="./utils/dev.js"></script>',
        content
    );

    const match = output.match(/>(.*?)<\/h1>/);

    if (match && match[1]) {
        output = output.replace(
            /<title>(.*?)<\/title>/,
            `<title>${match[1]}</title>`
        );
    }

    output = output.replace(/docs\/assets/g, '/assets');

    output = output.replace(
        /href="\?(.*?)"/g,
        'href="$1.html"'
    );

    const outputRelative = relativeFile.replace(/\.md$/, '.html');

    const outputPath = path.join(BUILD, outputRelative);

    ensureDir(path.dirname(outputPath));

    fs.writeFileSync(outputPath, output);

    checkBox(`${outputRelative} built`, true);
}

/**
 * Recorrer directorios recursivamente
 */
function walkDirectory(currentDir, relativeDir = '') {

    const entries = fs.readdirSync(currentDir, {
        withFileTypes: true
    });

    entries.forEach(entry => {

        const fullPath = path.join(currentDir, entry.name);

        const relativePath = relativeDir
            ? path.join(relativeDir, entry.name)
            : entry.name;

        if (entry.isDirectory()) {

            walkDirectory(fullPath, relativePath);

            return;
        }

        if (!entry.name.endsWith('.md')) {
            return;
        }

        buildMarkdown(fullPath, relativePath);
    });
}

ensureDir(BUILD);

walkDirectory(PAGES);