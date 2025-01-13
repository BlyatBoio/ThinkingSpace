
// global asthetics booleans
let doDrawMouseTail = true;

// other global booleans
let doMouseDraw = false;

// camera Vars
let cameraX = 0;
let cameraY = 0;
let cameraScale = 1;
let mouseScrolled = 0;
let cameraMovedX = 0;
let cameraMovedY = 0;
let inWorldMouseX = 0;
let inWorldMouseY = 0;
let mouseCanMoveCam = true;
let movedMouseX = 0;
let movedMouseY = 0;
let saveMX = 0;
let saveMY = 0;

// mouse trail vars
let mousePosArr = [];
let mouseTrailLength = 25;

// window Vars
let drawnWindows = [];

// drawing vars
let drawnItems = [];
let drawingMode = 0;
let drawmingModeNames = ["Line", "Rectangle", "Circle", "FreeHand", "Erase", "Recolor"];
let startXpos = 0;
let startYpos = 0;
let xpos = [];
let ypos = [];
let drawHighlight = false;
let brushFillColor;
let doPushDrawing = true;

// input vars
let titleInput;
let doMouseDrawButton;
let rightDrawModeButton;
let leftDrawModeButton;
let saveFileInput;

// test definitions
let basicWindow;

let buttonPressed = false;
let frame1 = true;

let clipboard = undefined;

let actions = [];

function setup()
{
  createCanvas(windowWidth, windowHeight);

  // test definitions
  basicWindow = new templateWindow(400, 200, [0, 0, 0, 100], 50, 2);
  titleInput = createInput();
  titleInput.style('background-color: rgba(0, 0, 0, 0)');
  titleInput.style('border-color: white');
  titleInput.style('color: white');
  titleInput.attribute('placeholder', "My Thinking Space");
  titleInput.style('font-size: 100px');
  titleInput.style('text-align: center');
  titleInput.position(0, 0);
  titleInput.size(width - 8);

  doMouseDrawButton = createButton("◉");
  doMouseDrawButton.style('background-color: rgba(0, 0, 0, 0)');
  doMouseDrawButton.style('border-color: white');
  doMouseDrawButton.style('color: white');
  doMouseDrawButton.position(30, height - 55);
  doMouseDrawButton.size(40, 40);

  rightDrawModeButton = createButton("⇨");
  rightDrawModeButton.style('background-color: rgba(0, 0, 0, 0)');
  rightDrawModeButton.style('border-color: white');
  rightDrawModeButton.style('color: white');
  rightDrawModeButton.position(450, height - 55)
  rightDrawModeButton.size(40, 40)

  leftDrawModeButton = createButton("⇦");
  leftDrawModeButton.style('background-color: rgba(0, 0, 0, 0)');
  leftDrawModeButton.style('border-color: white');
  leftDrawModeButton.style('color: white');
  leftDrawModeButton.position(280, height - 55)
  leftDrawModeButton.size(40, 40)

  brushSize = createSlider(1, 100, 5, 5);
  brushSize.position(80, height - 28);

  brushFillColor = createInput('#FFFFFF', 'color');
  brushFillColor.position(220, height - 42);

  saveFileInput = createFileInput(loadSaveFile);
  saveFileInput.style('background-color: rgba(0, 0, 0, 0)');
  saveFileInput.style('border-color: white');
  saveFileInput.style('color: white');
  saveFileInput.position(500, height - 35);
  frame1 = false;
}

function draw()
{
  background(20);

  // call camera controls

  // mouse trail
  if (doDrawMouseTail == true && doMouseDraw == false) drawMouseTail();

  // relative to "in world" position mouse positions

  inWorldMouseX = round((((tDist(mouseX, width / 2) / cameraScale) - cameraX)) + width / 2);
  inWorldMouseY = round((((tDist(mouseY, height / 2) / cameraScale) - cameraY)) + height / 2);

  // drawing UI

  if (doMouseDraw == true)
  {
    mouseCanMoveCam = false;
    push();
    if (drawHighlight == true)
    {
      // formatting
      fill(brushFillColor.value());
      stroke(brushFillColor.value());
      strokeWeight(brushSize.value());
      switch (drawingMode)
      {
        case 0:
          line(startXpos, startYpos, mouseX, mouseY);
          break;
        case 1:
          rect(startXpos, startYpos, -tDist(startXpos, mouseX), -tDist(startYpos, mouseY));
          break;
        case 2:
          ellipse(startXpos, startYpos, dist(mouseX, mouseY, startXpos, startYpos));
          break;
        case 3:
          for (let i = 0; i < xpos.length; i++)
          {
            line(xpos[i], ypos[i], xpos[i + 1], ypos[i + 1]);
          }
          break;
        case 4:
          noFill();
          stroke(0);
          strokeWeight(3);
          circle(mouseX, mouseY, brushSize.value());
          break;
      }
    }
    if (drawingMode == 3 && mouseIsPressed && dist(mouseX, mouseY, xpos[xpos.length - 1], ypos[ypos.length - 1]) > 10)
    {
      xpos.push(mouseX);
      ypos.push(mouseY);
    }
    pop();
  }

  // draw all drawn items
  for (let i = 0; i < drawnItems.length; i++)
  {
    drawnItems[i].drawSelf();
  }

  // drawing
  if (mouseY < 100 || (mouseY > height - 80)) mouseCanMoveCam = false;

  // drawing mode buttons
  if (mouseIsPressed && collc(mouseX, mouseY, 5, 5, 450, height - 55, 40, 40) == true && buttonPressed == false)
  {
    if (drawingMode < drawmingModeNames.length - 1) drawingMode += 1;
    else drawingMode = 0;
    buttonPressed = true;
  }

  if (mouseIsPressed && collc(mouseX, mouseY, 5, 5, 280, height - 55, 40, 40) == true && buttonPressed == false)
  {
    if (drawingMode > 0) drawingMode -= 1;
    else drawingMode = drawmingModeNames.length - 1;
    buttonPressed = true;
  }

  if (mouseIsPressed && collc(mouseX, mouseY, 5, 5, 30, height - 55, 40, 40) == true && buttonPressed == false)
  {
    doMouseDraw = !doMouseDraw;
    buttonPressed = true;
  }

  push();
  textAlign(CENTER);
  fill(255);
  textSize(20);
  stroke(0);
  strokeWeight(1);
  text(drawmingModeNames[drawingMode], 385, height - 28)
  pop();

  // draw open windows
  for (let i = 0; i < drawnWindows.length; i++)
  {
    if (drawnWindows[i].mouseIsOn() == true) mouseCanMoveCam = false;
    drawnWindows[i].drawSelf();
  }

  cameraControls();

  // reset variables
  mouseScrolled = 0;
  cameraMovedX = 0;
  cameraMovedY = 0;
  movedMouseX = tDist(mouseX, saveMX);
  movedMouseY = tDist(mouseY, saveMY);
  mouseCanMoveCam = true;
  mouseIsDown = false;
  saveMX = mouseX;
  saveMY = mouseY;
  if (mouseIsPressed == false) buttonPressed = false;

}

