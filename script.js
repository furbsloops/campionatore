document.addEventListener("DOMContentLoaded", function () {
    const leftGrid = document.getElementById('leftGrid');
    const rightContainer = document.getElementById('rightContainer');
    const tileCounter = document.getElementById('tileCounter');
    let selectedImage = '';
    let isMouseDown = false;
    let tileCount = {};

    const maxWidth = 30; // Massima larghezza in celle
    const maxHeight = 30; // Massima altezza in celle
    const maxDimensionPerCell = 60; // Massima dimensione di ogni cella in pixel


    const imagePaths = [
        'Piastrelle modulari garage/Black.png',
        'Piastrelle modulari garage/Blue.png',
        'Piastrelle modulari garage/Gray.png',
        'Piastrelle modulari garage/Green.png',
        'Piastrelle modulari garage/Light Green.png',
        'Piastrelle modulari garage/Light Yellow.png',
        'Piastrelle modulari garage/Orange.png',
        'Piastrelle modulari garage/Pink.png',
        'Piastrelle modulari garage/Purple.png',
        'Piastrelle modulari garage/Red.png',
        'Piastrelle modulari garage/White.png',
        'Piastrelle modulari garage/Yellow.png',
        // ... altri percorsi di immagini ...
    ];

    imagePaths.forEach(imagePath => {
        const square = document.createElement('div');
        square.classList.add('color-square');
        const image = document.createElement('img');
        image.src = imagePath;
        image.style.width = '100%';
        image.style.height = '100%';
        image.draggable = false;
        square.appendChild(image);
        square.addEventListener('click', function () {
            selectedImage = imagePath;
            updateSelectedImage();
        });
        leftGrid.appendChild(square);
    });

    for (let i = 0; i < maxWidth * maxHeight; i++) {
        const square = document.createElement('div');
        square.classList.add('color-square');
        square.style.backgroundColor = '#000000';
        square.addEventListener('click', function () {
            applyColor(square);
        });
        rightContainer.appendChild(square);
    }

    const riempiButton = document.getElementById('riempi');
    riempiButton.addEventListener('click', fillGrid);

    function fillGrid() {
        if (!selectedImage) {
            alert("Seleziona prima un'immagine.");
            return;
        }

        rightContainer.querySelectorAll('.color-square').forEach(square => {
            fillSquare(square, selectedImage);
        });

        renderTileCount();
        updateSquareMeters();
    }

    const scacchieraButton = document.getElementById('scacchiera');
    scacchieraButton.addEventListener('click', fillChessPattern);

    function fillChessPattern() {
        if (!selectedImage) {
            alert("Seleziona prima un'immagine.");
            return;
        }

        const widthInMeters = parseFloat(document.getElementById('inputWidth').value) || maxWidth;
        const heightInMeters = parseFloat(document.getElementById('inputHeight').value) || maxHeight;
        const tilesWidth = Math.ceil(widthInMeters / 0.4);
        const tilesHeight = Math.ceil(heightInMeters / 0.4);

        rightContainer.querySelectorAll('.color-square').forEach((square, index) => {
            const row = Math.floor(index / tilesWidth);
            const col = index % tilesWidth;
            const shouldBeFilled = (row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1);

            if (shouldBeFilled) {
                fillSquare(square, selectedImage);
            } else {
                square.innerHTML = '';
                square.removeAttribute('data-color');
            }
        });

        renderTileCount();
        updateSquareMeters();
    }


    function fillSquare(square, imagePath) {
        const alreadyFilledWithSameImage = square.getAttribute('data-color') === imagePath;

        if (!alreadyFilledWithSameImage) {
            square.innerHTML = '';
            const image = document.createElement('img');
            image.src = imagePath;
            image.style.width = '100%';
            image.style.height = '100%';
            image.draggable = false;
            square.appendChild(image);
            square.setAttribute('data-color', imagePath);

            updateTileCount(imagePath, 1);
        }
    }

    function applyColor(square) {
        if (selectedImage) {
            const isAlreadySelected = square.innerHTML.includes(selectedImage);
            const oldImagePath = square.getAttribute('data-color');

            if (isAlreadySelected && oldImagePath === selectedImage) {
                square.innerHTML = '';
                square.removeAttribute('data-color');
                updateTileCount(oldImagePath, -1);
            } else {
                const image = document.createElement('img');
                image.src = selectedImage;
                image.style.width = '100%';
                image.style.height = '100%';
                image.draggable = false;
                square.innerHTML = '';
                square.appendChild(image);
                square.setAttribute('data-color', selectedImage);
                updateTileCount(selectedImage, 1);
            }
        } else {
            square.style.backgroundColor = '#000000';
            square.innerHTML = '';
            square.removeAttribute('data-color');
        }
    }

    function resetTileCount() {
        tileCount = {};
        tileCounter.innerHTML = '';
    }

    function updateTileCount(imagePath, change) {
        tileCount[imagePath] = (tileCount[imagePath] || 0) + change;
        renderTileCount();
    }

    function handleButtonClick(isScacchiera) {
        resetTileCount(); // Resetta il conteggio prima di applicare le modifiche

        const squares = rightContainer.querySelectorAll('.color-square');
        const width = Math.ceil(parseFloat(document.getElementById('inputWidth').value) / 0.4) || maxWidth;
        const height = Math.ceil(parseFloat(document.getElementById('inputHeight').value) / 0.4) || maxHeight;

        if (!selectedImage) {
            alert("Seleziona prima un'immagine.");
            return;
        }

        for (let i = 0; i < squares.length; i++) {
            const row = Math.floor(i / width);
            const col = i % width;
            const isEvenRow = row % 2 === 0;
            const isEvenCol = col % 2 === 0;

            if (isScacchiera && ((isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol))) {
                fillSquare(squares[i], selectedImage);
            } else if (!isScacchiera) {
                fillSquare(squares[i], selectedImage);
            } else {
                squares[i].innerHTML = '';
                squares[i].removeAttribute('data-color');
            }
        }

        renderTileCount();
        updateSquareMeters();
    }


    function renderTileCount() {
        tileCounter.innerHTML = '';
        let totalCount = 0;

        for (const [imagePath, count] of Object.entries(tileCount)) {
            if (count > 0) {
                const tile = document.createElement('div');
                tile.innerHTML = `<img src="${imagePath}" /> x${count}`;
                tileCounter.appendChild(tile);
                totalCount += count;
            }
        }

        const totalTile = document.createElement('div');
        totalTile.innerHTML = `<strong>Totale:</strong> ${totalCount}`;
        tileCounter.appendChild(totalTile);
    }

    function updateSquareMeters() {
        const selectedTiles = Object.values(tileCount).reduce((acc, val) => acc + val, 0);
        const heightMeters = (selectedTiles * 0.4).toFixed(2);
        document.getElementById('heightMeterCounter').textContent = `Metri quadri: ${heightMeters} m²`;
    }

    const resetButton = document.getElementById('refreshButton');
    resetButton.addEventListener('click', function () {
        resetTileCount();
        rightContainer.childNodes.forEach(square => {
            square.innerHTML = '';
            square.style.backgroundColor = '#000000';
            square.removeAttribute('data-color');
        });
        updateSquareMeters();
    });

    document.getElementById('applyDimensions').addEventListener('click', function () {
        let widthInMeters = parseFloat(document.getElementById('inputWidth').value);
        let heightInMeters = parseFloat(document.getElementById('inputHeight').value);
        let tileSize = parseFloat(document.getElementById('tileSizeSelector').value); // Prendi il valore selezionato

        // Controllo se i valori sono inferiori a 4
        if (widthInMeters < 4 || heightInMeters < 4) {
            alert("Il valore minimo è 4");
            return;
        }

        if (widthInMeters > 40 || heightInMeters > 40) {
            alert("Max 40m");
            return;
        }

        let tilesWidth = Math.ceil(widthInMeters / tileSize); // Usa il valore di tileSize
        let tilesHeight = Math.ceil(heightInMeters / tileSize); // Usa il valore di tileSize
        updateGrid(tilesWidth, tilesHeight);
    });

    function updateGrid(width, height) {
        while (rightContainer.firstChild) {
            rightContainer.removeChild(rightContainer.firstChild);
        }

        rightContainer.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
        rightContainer.style.gridTemplateRows = `repeat(${height}, 1fr)`;

        for (let i = 0; i < width * height; i++) {
            const square = document.createElement('div');
            square.classList.add('color-square');
            square.style.backgroundColor = '#000000';
            square.addEventListener('click', function () {
                applyColor(square);
            });
            rightContainer.appendChild(square);
        }
    }

    function updateSelectedImage() {
        // Aggiorna qualcosa quando viene selezionata un'immagine
    }
});

