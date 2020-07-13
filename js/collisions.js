function enemyCollision (magnitude, totalRadii)
{
  if ( magnitude < totalRadii )
  {
    life = life - nave._1.damage.collision.enemy;

    change( 'life', life );

    collisionEffect();

    if (life <= 0)
    {
      change( 'life', 0 );
      gameOver( 'lose' );
      playerExplosionEffect();
      morto = true;
      gameStart = false;
    }
  }
}

function bossCollision (magnitude, totalRadii)
{
  if ( magnitude < totalRadii )
  {
    life = life - nave._1.damage.collision.boss

    change( 'life', life );
    
    collisionEffect();

    if (life <= 0)
    {
      change( 'life', 0 );
      gameOver( 'lose' );
      playerExplosionEffect();
      morto = true;
      gameStart = false;
    }
  }
}



setInterval(groundCollision, 100, false);

function groundCollision ()
{
  var groundColliding = $nave.offsetTop + $nave.offsetHeight > $ground.offsetTop + 10;

  if ( gameStart && groundColliding )
  {
    life = life - nave._1.damage.collision.ground;

    change( 'life', life );

    collisionEffect();

    if ( life <= 0 )
    {
      playerExplosionEffect();
      change( 'life', 0 );
      gameOver('lose');

      morto = true;
      gameStart = false;
    }
  }
}


$( '#chao' ).pan({
  fps: 30,
  speed: 5,
  dir: 'left'
});