function drawMouseTail()
{

  // update mouse position array
  mousePosArr.push(mouseX);
  mousePosArr.push(mouseY);

  push();
  for (let i = 0; i < mousePosArr.length; i += 2)
  {
    //fill(150);
    //noStroke();
    //ellipse(mousePosArr[i], mousePosArr[i+1], i/5);
    stroke(150);
    strokeWeight(10)
    line(mousePosArr[i], mousePosArr[i + 1], mousePosArr[i + 2], mousePosArr[i + 3])
  }
  pop();

  if (mousePosArr.length > mouseTrailLength - 2)
  {
    mousePosArr.shift();
    mousePosArr.shift();
  }
}

function loadSaveFile(file1)
{
  console.log("Attempting To Load File: " + file1.data.Name);
  for (let i = 0; i < drawnWindows.length; i++)
  {
    drawnWindows[i].close();
  }
  drawnItems = [];
  if (frame1 == false)
  {
    let newDrawnItems = [];
    for (let i = 0; i < file1.data.drawnItems.length; i++)
    {
      newDrawnItems.push(dataToClass(file1.data.drawnItems[i], "drawnItem"));
    }
    for (let i = 0; i < file1.data.drawnWindows.length; i++)
    {
      let a = dataToClass(file1.data.drawnWindows[i], "UIwindow")
      drawnWindows.push(a);
    }
    drawnItems = newDrawnItems;
    titleInput.value(file1.data.spaceName);
    cameraX = file1.data.cameraX;
    cameraY = file1.data.cameraY;
    console.log("Loaded File: " + file1.data.Name);
  }
}

function cameraControls()
{
  // camera movement
  if (mouseIsPressed && mouseCanMoveCam == true && doMouseDraw == false)
  {
    cameraX += movedMouseX;
    cameraY += movedMouseY;
    cameraMovedX = movedMouseX;
    cameraMovedY = movedMouseY;
  }

  // up/down arrow camera scaling
  //if (keyIsDown(40)) cameraScale += round(10 * (0.5 * cameraScale)) / 100;
  //if (keyIsDown(38)) cameraScale -= round(10 * (0.5 * cameraScale)) / 100;

  // handle mouse scrolling camera scale
  if (keyIsDown(16) == false) cameraScale -= mouseScrolled / 1000;

  // constraints for the camera scale
  cameraScale = constrain(cameraScale, 0.1, 2);
  cameraScale = round(cameraScale * 100) / 100;

}

function mouseWheel(event)
{
  mouseScrolled = event.delta;
}

function mousePressed()
{
  if (doMouseDraw == true && mouseCanMoveCam == true)
  {
    startXpos = mouseX;
    startYpos = mouseY;
    drawHighlight = true;
    xpos.push(mouseX);
    ypos.push(mouseY);
  }
}

// primarily used for drawing functionality
function mouseReleased()
{
  if (doMouseDraw == true && doPushDrawing == true && collc(mouseX, mouseY, 5, 5, 0, height - 50, 500, height) == false)
  {
    // xpos and ypos values are pushed together so they are both the ame length every time
    for (let i = 0; i < xpos.length; i++)
    {
      xpos[i] = round((((tDist(xpos[i], width / 2) / cameraScale) - cameraX)) + width / 2);
      ypos[i] = round((((tDist(ypos[i], height / 2) / cameraScale) - cameraY)) + height / 2);
    }

    startXpos = round((((tDist(startXpos, width / 2) / cameraScale) - cameraX)) + width / 2);
    startYpos = round((((tDist(startYpos, height / 2) / cameraScale) - cameraY)) + height / 2);

    if (drawingMode < 2) drawnItems.push(new drawnItem(drawmingModeNames[drawingMode], [startXpos, inWorldMouseX], [startYpos, inWorldMouseY]));
    if (drawingMode == 2) drawnItems.push(new drawnItem("Circle", [startXpos, dist(startXpos, startYpos, inWorldMouseX, inWorldMouseY)], [startYpos]));
    if (drawingMode == 3) drawnItems.push(new drawnItem("FreeHand", xpos, ypos));
  }
  xpos = [];
  ypos = [];
  drawHighlight = false;
  doPushDrawing = true;
}

function tDist(x, x2)
{
  if(x + x2 == undefined) console.log("ERROR: X and or X2 left undefined in tDist")
  if (x < x2) return -dist(x, 0, x2, 0);
  else return dist(x, 0, x2, 0);
}

function doubleClicked()
{
  if (mouseCanMoveCam == true && doMouseDraw == false) openWindow(basicWindow);
}

function openWindow(templateWindow1)
{
  drawnWindows.push(new UIwindow(inWorldMouseX, inWorldMouseY, templateWindow1));
  console.log("Oppened new Window at: (" + inWorldMouseX + ", " + inWorldMouseY + ")" + " ID:" + drawnWindows.length)
}

