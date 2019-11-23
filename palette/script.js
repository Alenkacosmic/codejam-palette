/* eslint-disable no-var */
/* eslint-disable no-bitwise */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const canvas = document.getElementById('switcher');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');
const scale = 4;
const pixelWidth = 512 / scale;
const pixelHeight = 512 / scale;
const drawPos = [];
let pixelColor = currentColor.value;
let previousColor = '#FFEB3B';


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

canvas.addEventListener('mousedown', function (e) {
  if (choose.classList.contains('chosenInstrument')) {
    const pos = findPos(this);
    const x = e.pageX - pos.x;
    const y = e.pageY - pos.y;
    const coord = `x=${x}, y=${y}`;
    const c = this.getContext('2d');
    const p = c.getImageData(x, y, 1, 1).data;
    const hex = `#${(`000000${rgbToHex(p[0], p[1], p[2])}`).slice(-6)}`;
    currentColor.value = hex;
    pixelColor = hex;
    console.log(hex);
  }
});

function findPos(obj) {
  let curleft = 0;
  let curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return { x: curleft, y: curtop };
  }
  return undefined;
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) { throw 'Invalid color component'; }
  return ((r << 16) | (g << 8) | b).toString(16);
}

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
    canvas.removeEventListener('mousedown', startDrawing);
    ctx.fillStyle = currentColor.value;
    ctx.fillRect(0, 0, 512, 512);
  }
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

function recordMouseMovement(event) {
  mouse = getMousePos(event);
}

function startDrawing(event) {
  if (event.button === 0 && pencil.classList.contains('chosenInstrument')) {
    var mark = setInterval(() => {
      const pos = mouse;
      if (pos.color !== currentColor.value) {
        pos.color = currentColor.value;
        drawPos.push(pos);
      }
    }, 10);
  }
  function stopDrawing(event) {
    clearInterval(mark);
  }
  canvas.addEventListener('mouseup', stopDrawing);
}

canvas.addEventListener('mousemove', recordMouseMovement);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawImage);
canvas.addEventListener('mousedown', fillBucket);

instruments.addEventListener('click', chooseInstrument);
document.addEventListener('keyup', chooseInstrument);

colours.addEventListener('mouseup', changeColorOut);

currentColor.addEventListener('input', changeCurrent);
