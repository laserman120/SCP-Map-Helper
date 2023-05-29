//Define global vars 

//this will be used to keep track of the image last hovered over
let currentSelectedImage = null
let grid
let buttonHeight
let buttonWidth

//Which version of the game is being mapped? This will be changed to a selector later on
let gameVersion = "SCP-SB"

//define all global vars adjusted depending on game type
let numRows = null
let numCols = null

let heavyZoneRow = null
let entranceZoneRow = null
let gameDataFolder = null

let spawnRoomRow = null
let spawnRoomCol = null

//To check if the mouse is on top of any cell
let isMouseHover = false
let cellSize = null;

//run the setup function on start
setup()

function setup(){
    if(gameVersion == "SCP-SB"){
        //define settings for this game type
        numRows = 19;
        numCols = 19;
    
        //setup the rows of the transitions. -2 because of the Start Room and then to account for the tansition rooms itself
        heavyZoneRow = numRows -2 - 4
        // -3 because of the added heavy transition
        entranceZoneRow = numRows - 3 - 4 - 5
        //Where to look for relevant files/images
        gameDataFolder = "./gameTypes/SCP-SB/"
        //Where the spawn room is located
        spawnRoomRow = numRows-1
        spawnRoomCol = Math.floor(numCols/2)
    }
    
    
    //setup the grid and container
    grid = new Array(numRows).fill(null).map(() => new Array(numCols).fill(null));
    const container = document.getElementById('container');
    
    // Add double-click event listener to container
    container.addEventListener('dblclick', async function () {
        // Find the currently highlighted cell and remove the highlight class
        const highlightedCell = document.querySelector('.highlight');
    
        //Is the mouse on top of a cell? if so return
        if (isMouseHover == true) return
        //Is it highlighted? Yes? Remove it again
        if (highlightedCell) {
            highlightedCell.classList.remove('highlight');
        }   
        //remove images from card
        removeImagesFromCard()
    })  
    
    document.addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {
            selectFirstImage()
        }
    });
    
    //check window size, if smaller than 1080p make it 1080p
    let windowWidth = window.innerWidth < 1200 ? 1200 : window.innerWidth;
    let windowHeight = window.innerHeight < 950 ? 950 : window.innerHeight;
    
    //calculate the size of cells, buttons, container etc
    //Create container Size
    const containerWidth = windowWidth*0.95
    const containerHeight = windowHeight*0.95
    let containerSize = null
    
    //check if the cell can be bigger than default
    cellSize = containerWidth < containerHeight ? containerWidth/numRows : containerHeight/numCols;
    
    if(cellSize < 50) {
        cellSize = 50
    }
    
    containerSize = numRows * cellSize
    
    //set the cellSize
    document.documentElement.style.setProperty('--cellSize', cellSize + "px");
    
    //set button sizes
    buttonHeight = cellSize / 5
    buttonWidth = cellSize / 3.5
    
    //Change the appropriate variables
    document.documentElement.style.setProperty('--buttonHeight', buttonHeight + "px");
    document.documentElement.style.setProperty('--buttonWidth', buttonWidth + "px");
    
    //Area Size for the container
    //container.style.height = numRows * cellSize + 'px';
    document.documentElement.style.setProperty('--containerHeight', containerSize + "px");
    document.documentElement.style.setProperty('--containerWidth', containerSize + "px");
    
    //calculate the Size of the cardMenu
    let cardMenuWidth = (windowWidth*0.98 - numCols * cellSize) / 2
    document.documentElement.style.setProperty('--cardMenuWidth', cardMenuWidth + "px");
    
    let cardMenuHeight = (containerSize)
    document.documentElement.style.setProperty('--cardMenuHeight', cardMenuHeight + "px");
    
    //calculate card menu Position
    const cardMenuRight = ((windowWidth*0.95 - containerSize) / 2 - cardMenuWidth);
    //set the postion
    const inputWidth = cardMenuWidth*0.8
    const inputHeight = cardMenuWidth*0.4
    
    //Set The Variables for the card Menu
    document.documentElement.style.setProperty('--cardMenuRight', cardMenuRight + 'px');
    
    //set the variables for the info menu
    document.documentElement.style.setProperty('--infoMenuLeft', cardMenuRight + 'px');
    document.documentElement.style.setProperty('--infoMenuWidth', cardMenuWidth + "px");
    document.documentElement.style.setProperty('--infoMenuHeight', containerSize + "px");
    
    // create the buttos to save and load
    // Create Save Map button
    const saveMapBtn = document.createElement("button");
    saveMapBtn.innerText = "Save Map";
    saveMapBtn.onclick = () => {
    const mapName = prompt("Enter map name:");
    if (mapName) {
        storeMap(mapName);
    }
    };
    
    // Create Spoilers checkbox
    const spoilersCheckbox = document.createElement("input");
    spoilersCheckbox.type = "checkbox";
    spoilersCheckbox.id = "spoilersCheckbox";
    
    //when checked, reload the currently shown one
    spoilersCheckbox.addEventListener("change", () => {
        if(currentSelectedImage) getImageInfo(currentSelectedImage)
    });
    
    // Create Spoilers label
    const spoilersLabel = document.createElement("label");
    spoilersLabel.innerHTML = "Spoilers";
    spoilersLabel.htmlFor = "spoilersCheckbox";
    
    // Create container for the label and checkbox
    const spoilersContainer = document.createElement("div");
    spoilersContainer.classList.add("spoilers-container");
    //Hover text
    spoilersContainer.title = "Check this box to allow the info text to spoiler you, this includes further information as well as items";
    spoilersContainer.appendChild(spoilersLabel);
    spoilersContainer.appendChild(spoilersCheckbox);
    
    // Center the spoilers container above the checkbox
    spoilersContainer.style.display = "flex";
    spoilersContainer.style.flexDirection = "column";
    spoilersContainer.style.alignItems = "center";
    
    // Create Restore Map button
    const restoreMapBtn = document.createElement("button");
    restoreMapBtn.innerText = "Load Map";
    restoreMapBtn.onclick = () => {
        if (window.confirm("This will reset the current map to load a previously created map")) {
            regenerateMap();
        }
    };

    const openSettingsButton = document.createElement("settingsButton");
    openSettingsButton.innerText = "Settings";
    openSettingsButton.onclick = () => {

            enableSettingsPopup();

    };

    const closeSettingsButton = document.createElement("settingsButton");
    closeSettingsButton.innerText = "Close";
    closeSettingsButton.onclick = () => {

            disableSettingsPopup();

    };
    
    //create the info menu
    
    //add container for the text information and add it to the infoMenu
    const infoBox = document.createElement('div');
    infoBox.id = "infoBox"
    infoBox.style.fontSize = '20px';
    infoBox.classList.add('infoBox');
    
    infoMenu.appendChild(infoBox);
    
    // Create container for info buttons and append them to it
    const infoButtonsContainer = document.createElement('div');
    infoButtonsContainer.classList.add('info-buttons');
    
    infoButtonsContainer.appendChild(openSettingsButton);

    const settingsPopup = document.getElementById("settingsPopup")
    settingsPopup.appendChild(saveMapBtn);
    settingsPopup.appendChild(spoilersContainer);
    settingsPopup.appendChild(restoreMapBtn);
    settingsPopup.appendChild(closeSettingsButton);

    // Add delete buttons container to the card
    infoMenu.appendChild(infoButtonsContainer);
    
    //set the proper height of the infoBox to prevent clipping into the buttons
    document.documentElement.style.setProperty('--infoBoxBottomMar', infoButtonsContainer.offsetHeight + "px");
    
    //get the true size of the container
    let buttonBoxTrueSize = spoilersContainer.offsetWidth + restoreMapBtn.offsetWidth + saveMapBtn.offsetWidth
    //check if its too big, if so then set it to row
    if (infoBox.offsetWidth < buttonBoxTrueSize) {
        infoButtonsContainer.style.flexDirection = 'column';
    } else {
        infoButtonsContainer.style.flexDirection = 'row';
    }
    
    //Setup the card menu
    // Create search input field
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = "inputField"
    searchInput.placeholder = 'Search rooms...';
    //listen for input changes
    searchInput.addEventListener('input', function() {
        // Define function to filter images based on search term
        function filterImages(searchTerm) {
            // Loop through each icon image and show/hide based on search term
            const iconImages = cardMenu.querySelectorAll('img');
            //check each image for the search term
            iconImages.forEach(function(img) {
                if (img) {
                    const altNames = img.alt.split(',').map(function(name) {
                        return name.trim().toLowerCase();
                    });
                    const showImage = altNames.some(function(name) {
                        return name.includes(searchTerm);
                    });
                    img.style.display = showImage ? 'block' : 'none';
                }
            });
        }
    
        // Listen for input changes on search field
        searchInput.addEventListener('input', function() {
            const searchTerm = searchInput.value.toLowerCase();
            filterImages(searchTerm);
        });
    
        // Show all images initially
        filterImages('');
    })
    
    cardMenu.appendChild(searchInput);
    
    //delete cell button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-cell');
    deleteButton.innerText = 'Delete Cell';
    deleteButton.addEventListener('click', function () {
        const cellRC = getHighlightedCell()
        if(!cellRC) return;
        deleteCell(grid, cellRC[0], cellRC[1])
        removeImagesFromCard
    });
    
    //remove image button
    const removeImageButton = document.createElement('button');
    removeImageButton.classList.add('delete-image');
    removeImageButton.innerText = 'Delete Image';
    removeImageButton.addEventListener('click', function () {
        const cellRC = getHighlightedCell()
        if(!cellRC) return;
        removeIconInCell(cellRC[0], cellRC[1])
    });
    
    // Create container for delete buttons and append them to it
    const deleteButtonsContainer = document.createElement('div');
    deleteButtonsContainer.classList.add('delete-buttons');
    deleteButtonsContainer.appendChild(deleteButton);
    deleteButtonsContainer.appendChild(removeImageButton); // <--- changed from deleteImageButton
    
    // Add delete buttons container to the card
    cardMenu.appendChild(deleteButtonsContainer);
    
    //get the true size of the container
    let cardButtonsTrueSize = removeImageButton.offsetWidth + deleteButtonsContainer.offsetWidth
    
    //check if its too big, if so then set it to row
    if (cardMenu.offsetWidth < cardButtonsTrueSize) {
        deleteButtonsContainer.style.flexDirection = 'row';
    } else {
        deleteButtonsContainer.style.flexDirection = 'column';
    }
    
    //setup imageBox
    const imageBox = document.createElement('div');
    imageBox.classList.add('imageBox');
    imageBox.id = "imageBox"
    
    cardMenu.appendChild(imageBox);
    
    document.documentElement.style.setProperty('--ImageBoxBottomMar', deleteButtonsContainer.offsetHeight + "px");
    document.documentElement.style.setProperty('--ImageBoxTopMar', searchInput.offsetHeight * 1.10 + "px");
    
    //set the max size of an image
    document.documentElement.style.setProperty('--imageMaxSizeWidth', cellSize + 'px');
    
    //Check for arrow key inputs
    document.addEventListener('keydown', function(event) {
        if (event.repeat) { return }
        const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        //check if control was held down during the event
        let controlDown = 0
        if(event.ctrlKey){
            controlDown = 1
        }
        switch (key) {
            case "ArrowLeft":
                // Left pressed
                moveHighlight("left", controlDown)
                break;
            case "ArrowRight":
                // Right pressed
                moveHighlight("right", controlDown)
                break;
            case "ArrowUp":
                // Up 
                moveHighlight("up", controlDown)
                break;
            case "ArrowDown":
                // Down pressed
                moveHighlight("down", controlDown)
                break;
        }
    });
    
}