function saveSpaceAsFile()
{
  let saveInps = [];
  // over complication in order to avoid the fact that JSON cant save HTML inputs because of circular structure
  for (let i = 0; i < drawnWindows.length; i++)
  {
    saveInps.push(drawnWindows[i].titleInp);
    saveInps.push(drawnWindows[i].closeButton);
    saveInps.push(drawnWindows[i].collapseButon);
    saveInps.push(drawnWindows[i].bodyText);
    drawnWindows[i].titleInp.input.remove();
    drawnWindows[i].closeButton.input.remove();
    drawnWindows[i].collapseButon.input.remove();
    drawnWindows[i].bodyText.input.remove();
    drawnWindows[i].clearInputs();
  }
  let newFile = {
    "Name": titleInput.value() + "Data.json",
    "drawnWindows": drawnWindows,
    "drawnItems": drawnItems,
    "spaceName": titleInput.value(),
    "cameraX": cameraX,
    "cameraY": cameraY
  }
  save(newFile, titleInput.value() + "Data.json");
  for (let i = 0; i < drawnWindows.length; i++)
  {
    drawnWindows[i].replaceInputs(saveInps[i * 4], saveInps[i * 4 + 1], saveInps[i * 4 + 2], saveInps[i * 4 + 3]);
  }
}

function dataToClass(data, type)
{
  if (type == "UIwindow")
  {
    let a = new UIwindow(data.inWorldX, data.inWorldY, data.templateWindow);
    a.w = data.w;
    a.h = data.h;
    a.isCollapsed = data.isCollapsed;
    let ti = dataToClass(data.titleInp, "UIInput");
    let c1 = dataToClass(data.closeButton, "UIInput");
    let c2 = dataToClass(data.collapseButon, "UIInput");
    let bt = dataToClass(data.bodyText, "UIInput");
    a.replaceInputs(ti, c1, c2, bt);
    if (data.titleInp.isHidden == true) a.titleInp.hideSelf();
    if (data.closeButton.isHidden == true) a.closeButton.hideSelf();
    if (data.collapseButon.isHidden == true) a.collapseButon.hideSelf();
    if (data.bodyText.isHidden == true) a.bodyText.hideSelf();
    return a;
  }
  if (type == "UIInput") return new UIInput(data.inpType, data.inWorldX, data.inWorldY, data.w, data.h, data.baseFontSize, undefined, data.id, data.value);
  if (type == "drawnItem") return new drawnItem(data.type, data.xs, data.ys, data.fillColor, data.strokeWeight, data.id);
}

function copyObject(obj)
{
  clipboard = obj;
  console.log("Copied Object Type: " + clipboard.objectType + " With ID: " + clipboard.id);
}

function pasteObject()
{
  if(clipboard != undefined){
    let pastedID = 0;
    switch (clipboard.objectType)
    {
      case "Window":
        let temp2 = new templateWindow(clipboard.w, clipboard.h, clipboard.fillColor, clipboard.borderColor, clipboard.borderSize);
        let temp1 = new UIwindow(inWorldMouseX, inWorldMouseY, temp2)
        temp1.isCollapsed = clipboard.isCollapsed;
        let ti = dataToClass(clipboard.titleInp, "UIInput");
        let c1 = dataToClass(clipboard.closeButton, "UIInput");
        let c2 = dataToClass(clipboard.collapseButon, "UIInput");
        let bt = dataToClass(clipboard.bodyText, "UIInput");
        temp1.replaceInputs(ti, c1, c2, bt);
        if (clipboard.titleInp.isHidden == true) temp1.titleInp.hideSelf();
        if (clipboard.closeButton.isHidden == true) temp1.closeButton.hideSelf();
        if (clipboard.collapseButon.isHidden == true) temp1.collapseButon.hideSelf();
        if (clipboard.bodyText.isHidden == true) temp1.bodyText.hideSelf();

        let dx = tDist(inWorldMouseX, clipboard.inWorldX);
        let dy = tDist(inWorldMouseY, clipboard.inWorldY);

        for (let i = 0; i < temp1.UIInputs.length; i++)
        {
          temp1.UIInputs[i].inWorldX += dx;
          temp1.UIInputs[i].inWorldY += dy;
        }

        drawnWindows.push(temp1);
        pastedID = drawnWindows.length;
        break;
      case "Drawn Item":
        let newXs = [];
        let newYs = [];
        for(let i = 0; i < clipboard.xs.length; i++){
          newXs.push(clipboard.xs[i])
          newYs.push(clipboard.ys[i])
        }
        let d1 = new drawnItem(clipboard.type, newXs, newYs, clipboard.fillColor, clipboard.strokeWeight);
        let xDist = tDist(inWorldMouseX, clipboard.xs[0]);
        let yDist = tDist(inWorldMouseY, clipboard.ys[0]);
        for (let i = 0; i < d1.xs.length; i++)
        {
          d1.xs[i] += xDist;
          d1.ys[i] += yDist;
          if(d1.type == "Circle") break;
          }
        drawnItems.push(d1);
        pastedID = d1.id;
        break;
    }
    console.log("Pasted Object Type: " + clipboard.objectType + " at X: " + inWorldMouseX + " Y: " + inWorldMouseY + " With ID: " + pastedID);
  }
}

