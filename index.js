const fs = require('fs');
const ImageTracer = require('imagetracerjs');

// Example usage: node index.js input.png output.svg
const inputPath = process.argv[2] || 'input.png';
const outputPath = process.argv[3] || 'output.svg';

if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file '${inputPath}' not found.`);
    console.log('Usage: node index.js <input.png> <output.svg>');
    // For demo purposes, we will not exit but just warn, incase the user runs it without args first.
    process.exit(1);
}

// Option presets
const options = {
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    colorsampling: 2,
    numberofcolors: 16,
    mincolorratio: 0,
    colorquantcycles: 3,
    scale: 1,
    simplifytolerance: 0,
    roundcoords: 1,
    lcpr: 0,
    qcpr: 0,
    desc: false,
    viewbox: false,
    blurradius: 0,
    blurdelta: 20
};

console.log(`Converting ${inputPath} to ${outputPath}...`);

// Read file
const buffer = fs.readFileSync(inputPath);

// ImageTracer only accepts Image data or base64? 
// Actually for Node.js, imagetracerjs has a helper or we might need to use a different approach.
// The standard 'imagetracerjs' npm package often runs in browser.
// For Node.js, we might need a sharp or similar buffer-to-raw loader if imagetracerjs expects image data.
// However, 'imagetracerjs' npm package readme says:
// var ImageTracer = require('imagetracerjs');
// ImageTracer.imageToSVG( 'output.svg', 'input.png', options, callback ); -> This is convenient!

ImageTracer.imageToSVG(inputPath, function(svgstr){
    fs.writeFileSync(outputPath, svgstr);
    console.log('Saved SVG to ' + outputPath);
}, options);