//For testing
//enableSettingsPopup()

function enableSettingsPopup() {
    var popup = document.getElementById("settingsPopup");
    var popupBG = document.getElementById("popupBackground");
    popup.classList.add("show");
    popupBG.classList.add("showBG");
}

function disableSettingsPopup(){
    var popup = document.getElementById("settingsPopup");
    var popupBG = document.getElementById("popupBackground");
    popup.classList.remove("show");
    popupBG.classList.remove("showBG");
}

//Place the first cell
addCell(spawnRoomRow, spawnRoomCol);
//Add the highlight on the first cell
grid[spawnRoomRow][spawnRoomCol].classList.add('highlight');
//recolor the first cell on the top
recolorButtons(spawnRoomRow, spawnRoomCol, [1, null, null, null], "green")

//self explanatory i think
function getCell(row, col) {
    return grid[row][col];
}

async function refreshImages(){

    removeImagesFromCard()

    const cellRC = getHighlightedCell()

    const cell = getCell(cellRC[0], cellRC[1])
    let row = cellRC[0]
    let col = cellRC[1]

    if(row == heavyZoneRow || row == entranceZoneRow ) return
    if((row == spawnRoomRow && col == spawnRoomCol)) return
        


    //gives back the room type (deadEnd, Straight, Turn, TTurn, XTurn) as well as the orientation of the room type (1 = top, 2 = right, 3 = bottom, 4 = left)
    const entrance = checkEntrance(cellRC[0], cellRC[1])

    let imageNames = await fetchImageNames()

    // Add all images that should be shown
    for (let i = 0; i < imageNames.length; i++) {
        
        const img = document.createElement('img');
        img.id = "img"
        img.src = gameDataFolder + 'icons/' + imageNames[i].name + '.png';
        let roomImage = gameDataFolder + 'roomImages/' + imageNames[i].name + '.png';
        // Set the alt attribute of the image
        img.alt = imageNames[i].alt.join(', ');
        img.addEventListener('click', function () {
            // Remove existing image if present
            removeIconInCell(row, col)
            

            // Create new image and add to cell
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;
            newImg.classList.add('icon');
            cell.appendChild(newImg);
            addImageHover(newImg)

            placeImageIntoCellContainer(row, col, roomImage)
        });

        imageBox.appendChild(img);
        //Hover to get additional information about the room
        addImageHover(img)
        focusInput()
    }
}