class UIwindow
{
  constructor(inWorldX, inWorldY, templateWindow1)
  {
    // used for which vars to pass through in copy/paste\
    this.objectType = "Window";

    // drawing x and y positions
    this.inWorldX = inWorldX;
    this.inWorldY = inWorldY;

    // to stop the close button from instantly closing the window
    // when it is opened
    this.frame1 = true;

    // copy template window vars

    this.templateWindow = templateWindow1;
    this.w = this.templateWindow.w;
    this.h = this.templateWindow.h;
    this.fillColor = this.templateWindow.fillColor;
    this.borderColor = this.templateWindow.borderColor;
    this.borderSize = this.templateWindow.borderSize;
    this.id = drawnWindows.length;

    this.UIInputs = [];

    let textOff = 30;
    // title input
    let a = createElement('TextArea');
    a.style('background-color: rgba(0, 0, 0, 0)');
    a.style('border-color: white');
    a.style('color: white');
    a.attribute('placeholder', "Title");
    this.UIInputs.push(this.titleInp = new UIInput("Text", this.inWorldX + textOff + 30, this.inWorldY + textOff, this.w - textOff * 3.5 - 30, 20, 15, a, this.UIInputs.length));

    // closing button
    let b = createButton("X");
    b.style('background-color: rgba(0, 0, 0, 0)');
    b.style('border-color: white');
    b.style('color: white');
    this.UIInputs.push(this.closeButton = new UIInput("Button", this.inWorldX + this.w - textOff * 2, this.inWorldY + textOff, 26, 26, 0, b, this.UIInputs.length));

    // collapsing button
    let d = createButton("▼");
    d.style('background-color: rgba(0, 0, 0, 0)');
    d.style('border-color: white');
    d.style('color: white');
    this.UIInputs.push(this.collapseButon = new UIInput("Button", this.inWorldX + textOff, this.inWorldY + textOff, 26, 26, 0, d, this.UIInputs.length));


    // body text
    let c = createElement('TextArea');
    c.style('background-color: rgba(0, 0, 0, 0)');
    c.style('border-color: white');
    c.style('color: white');
    c.attribute('placeholder', "Whatever else you want to write");
    this.UIInputs.push(this.bodyText = new UIInput("Text", this.inWorldX + textOff, this.inWorldY + textOff * 3, this.w - textOff * 2, this.h - textOff * 4, 15, c, this.UIInputs.length));

    // vars for when it is ollapsed to save the positions of everything
    this.frame1 = true;
    this.isCollapsed = false;
    this.isC = false;
    this.saveH = this.h;
    this.saveW = this.w;
    this.saveInpx = 0;
    this.saveInpy = 0;
    this.saveInph = 0;

    // vars for undoing actions
    this.totalMovedX = 0;
    this.totalMovedY = 0;
    this.totalScaledX = 0;
    this.totalScaledY = 0;

    new action("Create", this);
  }
  drawSelf()
  {
    push();
    // adjust position for camera
    let p1 = adjustForCamera(this.inWorldX, this.inWorldY);

    // formatting based on given inputs from the template window
    fill(this.fillColor[0], this.fillColor[1], this.fillColor[2], this.fillColor[3]);
    stroke(this.borderColor);
    strokeWeight(this.borderSize);

    // draw the background
    rect(p1.x, p1.y, this.w * cameraScale, this.h * cameraScale);

    // update UI Inputs
    for (let i = 0; i < this.UIInputs.length; i++)
    {
      this.UIInputs[i].drawSelf();
    }

    if (this.closeButton.isPressed() == true) this.close();

    // if the user is moving the box or scaling it
    if (this.hoveringChildInput() == false && this.mouseIsOn() == true && doMouseDraw == false) this.checkForMouseUpdates();

    if (this.collapseButon.isPressed() == true) this.collapse();
    else this.isC = false;
    pop();

    // push actions into action array for undo functionality
    if(mouseIsPressed == false){
      if(abs(this.totalMovedX + this.totalMovedY )> 0){
        let a = [];
        for(let i = 0; i < this.UIInputs.length; i++){
          a.push(this.UIInputs[i]);
        }
        a.push(this);
        new action("groupPosition", a, this.totalMovedX, this.totalMovedY);
        this.totalMovedX = 0;
        this.totalMovedY = 0;
      }
      
      if(abs(this.totalScaledX + this.totalScaledY) > 0){
        new action("adjustScale", this, this.totalScaledX, this.totalScaledY);
        this.totalScaledX = 0;
        this.totalScaledY = 0;
      }
    }
  }
  hoveringChildInput()
  {
    for (let i = 0; i < this.UIInputs.length; i++)
    {
      if (this.UIInputs[i].mouseIsOn() == true && this.UIInputs[i].doMouseInteraction == true) return true;
    }
    return false;
  }
  checkForMouseUpdates()
  {
    // adjust position for camera
    let savew = this.w;
    let p1 = adjustForCamera(this.inWorldX, this.inWorldY);

    // formatting
    strokeWeight(2);
    stroke(255);
    fill(255);
    let xMoved = 0;
    let yMoved = 0;
    let scaledX = 0;
    let scaledY = 0;

    // determine what side of the UI Window the mouse is on

    let xSide = 0;
    if (mouseX - movedMouseX / cameraScale < p1.x + 20) xSide = 1; // left side
    if (mouseX - movedMouseX / cameraScale > p1.x + this.w * cameraScale - 20) xSide = -1; // right side

    let ySide = 0;
    if (mouseY - movedMouseY / cameraScale < p1.y + 20) ySide = 1; // Top side
    if (mouseY - movedMouseY / cameraScale > p1.y + this.h * cameraScale - 20) ySide = -1; // Bottom side

    if (this.isCollapsed == false)
    {
      // left side checks 
      if (xSide == 1)
      {

        // x movement applies for all
        if (mouseIsPressed)
        {
          this.inWorldX += movedMouseX / cameraScale;
          this.w -= movedMouseX / cameraScale;
          xMoved += movedMouseX / cameraScale;
          scaledX -= movedMouseX / cameraScale;
        }
        // top side
        if (ySide == 1)
        {
          circle(p1.x, p1.y, 15 * cameraScale);
        }
        // bottom side 
        else if (ySide == -1)
        {
          circle(p1.x, p1.y + this.h * cameraScale, 15 * cameraScale);
        }
        else if (ySide == 0) line(p1.x, p1.y, p1.x, p1.y + this.h * cameraScale);
      }

      // right side checks
      if (xSide == -1)
      {

        // x movement applies for all
        if (mouseIsPressed) {
          this.w += movedMouseX / cameraScale;
          scaledX += movedMouseX / cameraScale;
        }

        // top side
        if (ySide == 1)
        {
          circle(p1.x + this.w * cameraScale, p1.y, 15 * cameraScale);
        }
        // bottom side 
        else if (ySide == -1)
        {
          circle(p1.x + this.w * cameraScale, p1.y + this.h * cameraScale, 15 * cameraScale);
        }
        else if (ySide == 0) line(p1.x + this.w * cameraScale, p1.y, p1.x + this.w * cameraScale, p1.y + this.h * cameraScale);
      }

      //top and bottom individual checks
      if (ySide == 1)
      {
        if (xSide == 0) line(p1.x, p1.y, p1.x + this.w * cameraScale, p1.y);
        if (mouseIsPressed)
        {
          this.inWorldY += movedMouseY / cameraScale;
          this.h -= movedMouseY / cameraScale;
          yMoved += movedMouseY / cameraScale;
          scaledY -= movedMouseY/cameraScale;
        }
      }

      if (ySide == -1)
      {
        if (xSide == 0) line(p1.x, p1.y + this.h * cameraScale, p1.x + this.w * cameraScale, p1.y + this.h * cameraScale);
        if (mouseIsPressed) {
          this.h += movedMouseY / cameraScale;
          scaledY += movedMouseY / cameraScale;
        }
      }
    }
    if (xSide == 0 && ySide == 0 && mouseIsPressed)
    {
      this.inWorldX += movedMouseX / cameraScale;
      this.inWorldY += movedMouseY / cameraScale;

      xMoved += movedMouseX / cameraScale;
      yMoved += movedMouseY / cameraScale;
    }

    if (mouseIsPressed && (movedMouseX != 0 || movedMouseY != 0))
    {
      this.updateUIPosition(xMoved, yMoved);
      this.closeButton.inWorldX -= savew - this.w;
    }
    this.totalMovedX += xMoved;
    this.totalMovedY += yMoved;
    this.totalScaledX += scaledX;
    this.totalScaledY += scaledY;
  }
  updateUIPosition(offX, offY)
  {
    for (let i = 0; i < this.UIInputs.length; i++)
    {
      this.UIInputs[i].inWorldX += offX;
      this.UIInputs[i].inWorldY += offY;
    }
  }
  mouseIsOn()
  {
    // adjust position for camera
    let p1 = adjustForCamera(this.inWorldX, this.inWorldY);

    // retur true if collision check is true
    if (collc(mouseX - movedMouseX, mouseY - movedMouseY, 5, 5, p1.x, p1.y, this.w * cameraScale, this.h * cameraScale, 20, 40) == true || this.hoveringChildInput() == true) return true;
    return false;
  }
  close(pushNewAction)
  {
    if(pushNewAction != false) new action("Delete", this, this.UIInputs);
    for (let i = 0; i < this.UIInputs.length; i++)
    {
      this.UIInputs[i].deleteSelf(true, this.id);
    }
    drawnWindows = del(drawnWindows, this.id);
    console.log("Closed Window With ID: " + (this.id + 1));
  }
  collapse()
  {
    if (this.isC == false)
    {
      if (this.isCollapsed == false)
      {
        this.saveH = this.h;
        this.saveW = this.w;
        this.w = this.titleInp.w + 35;
        this.h = 30;
        this.saveInpx = this.titleInp.inWorldX;
        this.saveInpy = this.titleInp.inWorldY;
        this.saveInph = this.titleInp.h;
        this.titleInp.inWorldX = this.inWorldX + 30;
        this.titleInp.inWorldY = this.inWorldY + 20;
        this.titleInp.h = 20;
        for (let i = 0; i < this.UIInputs.length; i++)
        {
          this.UIInputs[i].hideSelf();
        }
        this.titleInp.showSelf();
        this.titleInp.inWorldY -= 18.5;

        this.collapseButon.showSelf();
        this.collapseButon.inWorldX -= 20;
        this.collapseButon.inWorldY -= 18.5;
        this.isCollapsed = true;
        this.titleInp.doMouseInteraction = false;
      } else
      {
        this.h = this.saveH;
        this.w = this.saveW;
        this.titleInp.inWorldX = this.saveInpx;
        this.titleInp.inWorldY = this.saveInpy;
        this.titleInp.h = this.saveInph;
        for (let i = 0; i < this.UIInputs.length; i++)
        {
          this.UIInputs[i].showSelf();
        }
        this.collapseButon.inWorldX += 20;
        this.collapseButon.inWorldY += 18.5;
        this.isCollapsed = false;
        this.titleInp.doMouseInteraction = true;
      }
    }
    this.isC = true;
  }
  clearInputs()
  {
    for (let i = 0; i < this.UIInputs.length; i++)
    {
      this.UIInputs[i].input.remove();
      this.UIInputs[i].input = undefined;
    }
  }
  replaceInputs(titleInp, closeButton, collapseButon, bodyText)
  {
    for (let i = 0; i < this.UIInputs.length; i++)
    {
      if (this.UIInputs[i].input != undefined) this.UIInputs[i].input.remove();
    }
    this.titleInp = titleInp;
    this.closeButton = closeButton;
    this.collapseButon = collapseButon;
    this.bodyText = bodyText;

    // title input
    let a = createElement('TextArea');
    a.style('background-color: rgba(0, 0, 0, 0)');
    a.style('border-color: white');
    a.style('color: white');
    a.attribute('placeholder', "Title");
    this.titleInp.replaceInput(a);

    // closing input
    let b = createButton("X");
    b.style('background-color: rgba(0, 0, 0, 0)');
    b.style('border-color: white');
    b.style('color: white');
    this.closeButton.replaceInput(b);

    // collapsing button
    let d = createButton("▼");
    d.style('background-color: rgba(0, 0, 0, 0)');
    d.style('border-color: white');
    d.style('color: white');
    this.collapseButon.replaceInput(d);

    // body text
    let c = createElement('TextArea');
    c.style('background-color: rgba(0, 0, 0, 0)');
    c.style('border-color: white');
    c.style('color: white');
    c.attribute('placeholder', "Whatever else you want to write");
    this.bodyText.replaceInput(c);

    this.UIInputs[0] = this.titleInp;
    this.UIInputs[1] = this.closeButton;
    this.UIInputs[2] = this.collapseButon;
    this.UIInputs[3] = this.bodyText;
  }
}

