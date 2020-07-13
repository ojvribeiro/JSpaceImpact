var
left = 37,
leftArrow = 65,
up = 38,
upArrow = 87,
right = 39,
rightArrow = 68,
down = 40,
downArrow = 83;


// Movimentacao da nave
window.addEventListener( 'keydown', function (event)
{
  var kP_38 = setInterval( function ()
  {
    if ( event.keyCode === 38 // W
      || event.keyCode === 87 // ↑
      && gameStart
       )
    {
      $nave.style.top = $nave.offsetTop - moveLength + 'px';

      if ( $nave.offsetTop < 10 )
      {
        $nave.style.top = $nave.offsetTop + moveLength + 'px';
      }
    }
  }, 0);

  var kP_37 = setInterval( function ()
  {
    if ( event.keyCode === 37 // A
      || event.keyCode === 65 // ←
      && gameStart
       )
    {
      $nave.style.left = $nave.offsetLeft - moveLength + 'px';

      if ( $nave.offsetLeft < 10 )
      {
        $nave.style.left = $nave.offsetLeft + moveLength + 'px';
      }
    }
  }, 0);

  var kP_39 = setInterval( function ()
  {
    if ( event.keyCode === 39 // D
      || event.keyCode === 68 // →
      && gameStart
       )
    {
      $nave.style.left = $nave.offsetLeft + moveLength + 'px';

      if ( $nave.offsetLeft > ($canvas.offsetWidth - $nave.offsetWidth) )
      {
        $nave.style.left = $nave.offsetLeft - moveLength + 'px';
      }
    }
  }, 0);

  var kP_40 = setInterval( function ()
  {
    if ( event.keyCode === 40 // S
      || event.keyCode === 83 // ↓
      && gameStart
       )
    {
      $nave.style.top = $nave.offsetTop + moveLength + 'px';
    }
  }, 0);

  window.addEventListener( 'keyup', function (event)
  {
    switch(event.keyCode)
    {
      case up: clearInterval(kP_38);
      break;
      case upArrow: clearInterval(kP_38);
      break;

      case left: clearInterval(kP_37);
      break;
      case leftArrow: clearInterval(kP_37);
      break;

      case right: clearInterval(kP_39);
      break;
      case rightArrow: clearInterval(kP_39);
      break;

      case down: clearInterval(kP_40);
      break;
      case downArrow: clearInterval(kP_40);
      break;
    }
  });
});
