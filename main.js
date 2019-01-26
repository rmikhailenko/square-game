var Game = {
  'Score': 0,
  'InProgress': false,
  'Items': []
}

var addItemInterval
var canvas
var scoreElement

document.body.onload = initGame

function initGame () {
  canvas = document.getElementById('canvas')
  canvas.addEventListener('click', function (event) {
    var cx = event.pageX - canvas.offsetLeft
    var cy = event.pageY - canvas.offsetTop
    checkClickOnSquare(cx, cy)
  })

  scoreElement = document.getElementById('score')

  // Start Button Click
  var startBtn = document.getElementById('startGame')
  startBtn.addEventListener('click', StartGame)

  // Stop Buttom Click
  var stopBtn = document.getElementById('stopGame')
  stopBtn.addEventListener('click', StopGame)
}

function StartGame() {
  if (!Game.InProgress) {
    Game.InProgress = true
    addItemInterval = setInterval(addItem, 1000, false)
    addItem(true)
    animate()
  }
}

function StopGame() {
  Game.InProgress = false
  Game.Items = []
  deleteScore()
  animate()
  clearInterval(addItemInterval)
}

function addItem (firstItem) {
  // do not add more than 10 items
  if (Game.Items.length > 10) {
    return
  }
  var timeout = GetRandom(1000, 2000)
  if (firstItem) {
    timeout = 0
  }

  setTimeout(function () {
    Game.Items.push({
      'x': GetRandom(0, 600),
      'y': 0,
      'a': GetRandom(30, 40),
      'speed': GetRandom(1, 5),
      'color': GetRandomColor()
    })
  }, timeout)
}

function GetRandom (min, max) {
  return min + Math.floor(Math.random() * max)
}

function GetRandomColor () {
  function c () {
    var hex = Math.floor(Math.random() * 256).toString(16)
    return ('0' + String(hex)).substr(-2)
  }
  return '#' + c() + c() + c()
}

function increaseScore () {
  Game.Score += 1
  scoreElement.innerHTML = Game.Score
}

function deleteScore () {
  Game.Score = 0
  scoreElement.innerHTML = Game.Score
}

function checkClickOnSquare (cx, cy) {
  var onSquare = false
  var elemToDelete
  for (var i = 0; i < Game.Items.length; i++) {
    var element = Game.Items[i]
    var matchX = element.x <= cx && cx <= element.x + element.a
    var matchY = element.y <= cy && cy <= element.y + element.a
    if (matchX && matchY) {
      elemToDelete = i
      onSquare = true
      break
    }
  }

  if (onSquare) {
    Game.Items.splice(elemToDelete, 1)
    increaseScore()
  }
}

function animate () {
  var ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth)

  if (Game.InProgress) {
    var items = Game.Items
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      ctx.fillStyle = item.color
      ctx.fillRect(item.x, item.y, item.a, item.a)

      item.y += item.speed
      if (item.y >= canvas.clientHeight) {
        item.y = 0
      }
    }

    requestAnimationFrame(animate)
  }
}
