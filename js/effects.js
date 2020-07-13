function playerExplosionEffect ()
{
  $( 'div[id^="nave-"]' )
    .addClass( 'you-destroyed' );
  setTimeout( function ()
  {
    $( 'div[id^="nave-"]' )
      .removeClass( 'you-destroyed' )
        .hide();
  }, 500);
}




function collisionEffect ()
{
  if ( gameStart )
  {
    $( $nave )
      .addClass( 'player-hit' );
      setTimeout( function ()
      {
        $( $nave )
        .removeClass( 'player-hit' );
      }, 100);
  }
}
