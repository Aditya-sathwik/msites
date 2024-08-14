function loadSVG(filename, targetSelector) {
    const basePath = '../assets/';
    const svgPath = `${basePath}${filename}.svg`;
    const mainselector = document.querySelector(targetSelector); 
    
    if (!mainselector) {
        console.error(`No element found with selector: ${targetSelector}`);
        return;
    }

    fetch(svgPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load SVG file: ${response.statusText}`);
            }
            return response.text();
        })
        .then(svgContent => {
            mainselector.innerHTML = svgContent; 
        })
        .catch(error => {
            console.error(error);
        });
}