function removeIconInCell(row, col){
    let cell = getCell(row, col)

    if (cell.querySelector('img')) {
        cell.querySelector('img').remove();

        const imageContainer = document.getElementsByClassName("imageContainer " + "R" + row + "C" + col)[0]
        let foundData = imageContainer.className.split("data")[1]
        console.log(foundData)
        imageContainer.classList.remove("data" + foundData);
        reloadCell(row, col)
    }
}

async function fetchImageNames(){

    const cellRC = getHighlightedCell()

    const cell = getCell(cellRC[0], cellRC[1])

    //gives back the room type (deadEnd, Straight, Turn, TTurn, XTurn) as well as the orientation of the room type (1 = top, 2 = right, 3 = bottom, 4 = left)
    const entrance = checkEntrance(cellRC[0], cellRC[1])

    //image names is generated depending on which room is selected
    let imageNames = []

    //if there is no entrance, return
    if(!entrance) return;
    // Define image names and their alternative names
    switch (entrance[0]) {
        case "deadEnd":
            await fetch(gameDataFolder + 'rooms/deadEnd.json')
            .then(response => response.json())
            .then(rooms => {
                // After fetching the data store the data into imageNames
                imageNames = rooms
            })
            .catch(error => console.error(error));
            break;
        case "straight":
            await fetch(gameDataFolder + 'rooms/straight.json')
            .then(response => response.json())
            .then(rooms => {
                imageNames = rooms
            })
            .catch(error => console.error(error));
            break;
        case "turn":
            await fetch(gameDataFolder + 'rooms/turn.json')
            .then(response => response.json())
            .then(rooms => {
                imageNames = rooms
            })
            .catch(error => console.error(error));
            break
        case "TTurn":
            await fetch(gameDataFolder + 'rooms/TTurn.json')
            .then(response => response.json())
            .then(rooms => {
                imageNames = rooms
            })
            .catch(error => console.error(error));
            break
        case "XTurn":
            await fetch(gameDataFolder + 'rooms/XTurn.json')
            .then(response => response.json())
            .then(rooms => {
                imageNames = rooms
            })
            .catch(error => console.error(error));
            break
        default:
            break;
    }
    return(imageNames)
}

function removeImagesFromCard(){
    //delete all existing images
    const allImages = Array.from(document.getElementById("imageBox").getElementsByTagName('img'))

    if(allImages.length !== 0){
        for (let i = 0; i < allImages.length; i++) {
            const imageToDelete = allImages[i]
            imageToDelete.remove()
        }
    }
}