class UIInput
{
  constructor(inpType, inWorldX, inWorldY, w, h, baseFontSize, input1, id, value)
  {
    this.objectType = "Input";
    this.inpType = inpType;
    this.inWorldX = inWorldX;
    this.inWorldY = inWorldY;
    this.w = w;
    this.h = h;
    this.baseFontSize = baseFontSize;
    this.input = input1;
    this.isHidden = false;
    this.doMouseInteraction = true;
    this.id = id;
    this.value = "";
    this.isOffscreen = false;
    if (input1 != undefined) this.value = input1.value();
    if (value != undefined) this.value = value;

    this.totalMovedX = 0;
    this.totalMovedY = 0;
    this.totalScaledX = 0;
    this.totalScaledY = 0;
  }
  drawSelf()
  {
    let p1 = adjustForCamera(this.inWorldX, this.inWorldY);
    if (this.isHidden == false && this.input != undefined && this.isOffscreen == false)
    {
      // get position in the world

      // if it is running into the sides of the screen, shorten the disply
      // so it fits on the screen without just dissapearing

      // only checks for bottom and right sides because it doesent add
      // scroll bars going the other directions for whatever reason

      // x offset if it is off screen
      let widthOff = 0;
      if (p1.x + this.w * cameraScale > width)
      {
        let offset = dist(p1.x + this.w * cameraScale, 0, width, 0) + 15;
        widthOff -= offset;
      }


      // y offset if it is off screen
      let heightOff = 0;
      if (p1.y + this.h * cameraScale > height)
      {
        let offset = dist(p1.y + this.h * cameraScale, 0, height, 0) + 15;
        heightOff -= offset;
      }

      // completely off screen
      if (p1.x > width || p1.x + this.w * cameraScale < 0 || p1.y > height || p1.y + this.h * cameraScale < 0)
      {
        this.input.hide();
        this.isOffscreen = true;
      }
      else
      {
        this.input.show();
        this.isOffscreen = false;
      }

      // update position
      this.input.position(p1.x, p1.y);

      // update size
      this.input.size(this.w * cameraScale + widthOff, this.h * cameraScale + heightOff);

      // update font size
      if (this.inpType == "Text")
      {
        let fontSize = this.baseFontSize * cameraScale + "px";
        this.input.style('font-size', fontSize);
      }

      if (this.mouseIsOn() == true && this.inpType != "Button" && this.doMouseInteraction == true)
      {
        this.checkForMouseUpdates();
        if (mouseIsPressed && (keyIsDown(8) || keyIsDown(46))) this.deleteSelf();
      }
      if (this.input.value != undefined) this.value = this.input.value();

      if(mouseIsPressed == false){
        if(abs(this.totalMovedX + this.totalMovedY) > 0){
          new action("adjustPosition", this, this.totalMovedX, this.totalMovedY);
          this.totalMovedX = 0;
          this.totalMovedY = 0;
        }
        
        if(abs(this.totalScaledX + this.totalScaledY) > 0){
          new action("adjustScale", this, this.totalScaledX, this.totalScaledY);
          this.totalScaledX = 0;
          this.totalScaledY = 0;
        }
      }
    }
    if ((p1.x > width || p1.x + this.w * cameraScale < 0 || p1.y > height || p1.y + this.h * cameraScale < 0) == false) this.isOffscreen = false;
  }
  checkForMouseUpdates()
  {
    // adjust position for camera
    let p1 = adjustForCamera(this.inWorldX, this.inWorldY);

    // formatting
    strokeWeight(2);
    stroke(255);
    fill(255);

    let xMoved = 0;
    let yMoved = 0;
    let scaledX = 0;
    let scaledY = 0;

    // determine what side of the UI Window the mouse is on

    let xSide = 0;
    if (mouseX - movedMouseX / cameraScale < p1.x + 20) xSide = 1; // left side
    if (mouseX - movedMouseX / cameraScale > p1.x + this.w * cameraScale - 20) xSide = -1; // right side

    let ySide = 0;
    if (mouseY - movedMouseY / cameraScale < p1.y + 20) ySide = 1; // Top side
    if (mouseY - movedMouseY / cameraScale > p1.y + this.h * cameraScale - 20) ySide = -1; // Bottom side

    // left side checks 
    if (xSide == 1)
    {

      // x movement applies for all
      if (mouseIsPressed)
      {
        this.inWorldX += movedMouseX / cameraScale;
        this.w -= movedMouseX / cameraScale;
        xMoved += movedMouseX / cameraScale;
        scaledX -= movedMouseX / cameraScale;
      }
      // top side
      if (ySide == 1)
      {
        circle(p1.x, p1.y, 15 * cameraScale);
      }
      // bottom side 
      else if (ySide == -1)
      {
        circle(p1.x, p1.y + this.h * cameraScale, 15 * cameraScale);
      }
      else if (ySide == 0) line(p1.x, p1.y, p1.x, p1.y + this.h * cameraScale);
    }

    // right side checks
    if (xSide == -1)
    {

      // x movement applies for all

      if (mouseIsPressed) {
        this.w += movedMouseX / cameraScale;
        scaledX += movedMouseX / cameraScale;
      }

      // top side
      if (ySide == 1)
      {
        circle(p1.x + this.w * cameraScale, p1.y, 15 * cameraScale);
      }
      // bottom side 
      else if (ySide == -1)
      {
        circle(p1.x + this.w * cameraScale, p1.y + this.h * cameraScale, 15 * cameraScale);
      }
      else if (ySide == 0) line(p1.x + this.w * cameraScale, p1.y, p1.x + this.w * cameraScale, p1.y + this.h * cameraScale);
    }

    //top and bottom individual checks
    if (ySide == 1)
    {
      if (xSide == 0) line(p1.x, p1.y, p1.x + this.w * cameraScale, p1.y);
      if (mouseIsPressed)
      {
        this.inWorldY += movedMouseY / cameraScale;
        this.h -= movedMouseY / cameraScale;
        yMoved += movedMouseY / cameraScale;
        scaledY -= movedMouseY / cameraScale;
      }
    }

    if (ySide == -1)
    {
      if (xSide == 0) line(p1.x, p1.y + this.h * cameraScale, p1.x + this.w * cameraScale, p1.y + this.h * cameraScale);
      if (mouseIsPressed) {
        this.h += movedMouseY / cameraScale;
        scaledY += movedMouseY / cameraScale;
      }
    }
    if (xSide == 0 && ySide == 0 && mouseIsPressed)
    {
      this.inWorldX += movedMouseX / cameraScale;
      this.inWorldY += movedMouseY / cameraScale;

      xMoved += movedMouseX / cameraScale
      yMoved += movedMouseY / cameraScale
    }

    this.totalMovedX += xMoved;
    this.totalMovedY += yMoved;
    this.totalScaledX += scaledX;
    this.totalScaledY += scaledY;
  }
  isPressed()
  {
    let p1 = adjustForCamera(this.inWorldX, this.inWorldY);
    return (collc(mouseX, mouseY, 1, 1, p1.x, p1.y, this.w * cameraScale, this.h * cameraScale, 5, 5) && mouseIsPressed);
  }
  deleteSelf(fromParent, parentID)
  {
    this.input.remove();
  }
  mouseIsOn()
  {
    // adjust position for camera
    let p1 = adjustForCamera(this.inWorldX, this.inWorldY);

    // retur true if collision check is true
    if (collc(mouseX - movedMouseX / cameraScale, mouseY - movedMouseY / cameraScale, 5, 5, p1.x, p1.y, this.w * cameraScale, this.h * cameraScale, 20, 20) == true) return true;
    return false;
  }
  hideSelf()
  {
    this.input.hide();
    this.input.attribute('disabled: true');
    this.isHidden = true;
  }
  showSelf()
  {
    this.input.attribute('disabled:', false);
    this.input.show();
    this.isHidden = false;
  }
  replaceInput(inp)
  {
    this.input = inp;
    this.input.position(this.inWorldX, this.inWorldY);
    this.input.position(this.w, this.h);
    this.input.value(this.value);
  }
}