function applyBorderImage() {
    const cells = rightContainer.querySelectorAll('.color-square');
    const width = maxWidth;
    const height = maxHeight;

    cells.forEach((cell, index) => {
        const row = Math.floor(index / width);
        const col = index % width;

        // Rimuovi eventuali immagini esistenti
        removeBorderAndAngleImages(cell);

        // Se la cella è su un bordo, aggiungi l'immagine del bordo
        if (row === 0 || row === height - 1 || col === 0 || col === width - 1) {
            addBorderImage(cell);
        }
    });
}

function applyAngleImage() {
    const cells = rightContainer.querySelectorAll('.color-square');
    const width = maxWidth;
    const height = maxHeight;

    // Indici delle celle angolari
    const angleIndices = [0, width - 1, width * (height - 1), width * height - 1];
    angleIndices.forEach(index => {
        const cell = cells[index];
        removeBorderAndAngleImages(cell);
        addAngleImage(cell);
    });
}

tileSizeSelector.addEventListener('change', function () {
    tileSize = parseFloat(this.value);
    updateGridBasedOnTileSize();
});

function updateGridBasedOnTileSize() {
    // Qui aggiorni la griglia in base alla dimensione della piastrella selezionata
    const tilesWidth = Math.ceil(parseFloat(document.getElementById('inputWidth').value) / tileSize) || maxWidth;
    const tilesHeight = Math.ceil(parseFloat(document.getElementById('inputHeight').value) / tileSize) || maxHeight;
    updateGrid(tilesWidth, tilesHeight);
}