//selects the first image currently visible in the card and places it into the cell
async function selectFirstImage(){
    //get all images in the card
    const allImages = Array.from(document.getElementById("imageBox").getElementsByTagName('img'))
    if(!allImages) return;

    let remainingImages = []
    //add only images shown into the array
    for (let i = 0; i < allImages.length; i++) {
        if(allImages[i].style.display == "none") continue;

        remainingImages.push(allImages[i]);
        
    }

    //get the first shown images in the list
    let img = remainingImages[0]
    let cellRC = getHighlightedCell()
    let cell = getCell(cellRC[0], cellRC[1])
    let imageNames = await fetchImageNames()

    // Remove existing image if present
    if (cell.querySelector('img')) {
        cell.querySelector('img').remove();
    }

    let orientationCheck = imageNames[0]?.orientation
    //if there is a forced layout present, generate or remove rooms adjacent
    if(orientationCheck) generateCellsFromOrientationArray(row, col, imageNames[i].orientation);
    

    // Create new image and add to cell
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt;
    newImg.classList.add('icon');
    cell.appendChild(newImg);
    addImageHover(newImg)
}

async function placeImageIntoCellContainer(row, col, roomImage){
    //get the container of the cell
    const cell = document.getElementsByClassName("imageContainer " + "R" + row + "C" + col)[0]
    const img = document.createElement('img');
    let cellData = checkEntrance(row, col)
    cell.classList.add("data" + cellData[0]);
    img.src = roomImage;
    cell.style.backgroundImage = 'url(' + img.src + ')';   
}


//add a cell
function addCell(row, col) {
    //Check if it would be out of bounds
    if (row >= 0 && row < numRows && col >= 0 && col < numCols && !grid[row][col]) {
        grid[row][col] = document.createElement('div');
        //remove leading zeros || Not sure why but yes
        col = parseInt(col,10);
        row = parseInt(row,10);

        grid[row][col].className = "cell " + "R" + row + "C" + col;
        //positioning
        grid[row][col].style.top = row * cellSize + 'px';
        grid[row][col].style.left = col * cellSize + 'px';

        // Add double-click event listener to cell
        //if it is the row of heavy or entrance row, do not add the listener
        //also figure out how to get these checks into a single line, this is stupid
                grid[row][col].addEventListener('dblclick', function (event) {

                    //delete cell if the user double clicks while pressing ctrl
                    if(event.ctrlKey){
                        deleteCell(grid, row, col)
                        return
                    }

                    // Find the currently highlighted cell and remove the highlight class
                    const highlightedCell = document.querySelector('.highlight');
                    //Is it highlighted? Yes? Remove it again
                    if (highlightedCell) {
                        highlightedCell.classList.remove('highlight');
                    }           
                    //Add highlight after the double click
                    grid[row][col].classList.add('highlight');
                    //open the card
                    refreshImages();
                });

        //add mouseover event to check if the mouse is currently on top of any cell
        //check if it left the cell
        grid[row][col].addEventListener("mouseleave", function (event) {
            isMouseHover = false
        });
        //check if it is on the cell
        grid[row][col].addEventListener("mouseover", function (event) {
            isMouseHover = true
        })
        container.appendChild(grid[row][col]);

        //The button creation is handled pretty dumb, maybe rework that to run by generating an array that defines where a button should be made
        //Create the buttons on the sides
        if(row > 0){
            createButton('top', row, col);
        };
        if(col < numCols - 1 && (row !== heavyZoneRow && row !== entranceZoneRow)){
            createButton('right', row, col);
        };
        //prevent all rooms in the first line to create top buttons, except the one up from spawn
        if(row == spawnRoomRow - 1 && col == spawnRoomCol){
            createButton('bottom', row, col);
        };
        if(row < spawnRoomRow - 1){
            createButton('bottom', row, col);
        };
        if(col > 0 && (row !== heavyZoneRow && row !== entranceZoneRow)){
            createButton('left', row, col);
        };  

        //add the image container for the image later on
        let imageContainer = document.createElement("div");
        imageContainer.className = "imageContainer " + "R" + row + "C" + col;

        grid[row][col].appendChild(imageContainer)


    }
}

//Adds the buttons onto a cell
function createButton(direction, row, col) {
    const button = document.createElement('button');
    //check if it is the first room, if so place only the top button
    if(row == spawnRoomRow && col == spawnRoomCol){
        button.className = 'button ' + "top";
        button.style.position = 'absolute';
        button.style.top = '6px';
        button.style.left = '50%';
        direction = "top"
    }else{
        //place the buttons, but check if you would move out of bounds, then dont
        switch (direction) {
            case 'top':
            if (row > 0) {
                button.className = 'button ' + direction;
                button.style.position = 'absolute';
                button.style.top =  buttonHeight / 2 + "px";
                button.style.left = '50%';
            }
            break;
            case 'right':
            if (col < numCols - 1) {
                button.className = 'button ' + direction;
                button.style.position = 'absolute';
                button.style.top = '50%';
                button.style.right = buttonHeight / 2 + "px";
            }
            break;
            case 'bottom':
            if (row < numRows - 1) {
                button.className = 'button ' + direction;
                button.style.position = 'absolute';
                button.style.bottom = buttonHeight / 2 + "px";
                button.style.left = '50%';
            }
            break;
            case 'left':
            if (col > 0) {
                button.className = 'button ' + direction;
                button.style.position = 'absolute';
                button.style.top = '50%';
                button.style.left = buttonHeight / 2 + "px";
            }
        }
    }

    //Check for button click
    button.addEventListener('click', function () {

        //when the button is pressed while the cell is highlighted, force a refresh of the images after the repaint
        const highlightedCellRC = getHighlightedCell()
        let forceRefresh = 0
        if(highlightedCellRC && (row == highlightedCellRC[0] && col == highlightedCellRC[1])){
            forceRefresh = 1 
        }

        //get the button to check its current color
        var style = getComputedStyle(button);
        let buttonColor = style['background-color']
        if(buttonColor !== "rgb(0, 128, 0)"){
            //If the color is not green then make it green and proceed here
            switch (direction) {
                case 'top':
                    addCell(row - 1, col, "top");
                    button.style.backgroundColor = 'green';
                    recolorNeighboringButtons(direction, row, col, "green")
                    if(forceRefresh == 1) refreshImages();
                break;
                case 'right':
                    addCell(row, col + 1, "right");
                    button.style.backgroundColor = 'green';
                    recolorNeighboringButtons(direction, row, col, "green")
                    if(forceRefresh == 1) refreshImages();                        
                break;
                case 'bottom':
                    addCell(row + 1, col, "bottom");
                    button.style.backgroundColor = 'green';
                    recolorNeighboringButtons(direction, row, col, "green")
                    if(forceRefresh == 1) refreshImages();                   
                break;
                case 'left':
                    addCell(row, col - 1, "left");
                    button.style.backgroundColor = 'green';
                    recolorNeighboringButtons(direction, row, col, "green")
                    if(forceRefresh == 1) refreshImages();
                break;
            }
        }else{
            //if it is green then make it 
            switch (direction) {
            case 'top':
                button.style.backgroundColor = 'gray';
                recolorNeighboringButtons(direction, row, col, "gray")
            break;
            case 'right':
                button.style.backgroundColor = 'gray';
                recolorNeighboringButtons(direction, row, col, "gray")
            break;
            case 'bottom':
                button.style.backgroundColor = 'gray';
                recolorNeighboringButtons(direction, row, col, "gray")
            break;
            case 'left':
                button.style.backgroundColor = 'gray';
                recolorNeighboringButtons(direction, row, col, "gray")
            break;
            }
        }

        //remove the current image from cell
        removeIconInCell(row, col)
    })
getCell(row, col).appendChild(button);
}
    