class templateWindow
{
  constructor(w, h, fillColor, borderColor, borderSize)
  {
    this.w = w;
    this.h = h;
    this.fillColor = fillColor;
    this.borderColor = borderColor;
    this.borderSize = borderSize;
  }
}

class drawnItem
{
  constructor(type, xs, ys, fillColor, strokeWeight, id)
  {
    this.objectType = "Drawn Item";
    this.type = type;
    this.xs = xs;
    this.ys = ys;
    this.fillColor = brushFillColor.value();
    this.strokeWeight = brushSize.value();
    this.id = drawnItems.length;

    if (fillColor != undefined) this.fillColor = fillColor;
    if (strokeWeight != undefined) this.strokeWeight = strokeWeight;
    if (id != undefined) this.id = id;
    new action("Create", this);
  }
  drawSelf()
  {
    // formatting
    fill(this.fillColor);
    stroke(this.fillColor);
    strokeWeight(this.strokeWeight);

    // two point given, draw a line between them
    switch (this.type)
    {
      case "Line":
        let p1 = adjustForCamera(this.xs[0], this.ys[0]);
        let p2 = adjustForCamera(this.xs[1], this.ys[1]);
        line(p1.x, p1.y, p2.x, p2.y);
        break;

      // two points given, draw a rectangle between them
      case "Rectangle":
        let p3 = adjustForCamera(this.xs[0], this.ys[0]);
        let p4 = adjustForCamera(this.xs[1], this.ys[1]);
        rect(p3.x, p3.y, -tDist(p3.x, p4.x), -tDist(p3.y, p4.y));
        break;

      // one point given, second point in the xs array is the radius
      case "Circle":
        let p5 = adjustForCamera(this.xs[0], this.ys[0]);
        circle(p5.x, p5.y, this.xs[1] * cameraScale);
        break;

      // multiple points given, draw lines between them all
      case "FreeHand":
        for (let i = 0; i < this.xs.length - 1; i++)
        {
          let p6 = adjustForCamera(this.xs[i], this.ys[i]);
          let p7 = adjustForCamera(this.xs[i + 1], this.ys[i + 1]);
          line(p6.x, p6.y, p7.x, p7.y);
        }
        break;
    }
  
    if(drawingMode >= 4 && mouseIsPressed == true && doMouseDraw == true && this.mouseIsOn() == true){
      if(drawingMode == 4) {drawnItems = del(
        drawnItems, this.id); 
        console.log("Deleted Self: " + this.id);
        new action("Delete", this);
      }
      if(drawingMode == 5 && this.fillColor != brushFillColor.value()) {
        new action("Recolor", this, this.fillColor);
        this.fillColor = brushFillColor.value();
      }
    }

  }
  mouseIsOn()
  {
    switch (this.type)
    {
      // different collision types for each
      case "Line":
        let p1 = adjustForCamera(this.xs[0], this.ys[0]);
        let p2 = adjustForCamera(this.xs[1], this.ys[1]);
        let d1 = dist(mouseX, mouseY, p1.x, p1.y);
        let d2 = dist(mouseX, mouseY, p2.x, p2.y);
        let d3 = dist(p1.x, p1.y, p2.x, p2.y);
        if (d1 + d2 < d3 + brushSize.value())
        {
          return true;
        }
        break;
      case "Rectangle":
        let p3 = adjustForCamera(this.xs[0], this.ys[0]);
        let p4 = adjustForCamera(this.xs[1], this.ys[1]);
        if (collc(mouseX, mouseY, 5, 5, p3.x, p3.y, -tDist(p3.x, p4.x), -tDist(p3.y, p4.y), brushSize.value(), brushSize.value()))
        {
          return true;
        }
        break;
      case "Circle":
        let p5 = adjustForCamera(this.xs[0], this.ys[0]);
        let d4 = dist(mouseX, mouseY, p5.x, p5.y);
        if (d4 < this.xs[1] + brushSize.value())
        {
          return true;
        }
        break;
      case "FreeHand":
        for (let i = 0; i < this.xs.length - 1; i++)
        {
          let p6 = adjustForCamera(this.xs[i], this.ys[i]);
          let p7 = adjustForCamera(this.xs[i + 1], this.ys[i + 1]);
          let d5 = dist(mouseX, mouseY, p6.x, p6.y);
          let d6 = dist(mouseX, mouseY, p7.x, p7.y);
          let d7 = dist(p6.x, p6.y, p7.x, p7.y);
          fill(255);
          if(keyIsDown(72)) ellipse(p6.x, p6.y, 10);
          if (d5 + d6 < d7 + brushSize.value())
          {
            return true;
          }
        }
        break;
    }
    return false;
  }
}

