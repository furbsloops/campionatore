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

        // Controllo se i valori sono inferiori a 5
        if (widthInMeters < 5 || heightInMeters < 5) {
            alert("Il valore minimo è 5");
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

// Gestione del cambio colore del bordo
const rightContainer = document.getElementById('rightContainer');
const bordiColore = document.querySelectorAll('.bordo-colore');

bordiColore.forEach(el => {
    el.addEventListener('click', function () {
        // Se il colore di sfondo è "none", imposta il bordo come trasparente
        const coloreSelezionato = this.style.backgroundColor === "" ? "transparent" : this.style.backgroundColor;
        rightContainer.style.border = `8px solid ${coloreSelezionato}`;
    });
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

const borderButton = document.getElementById('bordi'); // Assicurati che esista nel tuo HTML
let isBorderMode = false;

borderButton.addEventListener('click', function () {
    isBorderMode = !isBorderMode; // Attiva o disattiva la modalità bordi
    if (isBorderMode) {
        // Cambia lo stile del pulsante o fornisce un feedback visivo
        borderButton.classList.add('active');
    } else {
        borderButton.classList.remove('active');
    }
});

// Questa funzione aggiunge un bordo a un lato di una cella
function addBorder(square, side) {
    if (isBorderMode) {
        square.style['border-' + side] = '2px solid red';
    }
}

// Aggiungi listener per il bordo a tutte le celle esterne
// (questo è un esempio, devi adattarlo alla tua logica di grid)
const externalSquares = getExternalSquares(); // Implementa questa funzione in base alla tua logica
externalSquares.forEach(square => {
    square.addEventListener('click', function (event) {
        const side = getClickedSide(event); // Implementa questa funzione per determinare il lato cliccato
        addBorder(square, side);
    });
});

function addImageBorderToCell(cell, imagePath) {
    const borderImageElement = document.createElement('img');
    borderImageElement.src = imagePath;
    borderImageElement.style.width = '100%';
    borderImageElement.style.height = '100%';
    borderImageElement.style.position = 'absolute';
    borderImageElement.style.top = '0';
    borderImageElement.style.left = '0';

    // Assicurati che la cella sia relativa per posizionare assolutamente l'immagine del bordo
    cell.style.position = 'relative';
    cell.appendChild(borderImageElement);
}

document.addEventListener("DOMContentLoaded", function () {
    // ... il tuo codice esistente ...

    const borderButton = document.getElementById('bordi'); // Assicurati che l'ID corrisponda al tuo bottone
    let isBorderMode = false;

    borderButton.addEventListener('click', function () {
        isBorderMode = !isBorderMode; // Attiva o disattiva la modalità bordi
        this.classList.toggle('active', isBorderMode); // Opzionale: cambia l'aspetto del bottone
    });

    const gridSquares = document.querySelectorAll('.color-square'); // Seleziona tutti i quadrati della griglia
    gridSquares.forEach(square => {
        square.addEventListener('click', function (event) {
            if (isBorderMode) {
                // Determina qui quale bordo aggiungere in base alla posizione del click
                // Ad esempio, potresti aggiungere 'border-top' se il click è vicino al bordo superiore del quadrato
                square.classList.toggle('border-top'); // Questo è solo un esempio
            }
        });
    });

    // Funzione per aggiungere bordi
    function toggleBorder(square) {
        if (isBorderMode) {
            // Controlla se la cella è sul bordo della griglia
            const index = Array.from(rightContainer.children).indexOf(square);
            const width = parseInt(window.getComputedStyle(rightContainer).getPropertyValue('grid-template-columns').split(' ').length);
            const totalSquares = rightContainer.children.length;
            const height = totalSquares / width;

            // Condizioni per le celle sul bordo
            const isFirstRow = index < width;
            const isLastRow = index >= totalSquares - width;
            const isFirstCol = index % width === 0;
            const isLastCol = index % width === width - 1;

            if (isFirstRow || isLastRow || isFirstCol || isLastCol) {
                square.classList.toggle('bordered'); // Aggiungi una classe per gestire il bordo
            }
        }
    }

    // Aggiungi un listener di click a tutte le celle
    rightContainer.addEventListener('click', function (event) {
        const square = event.target.closest('.color-square');
        if (square) {
            toggleBorder(square);
        }

        // Aggiungi questa sezione per la gestione dei bordi
        const borderButton = document.getElementById('bordi');
        let isBorderMode = false;

        borderButton.addEventListener('click', function () {
            isBorderMode = !isBorderMode;
            this.classList.toggle('active', isBorderMode); // Aggiungi una classe per lo styling se necessario
        });

        rightContainer.addEventListener('click', function (event) {
            if (isBorderMode && event.target.classList.contains('color-square')) {
                // Aggiungi il bordo a tutti i lati del quadrato cliccato
                event.target.classList.toggle('border-active');
            }

            // ... il tuo codice esistente ...

            const borderButton = document.getElementById('bordi');
            let isBorderMode = false;

            borderButton.addEventListener('click', function () {
                isBorderMode = !isBorderMode;
                this.classList.toggle('active', isBorderMode);
            });

            function toggleBorder(square) {
                // Verifica se la cella è sul bordo della griglia
                const cells = rightContainer.getElementsByClassName('color-square');
                const index = Array.from(cells).indexOf(square);
                const numRows = rightContainer.style.gridTemplateRows.split(' ').length;
                const numCols = rightContainer.style.gridTemplateColumns.split(' ').length;
                const row = Math.floor(index / numCols);
                const col = index % numCols;

                // Applica il bordo solo se la cella è su un bordo esterno
                if (row === 0 || row === numRows - 1 || col === 0 || col === numCols - 1) {
                    square.classList.toggle('bordered');
                }
            }

            rightContainer.addEventListener('click', function (event) {
                if (isBorderMode) {
                    const square = event.target.closest('.color-square');
                    if (square) {
                        toggleBorder(square);
                    }
                }
                const borderButton = document.getElementById('bordi');
                let isBorderMode = false;

                borderButton.addEventListener('click', function () {
                    isBorderMode = !isBorderMode;
                    // Aggiungi qui il codice per cambiare l'aspetto del bottone se necessario, ad esempio:
                    // this.classList.toggle('active', isBorderMode);
                });

                rightContainer.addEventListener('click', function (event) {
                    if (isBorderMode && event.target.classList.contains('color-square')) {
                        // Qui aggiungi la logica per determinare se la cella cliccata è sul bordo.
                        // Ciò potrebbe richiedere di conoscere la posizione della cella nella griglia.
                        // Aggiungi poi la classe 'bordered' alla cella cliccata se è sul bordo.
                        event.target.classList.toggle('bordered');
                    }
                });




            });

            // ... il resto del tuo codice ...

        });

    });

    // Altri codici...
});