//recoloring neighboring and itself is pretty much the same code apart from direction. This should be streamlined, rework recolorButtons to accept the neighboring input if a direction is given
function recolorNeighboringButtons(direction, row, col, color){
    let neighboringCell = null
    let neighboringButton = null
    switch(direction){
        case "top":
            //Find the correct neighboring cell
            neighboringCell = document.getElementsByClassName("cell " + "R" +  (row - 1) + "C" + col)[0]
            if(neighboringCell){
            //Find the correct button next to the current one
            neighboringButton = neighboringCell.getElementsByClassName("button bottom")[0]
            //recolor it
            neighboringButton.style.backgroundColor = color;

            reloadCell((row - 1), col)
            }
            reloadCell(row, col)

        break;
        case "bottom":
            neighboringCell = document.getElementsByClassName("cell " + "R" + (row + 1) + "C" + col)[0]
            if(neighboringCell){
                neighboringButton = neighboringCell.getElementsByClassName("button top")[0]
                neighboringButton.style.backgroundColor = color;
                reloadCell((row + 1), col)
            }
            reloadCell(row, col)

        break;
        case "right":
            neighboringCell = document.getElementsByClassName("cell " + "R" + row + "C" + (col + 1) )[0]
            if(neighboringCell){
                neighboringButton = neighboringCell.getElementsByClassName("button left")[0]
                neighboringButton.style.backgroundColor = color;
                reloadCell(row, (col+1))
            }
            reloadCell(row, col)
        break;
        case "left":
            neighboringCell = document.getElementsByClassName("cell " + "R" + row +  "C" + (col - 1) )[0]
            if(neighboringCell){
                neighboringButton = neighboringCell.getElementsByClassName("button right")[0]
                neighboringButton.style.backgroundColor = color;
                reloadCell(row, (col-1))
            }
            reloadCell(row, col)
            
        break;
    }
}

function recolorButtons(row, col, buttonArray, color){
        let recoloringCell = null
        let recoloringButton = null
            if(buttonArray[0] == 1){
                //Find the correct neighboring cell
                recoloringCell = document.getElementsByClassName("cell " + "R" + row + "C" + col)[0]
                if(recoloringCell){
                    //Find the correct button next to the current one
                    recoloringButton = recoloringCell.getElementsByClassName("button top")[0]
                    //recolor it
                    recoloringButton.style.backgroundColor = color;
                }

                reloadCell(row, col)

            }
            if(buttonArray[1] == 1){
           
                recoloringCell = document.getElementsByClassName("cell " + "R" + row + "C" + col)[0]
                if(recoloringCell){
                    recoloringButton = recoloringCell.getElementsByClassName("button right")[0]
                    recoloringButton.style.backgroundColor = color;
                }
 
                reloadCell(row, col)

            }
            if(buttonArray[2] == 1){
           
                recoloringCell = document.getElementsByClassName("cell " + "R" + row + "C" + col )[0]
                if(recoloringCell){
                    recoloringButton = recoloringCell.getElementsByClassName("button bottom")[0]
                    recoloringButton.style.backgroundColor = color;
                }

                reloadCell(row, col)

            }
            if(buttonArray[3] == 1){
                recoloringCell = document.getElementsByClassName("cell " + "R" + row + "C" + col )[0]
                if(recoloringCell){
                    recoloringButton = recoloringCell.getElementsByClassName("button left")[0]
                    recoloringButton.style.backgroundColor = color;
                }

                reloadCell(row, col)
            } 
}