class action {
  constructor(type, obj, amnt1, amnt2){
    // Delete, Create, adjustPosition, adjustScale, groupPosition, Recolor
    this.type = type;

    // object that the action happened to
    this.obj = obj;

    // used to reverse things like moving objects or scaling objects
    // also used to store the UI Inputs of an inputed window
    // amnt1 is also used to store the changed color in recoloring actions
    this.amnt1 = amnt1;
    this.amnt2 = amnt2; 

    this.id = actions.length;
    actions.push(this);

    console.log("Created new Action:\nType: " + this.type + "\nObject Type: " + this.obj.objectType);
  }
  reverseSelf(){
    switch(this.type){
      case "Delete":
        if(this.obj.objectType == "Window") {
          let a = this.obj;
          a.UIInputs = this.amnt1;
          a.isCollapsed = this.obj.isCollapsed;
          let ti = dataToClass(this.obj.titleInp, "UIInput");
          let c1 = dataToClass(this.obj.closeButton, "UIInput");
          let c2 = dataToClass(this.obj.collapseButon, "UIInput");
          let bt = dataToClass(this.obj.bodyText, "UIInput");
          a.replaceInputs(ti, c1, c2, bt);
          a.id = drawnWindows.length;
          drawnWindows.push(a);
        }
        if(this.obj.objectType == "Drawn Item"){
          this.obj.id = drawnItems.length;
          drawnItems.push(this.obj);
        }
        console.log("Undid Delete Of Object Type: " + this.obj.objectType + " With ID: " + this.obj.id);
        break;
      case "Create":
        if(this.obj.objectType == "Window") drawnWindows[drawnWindows.length-1].close(false);
        if(this.obj.objectType == "Drawn Item") drawnItems.pop();
        console.log("Undid Creation Of Object Type: " + this.obj.objectType + " With ID: " + this.obj.id);
        break;
      case "adjustPosition":
        if(this.obj.objectType == "Window" || this.obj.objectType == "Input"){
          this.obj.inWorldX -= this.amnt1;
          this.obj.inWorldY -= this.amnt2;
        }
        if(this.obj.objectType == "Drawn Item"){
          for(let i = 0; i < this.obj.xs.length; i++){
            this.obj.xs[i] -= this.amnt1;
            this.obj.ys[i] -= this.amnt2;
            if(this.obj.objectType == "Circle") break;
          }
        }
        console.log("Undid Movement Of Object Type: " + this.obj.objectType + " With ID: " + this.obj.id);
        break;
      case "adjustScale":
        // in the case that scaling changes both the x, y, w and h vars, simply add two new actions
        // one movement change one scale change
        if(this.obj.objectType == "Window" || this.obj.objectType == "Input"){
          this.obj.w -= this.amnt1;
          this.obj.h -= this.amnt2;
          if(this.obj.objectType == "Window") this.obj.closeButton.inWorldX -= this.amnt1;
        }
        console.log("Undid Scaling Of Object Type: " + this.obj.objectType + " With ID: " + this.obj.id);
        break;
      case "groupPosition":
        for(let i = 0; i < this.obj.length; i++){
          if(this.obj[i].objectType == "Window" || this.obj[i].objectType == "Input"){
            this.obj[i].inWorldX -= this.amnt1;
            this.obj[i].inWorldY -= this.amnt2;
          }
          if(this.obj[i].objectType == "Drawn Item"){
            for(let i2 = 0; i2 < this.obj.xs.length; i++){
              this.obj[i].xs[i2] -= this.amnt1;
              this.obj[i].ys[i2] -= this.amnt2;
              if(this.obj[i].objectType == "Circle") break;
            }
          }
          console.log("Undid Movement Of Object Type: " + this.obj[i].objectType + " With ID: " + this.obj[i].id);
        }
        console.log("Undid Group Movement");
        break;
      case "Recolor":
        this.obj.fillColor = this.amnt1;
          console.log("Undid Re-Coloring Of Object Type: Drawn Item With ID: " + this.obj.id);
          break;
    }
    actions.pop();
  }
}

