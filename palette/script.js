/* eslint-disable no-undef */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
const canvas = document.getElementById('switcher');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');
const scale = 4;
const pixelWidth = 512 / scale;
const pixelHeight = 512 / scale;
const drawPos = [];
const currentColor = document.getElementById('currentColor');
const pencil = document.getElementById('pencil');
const bucket = document.getElementById('bucket');
const prevColor = document.getElementById('prevColor');
const dataURL = localStorage.getItem('switcherThe');
const choose = document.getElementById('choose');
let pixelColor = currentColor.value;
let previousColor = '#FFEB3B';

if (dataURL !== null) {
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
}

function changeCurrent(event) {
  const prevCurrentColor = pixelColor;
  previousColor = prevCurrentColor;
  prevColor.style.backgroundColor = previousColor;
  pixelColor = event.target.value;
}

function rgbStringToHex(rgb) {
  const arr = rgb.split(/\D+/);
  let hex = '';
  arr.forEach((element) => {
    if (element !== '') {
      if (+element < 10) {
        hex += `0${element}`;
      } else {
        hex += Number(element).toString(16);
      }
    }
  });
  return `#${hex}`;
}

function changeColorOut(event) {
  let defaultColor;

  if (event.target.classList.contains('red')) {
    defaultColor = getComputedStyle(event.target.children[0]).backgroundColor;
  } else if (event.target.classList.contains('blue')) {
    defaultColor = getComputedStyle(event.target.children[0]).backgroundColor;
  } else if (event.target.classList.contains('prev')) {
    defaultColor = getComputedStyle(event.target.children[0]).backgroundColor;
  }

  defaultColor = rgbStringToHex(defaultColor);
  currentColor.value = defaultColor;
  pixelColor = defaultColor;
}

function mouseForPicker(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  return [x, y];
}

/* formula doesnt work without bitwise */


function rgbToHex(r, g, b) {
  // eslint-disable-next-line no-bitwise
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function getColor(position) {
  if (choose.classList.contains('chosenInstrument')) {
    const x = position[0];
    const y = position[1];
    const color = ctx.getImageData(
      Math.floor(x / (512 / canvas.height)),
      Math.floor(y / (512 / canvas.width)), 1, 1,
    ).data;
    const newColor = rgbToHex(color[0], color[1], color[2]);
    if (newColor !== pixelColor) {
      currentColor.value = newColor;
      pixelColor = newColor;
    }
  }
}

function chooseColor(event) {
  getColor(mouseForPicker(event));
}

canvas.addEventListener('mousedown', chooseColor);

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (Math.round((event.clientX - rect.left - (pixelWidth / 2)) / pixelWidth) * pixelWidth),
    y: (Math.round((event.clientY - rect.top - (pixelHeight / 2)) / pixelHeight) * pixelHeight),
  };
}

function drawImage() {
  let p = 0;
  while (p < drawPos.length) {
    ctx.fillStyle = drawPos[p].color || pixelColor;
    ctx.fillRect(drawPos[p].x, drawPos[p].y, pixelWidth, pixelHeight);
    p += 1;
  }
}

function fillBucket() {
  if (bucket.classList.contains('chosenInstrument')) {
    ctx.fillStyle = currentColor.value;
    drawPos.fill(ctx.fillStyle);
    ctx.fillRect(0, 0, pixelWidth * scale, pixelHeight * scale);
  }
}

/* use "var" cause it gives me way to use variable outside the function */

function startDrawing(event) {
  if (event.button === 0 && pencil.classList.contains('chosenInstrument')) {
    var mark = setInterval(() => {
      var pos = mouse;
      if (pos.color !== currentColor.value) {
        pos.color = currentColor.value;
        drawPos.push(pos);
      }
    }, 10);
  }
  function stopDrawing() {
    // eslint-disable-next-line block-scoped-var
    clearInterval(mark);
  }
  canvas.addEventListener('mouseup', stopDrawing);
}

function chooseInstrument(event) {
  if (event.target.tagName === 'LI' && !event.target.classList.contains('inactive')) {
    const instrument = document.querySelectorAll('.type');
    instrument.forEach((item) => {
      if (item.classList.contains('chosenInstrument')) {
        item.classList.remove('chosenInstrument');
      }
    });

    event.target.classList.add('chosenInstrument');
    canvas.addEventListener('mousedown', startDrawing);
  } else if (event.type === 'keyup') {
    const instrument = document.querySelectorAll('.type');
    instrument.forEach((item) => {
      if (item.classList.contains('chosenInstrument')) {
        item.classList.remove('chosenInstrument');
      }
    });
    if (event.code === 'KeyP') {
      const button = document.querySelector('.pencil');
      button.classList.add('chosenInstrument');
      canvas.addEventListener('mousedown', startDrawing);
    } else if (event.code === 'KeyB') {
      const button = document.querySelector('.bucket');
      button.classList.add('chosenInstrument');
    } else if (event.code === 'KeyC') {
      const button = document.querySelector('.choose');
      button.classList.add('chosenInstrument');
    }
  }
}

/* use undef cause that gives me way to use mouse outside the function and before it's assigent */

function recordMouseMovement(event) {
  mouse = getMousePos(event);
}

canvas.addEventListener('click', () => {
  localStorage.setItem('switcherThe', canvas.toDataURL());
});

canvas.addEventListener('mousemove', recordMouseMovement);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawImage);
canvas.addEventListener('mousedown', fillBucket);

document.getElementById('instruments').addEventListener('click', chooseInstrument);
document.addEventListener('keyup', chooseInstrument);

document.getElementById('colours').addEventListener('mouseup', changeColorOut);

document.getElementById('currentColor').addEventListener('input', changeCurrent);