//reloads the specified cell
function reloadCell(row, col){

    //create the image to be placed in the cell as background
    const img = document.createElement('img');
    //specify the cell to place the image into
    const cell = document.getElementsByClassName("imageContainer " + "R" + row + "C" + col)[0]
    //reset the rotation before transforming again
    cell.style.transform = 'rotate(0deg)';
    //Specify the image location
    const baseImageLoc = gameDataFolder + 'baseImages/'

    //Spawn room always gets this image
    if(row == spawnRoomRow && col == spawnRoomCol){
        img.src = baseImageLoc + "deadEnd" + '.png';
        cell.style.backgroundImage = 'url(' + img.src + ')';
        return
    }

    //rooms at row 14 are heavy doors, always a certain image
    if(row == heavyZoneRow ){
        img.src = baseImageLoc + "straightHeavyContainment" + '.png'; 
        cell.style.backgroundImage = 'url(' + img.src + ')';
        return
    }

    //rooms at row 8 are entrance doors, always a certain image
    if(row == entranceZoneRow
     ){
        img.src = baseImageLoc + "straightEntrance" + '.png'; 
        cell.style.backgroundImage = 'url(' + img.src + ')';
        return
    }
    
    let setImage;
    let rotation;

    //get the room data
    let entranceData = checkEntrance(row, col)

    switch (entranceData[1]) {
        case 1:
            rotation = 0
        break;
        case 2:
            rotation = 90
        break;
        case 3:
            rotation = 180
        break;
        case 4:
            rotation = 270
        break;
    }
    let foundData = cell.className.split("data")[1]

    if(foundData !== entranceData[0]){

        cell.classList.remove("data" + foundData);
        //This switch checks every possible layout set above
        switch(entranceData[0]){
            //Turn Cases (4)
            case "deadEnd":
                setImage = baseImageLoc + "deadEnd" + '.png';
            break;
            //Straight Cases (2)
            case "straight":
                setImage = baseImageLoc + "straight" + '.png';
            break;
            //Turn Cases (4)
            case "turn":
                setImage = baseImageLoc + "turn" + '.png';
            break;
            //T Turn Cases (4)
                case "TTurn":
                setImage = baseImageLoc + "Tturn" + '.png';
            break;
            //X Turn Cases (4)
            case "XTurn":
                setImage = baseImageLoc + "Xturn" + '.png';
            break;
            case "none":
                setImage = baseImageLoc + "none" + '.png';
            break;
        }

        img.src = setImage
        cell.style.backgroundImage = 'url(' + img.src + ')'; 
    }

    //always rotate back
    cell.style.transform = "rotate(" + rotation + "deg)";




}

//gives back the room type (deadEnd, Straight, Turn, TTurn, XTurn) as well as the orientation of the room type (1 = top, 2 = right, 3 = bottom, 4 = left)
function checkEntrance(row, col){
//Specify the 4 possible directions a door can be
let directions = [null, null, null, null]
    //get the current cell to reload
    let reloadingCell = document.getElementsByClassName("cell " + "R" + row + "C" + col)[0]
    //find all the buttons in the cell
    let buttonTopCheck = reloadingCell.querySelector(".button.top");
    let buttonRightCheck = reloadingCell.querySelector(".button.right");
    let buttonBottomCheck = reloadingCell.querySelector(".button.bottom");
    let buttonLeftCheck = reloadingCell.querySelector(".button.left");

    //check each button if it even exists
    if (buttonTopCheck) {
        //Find the current color
        buttonTopCheck = getComputedStyle(reloadingCell.getElementsByClassName("button top")[0])
        let buttonTopCheckColor = buttonTopCheck['background-color']
        //check if the color is green, if so add it to the directions
        if(buttonTopCheckColor == "rgb(0, 128, 0)") directions[0] = 1
    }
    if (buttonRightCheck) {
        let buttonRightCheck = getComputedStyle(reloadingCell?.getElementsByClassName("button right")[0]) ?? null;
        let buttonRightCheckColor = buttonRightCheck['background-color']
     if(buttonRightCheckColor == "rgb(0, 128, 0)") directions[1] = 1
    }
    if (buttonBottomCheck) {
        let buttonBottomCheck = getComputedStyle(reloadingCell?.getElementsByClassName("button bottom")[0]) ?? null;
        let buttonBottomCheckColor = buttonBottomCheck['background-color']
        if(buttonBottomCheckColor == "rgb(0, 128, 0)") directions[2] = 1
    }
    if (buttonLeftCheck) {
        let buttonLeftCheck = getComputedStyle(reloadingCell?.getElementsByClassName("button left")[0]) ?? null;
        let buttonLeftCheckColor = buttonLeftCheck['background-color']
        if(buttonLeftCheckColor == "rgb(0, 128, 0)") directions[3] = 1
    }

    //Specify possible room layouts depending on the door locations
    let none = [null, null, null, null]
    const deadEnd = [[1, null, null, null],[null, 1, null, null],[null, null, 1, null],[null, null, null, 1]]
    const imageStraight = [[1, null, 1, null],[null, 1, null, 1]]
    const imageTurn = [[1, 1, null, null],[null, 1, 1, null],[null, null, 1, 1],[1, null, null, 1]]
    const TTurn = [[1, 1, 1, null],[null, 1, 1, 1],[1, null, 1, 1],[1, 1, null, 1]]
    const XTurn = [1, 1, 1, 1]

    //This switch checks every possible layout set above
    switch(directions.toString()){
        case none.toString():
            return ["none", 1]
        //Turn Cases (4)
        case deadEnd[0].toString():
            return ["deadEnd", 1]
        case deadEnd[1].toString():
            return ["deadEnd", 2]
        case deadEnd[2].toString():
            return ["deadEnd", 3]
        case deadEnd[3].toString():
            return ["deadEnd", 4]
        //Straight Cases (2)
        case imageStraight[0].toString():
            return ["straight", 1]
        case imageStraight[1].toString():
            return ["straight", 2]    
        //Turn Cases (4)
        case imageTurn[0].toString():
            return ["turn", 1]
        case imageTurn[1].toString():
            return ["turn", 2]
        case imageTurn[2].toString():
            return ["turn", 3]
        case imageTurn[3].toString():
            return ["turn", 4]
        //T Turn Cases (4)
        case TTurn[0].toString():
            return ["TTurn", 1]
        case TTurn[1].toString():
            return ["TTurn", 2]
        case TTurn[2].toString():
            return ["TTurn", 3]
        case TTurn[3].toString():
            return ["TTurn", 4]
        //X Turn Cases (4)
        case XTurn.toString():
            return ["XTurn", 1]
    }
}