function keyPressed()
{
  if (keyIsDown(16) && keyIsDown(17) && keyIsDown(83)) saveSpaceAsFile();

  // copy functionality 17 = ctrl 67 = c
  if (keyIsDown(17) && keyCode === 67)
  {
    let objCopied = false;
    for (let i = 0; i < drawnWindows.length; i++)
    {
      if (drawnWindows[i].mouseIsOn() == true)
      {
        copyObject(drawnWindows[i]);
        objCopied = true;
        break;
      }
    }
    if (objCopied == false)
    {
      for (let i = 0; i < drawnItem.length; i++)
      {
        if (drawnItems[i].mouseIsOn() == true)
        {
          copyObject(drawnItems[i]);
          objCopied = true;
          break;
        }
      }
    }

  }

  // paste functionality 17 = ctrl 86 = v 
  if (keyIsDown(17) && keyCode === 86)
  {
    pasteObject();
  }

  // undo / ctrl + z functionality
  if(keyIsDown(17) && keyCode === 90){
    actions[actions.length-1].reverseSelf();
  }
}

function del(a, i2)
{
  // empty array that will replace the inputted array
  let arr1 = [];
  let arr2 = a;

  // itterate over the given array
  for (let i = 0; i < arr2.length; i++)
  {

    // if the index is equal to the given index, dont push that item into the clear array
    if (i != i2) arr1.push(arr2[i]);
    // shift the other ID's down if they were above the deleted item if they have ids
    if (i > i2 && arr2[i].id != undefined) arr2[i].id--;
  }

  // return new array
  return arr1;
}

function collc(x, y, w, h, x2, y2, w2, h2, bx, by)
{
  // apply the bezzle to the xs
  if (bx != 0 && bx != undefined)
  {
    x = x - bx / 2;
    x2 = x2 - bx / 2;
    w = w + bx;
    w2 = w2 + bx;
  }

  // apply the bezzle to the ys
  if (by != 0 && by != undefined)
  {
    y = y - by / 2;
    y2 = y2 - by / 2;
    h = h + by;
    h2 = h2 + by;
  }

  // draw hitboxes
  fill(200, 50, 50, 100);
  if (keyIsDown(72)) { rect(x, y, w, h); rect(x2, y2, w2, h2) }

  // actual collision check
  if (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2) return true;

  return false;
}

function adjustForCamera(x, y)
{
  // adjust by camera position
  x += cameraX;
  y += cameraY;

  // adjust the position for the scale arround the center point
  // tDist gets the "true distance" or simply includes negative signs
  // if X is greater than X2
  let c1 = cameraScale - 1;

  x += (c1 * (tDist(x, width / 2)));
  y += (c1 * (tDist(y, height / 2)));

  // return the position
  return createVector(x, y);
}