//this adds the hover to an img
async function addImageHover(img){
    img.addEventListener('mouseover', (event) => {
        // Get the alt attribute of the image
        const alt = event.target.alt;
        //get the first name in the alt list
        let firstAlt = alt.split(',')[0]
        //send it over to fetch the correct file to read from
        currentSelectedImage = firstAlt
        getImageInfo(firstAlt)
    });
}

//delete a certain cell
function deleteCell(grid, row, col) {
  const cell = grid[row][col]
  //When the cell exists delete it and recolor neighboring buttons
  if (cell) {
    //Recolor any neighboring cell to gray to delete the existing entrance
    recolorNeighboringButtons("top", row, col, "gray")
    recolorNeighboringButtons("right", row, col, "gray")
    recolorNeighboringButtons("bottom", row, col, "gray")
    recolorNeighboringButtons("left", row, col, "gray")
    cell.remove();
    grid[row][col] = null;
  }
}

//returns an array with the following data (row, col,[null,null,null,null], image) if the cell does not exist return "null"
function returnCellData(row, col){
    const cell = grid[row][col]
    if(cell){
    
        let currentCell = getCell(row, col)
        let directions = [null, null, null, null]
        let imageElement = null

        let buttonTopCheck = currentCell.querySelector(".button.top");
        let buttonRightCheck = currentCell.querySelector(".button.right");
        let buttonBottomCheck = currentCell.querySelector(".button.bottom");
        let buttonLeftCheck = currentCell.querySelector(".button.left");


        //check each button if it even exists
        if (buttonTopCheck) {
            //Find the current color
            buttonTopCheck = getComputedStyle(currentCell?.getElementsByClassName("button top")[0])
            let buttonTopCheckColor = buttonTopCheck['background-color']
            //check if the color is green, if so add it to the directions
            if(buttonTopCheckColor == "rgb(0, 128, 0)") directions[0] = 1
        }
        if (buttonRightCheck) {
            let buttonRightCheck = getComputedStyle(currentCell?.getElementsByClassName("button right")[0]) ?? null;
            let buttonRightCheckColor = buttonRightCheck['background-color']
        if(buttonRightCheckColor == "rgb(0, 128, 0)") directions[1] = 1
        }
        if (buttonBottomCheck) {
            let buttonBottomCheck = getComputedStyle(currentCell?.getElementsByClassName("button bottom")[0]) ?? null;
            let buttonBottomCheckColor = buttonBottomCheck['background-color']
            if(buttonBottomCheckColor == "rgb(0, 128, 0)") directions[2] = 1
        }
        if (buttonLeftCheck) {
            let buttonLeftCheck = getComputedStyle(currentCell?.getElementsByClassName("button left")[0]) ?? null;
            let buttonLeftCheckColor = buttonLeftCheck['background-color']
            if(buttonLeftCheckColor == "rgb(0, 128, 0)") directions[3] = 1
        }

        if(currentCell.querySelector('img')){
            imageElement = currentCell.querySelector('img').getAttribute("alt");
            imageElement = imageElement.split(',')[0]
        }
        //return the data as wanted
        let returning = [row, col, directions, imageElement]
        return returning
    } else {
        return null
    }
}

// Function to store the current map in a file
function storeMap(mapName) {
  if (!grid) {
    console.error("Error: Grid is not initialized");
    return;
  }

  //generate the map data
  let map = [];
  for (let i = 0; i < numRows; i++) {

    let row = []
    for (let j = 0; j < numCols; j++) {
        if(returnCellData(i, j) !== null){
            let currentCell = [null, null, null, null]
                currentCell = returnCellData(i, j);
                row.push(currentCell)

        } else {
            row.push(null)
            continue
        }

    }
    
    map.push(row);
  }

//stringify
const mapData = JSON.stringify(map);

//add the version data to the data
const data = mapData + "$" + gameVersion

//create the file
const a = document.createElement("a");
const file = new Blob([data], { type: "application/json" });
a.href = URL.createObjectURL(file);
a.download = `${mapName}.map`;
document.body.appendChild(a);
//download it
a.click();
document.body.removeChild(a);
}

//Load the map from a previously generated file
function regenerateMap() {
    //get the file
    const fileInput = document.createElement("input");
  fileInput.type = "file";

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    const reader = new FileReader();

    //delete all cells
    deleteAllCells()
    //Place the first Cell
    addCell(spawnRoomRow, spawnRoomCol, "top");
    recolorButtons(spawnRoomRow, spawnRoomCol, [1, null, null, null], "green")

    //check the file here for the version data


    //Load the data
    reader.onload = function (event) {

        //Splot into json and the version data
        const versionData = event.target.result.split("$")[1];
        const jsonData = event.target.result.split("$")[0];

        //convert to json
        const mapData = JSON.parse(jsonData);

        //check if the correct map version is selected
        if(versionData !== gameVersion){ alert("This map was made for a different game version!"); return}
        
        //What to do with the map

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {

                if(mapData[i][j] == null) continue;

                addCell([i],[j], "top")

                let cellData = mapData[i][j]

                let cellButtonData = cellData[2]

                recolorButtons(i, j, cellButtonData, "green")

                let cellImage = cellData[3]

                if(cellImage !== null){
                    let img = gameDataFolder + 'icons/' + cellImage + '.png';


                    let cell = getCell(i, j)
                    const newImg = document.createElement('img');
                    newImg.src = img;
                    newImg.alt = cellImage
                    newImg.classList.add('icon');
                    
                    cell.appendChild(newImg);
                    addImageHover(newImg);

                }
            }
        }
    };
    reader.readAsText(new Blob([file], { type: "application/json" }));
  });
  fileInput.click();   
}

//deletes all cells and replaces the spawn
function deleteAllCells() {
    //Go through all rows and then cols and delete the cell
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            deleteCell(grid, i, j)
        }
    }
}

//returns the information of an image from a text file
async function getImageInfo(img){

    const filePath = gameDataFolder + "info/" + img + ".txt";
    
    //get the correct file
    const response = await fetch(filePath);
    const fileContents = await response.text();

    //Adjust the information for display
    let informationVar = img.toUpperCase() + "<br><br> " + fileContents.replace(/[$]/g, "<br>");
    const spoilersCheckbox = document.getElementById("spoilersCheckbox");
    const infoBox = document.getElementById("infoBox");

    //When spoilers are enabled show the full text, but dont show "spoiler", if it is disabled cut off before the "spoiler"
    if (spoilersCheckbox.checked) {
        informationVar = informationVar.replace("spoiler", "");
        infoBox.innerHTML = informationVar ;  
    } else {
        informationVar = informationVar.split("spoiler")[0];
        infoBox.innerHTML = informationVar ;  
    }

}

//Move the current hightlighted cell. If there is no cell to move to, create one
async function moveHighlight(direction, controlDown){
    const highlightedCellRC = getHighlightedCell()

    if(!highlightedCellRC) return;

    // Extract the row value
    const row = highlightedCellRC[0]
    // Extract the column value
    const col = highlightedCellRC[1]

    let newRow = null
    let newCol = null
    let buttonArray = null
    let newButtonArray = null

    switch (direction) {
        case "left":
            // Left pressed
            //if it is not allowed, do not continue
            if((row == heavyZoneRow || row == entranceZoneRow || row == spawnRoomRow)) return;
            if(col == 0) return;
            newRow = row
            newCol = col - 1
            buttonArray = [null,null,null,1]
            newButtonArray = [null,1,null,null]
            editMovedHighlight(newRow, newCol, row, col, newButtonArray, buttonArray, highlightedCellRC, controlDown)
            break;
        case "right":
            // Right pressed
            //if it is not allowed, do not continue
            if((row == heavyZoneRow || row == entranceZoneRow || row == spawnRoomRow)) return;
            if(col == 18) return;
            newRow = row
            newCol = col + 1
            buttonArray = [null,1,null,null]
            newButtonArray = [null,null,null,1]
            editMovedHighlight(newRow, newCol, row, col, newButtonArray, buttonArray, highlightedCellRC, controlDown)
            break;
        case "up":
            // Up 
            if(row == 0) return;
            newRow = row - 1
            newCol = col
            buttonArray = [1,null,null,null]
            newButtonArray = [null,null,1,null]
            editMovedHighlight(newRow, newCol, row, col, newButtonArray, buttonArray, highlightedCellRC, controlDown)
            break;
        case "down":
            // Down pressed
            //return if it would go below the boundary of the map
            if(row + 1 == 18 || row == 18) return;
            newRow = row + 1
            newCol = col 
            buttonArray = [null,null,1,null]
            newButtonArray = [1,null,null,null]
            editMovedHighlight(newRow, newCol, row, col, newButtonArray, buttonArray, highlightedCellRC, controlDown)
            break;
    }

}

//perform the actions of moveHighlight. This will create cells if necessary or just moce around the highlight
async function editMovedHighlight(newRow, newCol, row, col, newButtonArray, buttonArray, highlightedCellRC, controlDown){
    let highlightedCell = getCell(highlightedCellRC[0], highlightedCellRC[1])
    let newCell = getCell(newRow, newCol)
            //if there is no cell, create one, then recolor the buttons, otherwise go to the next one
            if(!newCell){
                addCell(newRow, newCol)
                recolorButtons(row, col, buttonArray, "green")
                recolorButtons(newRow, newCol, newButtonArray, "green")
                removeIconInCell(row, col)

                //the new cell does not get focused if control is held down
                if(controlDown !== 1){
                    //get the newly created cell
                    newCell = getCell(newRow, newCol)
                    //move the highlight to the new cell
                    highlightedCell.classList.remove('highlight');
                    newCell.classList.add('highlight')

                    refreshImages()
                } else {
                    refreshImages()
                }
                return
            } 

            //We are lazy, always recolor the buttons, even if they are already recolored
            recolorButtons(row, col, buttonArray, "green")
            recolorButtons(newRow, newCol, newButtonArray, "green")
            if(controlDown !== 1){
                //when control is held down, dont move the highlight
                //if there is a cell, move highlight and or recolor buttons
                highlightedCell.classList.remove('highlight');
                newCell.classList.add('highlight')
                
                refreshImages()
            } else {
                refreshImages()
            }
            return   
}

//set the focus onto the input field.
function focusInput(){
    const input = document.getElementById('inputField');
    if(input) input.focus();
}

function getHighlightedCell(){
    const highlightedCell = document.querySelector('.highlight');
    if(!highlightedCell) return;
    // Extract the row value
    const row = parseInt(highlightedCell.className.match(/R(\d+)/)[1]);
    // Extract the column value
    const col = parseInt(highlightedCell.className.match(/C(\d+)/)[1]);
    const cellRC = [row, col]
    return(cellRC)
}