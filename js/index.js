/*
  * autor : Victor Ribeiro
  * link  : http://jvribeiro.github.io/
*/
  var
  rateOfFire,
  gameStart,
  morto,
  life,
  score,
  tangivel,
  moveLength,
  $canvas,
  $nave,
  $ground,

  bullet = document.querySelector( '.bullet' )

  canvas =
  {
    width       :   720,
    height      :   480,

    desenha     :     function ()
    {
      var c = document.createElement( 'div' );
          c.id = 'canvas';
          c.style.width = this.width + 'px';
          c.style.height = this.height + 'px';

      document.querySelector( '#content' ).appendChild(c);

      $canvas = document.querySelector( '#' + c.id );
    }
  },

  ground = {
    desenha     :     function ()
    {
      var g = document.createElement( 'div' );
          g.id = 'chao';

      $canvas.appendChild(g);

      $ground = document.querySelector( '#' + g.id );
    }
  },

  nave =
  {
    _1  : // Numero da nave (de acordo com a posicao na loja)
    {
      id          :   'nave-1',   // id do CSS [nave._1.id]
      class       :   'nave',     // class do CSS [nave._1.class]
      name        :   'Geneva',   // Nome do personagem [nave._1.name]
      sprite      :   'nave.png', // Imagem do personagem (com extensão) [nave._1.sprite]

      diameter    :   60, // Tamanho da nave

      moveLength  :   20, // Distancia em px de cada movida

      damage      : // Danos causados a esse personagem
      {
        bullet          :          // | Danos por balas comuns:
        {                          // |
          enemy             :   3, // | wsws menores
          boss              :   7  // | Boss
        },

        missile         :   40, // Danos por misseis

        laser           :   80, // Danos por laser

        collision       :            // | Danos por colisao:
        {                            // |
          enemy             :   15,  // | colisao com inimigos menores [nave.damage.collision.enemy]
          boss              :   30,  // | colisao com Boss [nave.damage.collision.boss]
          ground            :   100   // | colisao com o chao [nave.damage.collision.ground]
        }
      },

      rateOfFire  :   900, // Cadência de tiro (o valor determina os intervalos [em milissegundos] entre cada bala)

      desenha     :   function ()
      {
        var n = document.createElement( 'div' );
            n.id = this.id;
            n.className = this.class;
            n.style.width = this.diameter + 'px';
            n.style.height = this.diameter + 'px';
            n.style.backgroundImage = 'url(img/' + this.sprite + ')';

        $canvas.appendChild(n);

        $nave = document.querySelector( '.' + this.class );
        moveLength = this.moveLength;
      }
    }
  },

  enemy =
  {
    zigzag    :
    {
      class       :     'inimigo zigzag',

      desenha     :     function ()
      {
        var e = Math.floor( Math.random() * 10000 ),

            i = document.createElement( 'div' );
            i.className = this.class;
            i.id = 'zigzag-' + e;

            $canvas.appendChild(i);

            $inimigo = document.querySelector( '.inimigo' );

            // Colisão com o inimigo
            setInterval(function ()
            {
              var
              vx = (document.querySelector( '#zigzag-' + e ).offsetLeft + document.querySelector( '#zigzag-' + e ).offsetWidth / 2) - ($nave.offsetLeft + $nave.offsetWidth / 2),
              vy = (document.querySelector( '#zigzag-' + e ).offsetTop + document.querySelector( '#zigzag-' + e ).offsetHeight / 2) - ($nave.offsetTop + $nave.offsetHeight / 2),
              totalRadii = ($nave.offsetWidth / 2) + (document.querySelector( '#zigzag-' + e ).offsetWidth / 2),
              magnitude = Math.sqrt(vx * vx + vy * vy); // Teorema de Pitágoras

              enemyCollision(magnitude, totalRadii);
            }, 200);
      }
    },

    linear    :
    {
      class       : 'inimigo linear',

      desenha     : function ()
      {
        var e = Math.floor(Math.random() * 10000),
            f = Math.floor(Math.random() * 250),

            i = document.createElement('div');
            i.className = this.class;
            i.id = 'linear-' + e;
            i.style.top = f + 'px';

        $canvas.appendChild(i);

        $inimigo = document.querySelector('.inimigo');

        // Colisão com o inimigo
        setInterval(function ()
        {
          var vx = ( document.querySelector( '#linear-' + e ).offsetLeft + document.querySelector( '#linear-' + e ).offsetWidth / 2 ) - ( $nave.offsetLeft + $nave.offsetWidth / 2 ),
              vy = ( document.querySelector( '#linear-' + e ).offsetTop + document.querySelector( '#linear-' + e ).offsetHeight / 2 ) - ( $nave.offsetTop + $nave.offsetHeight / 2 ),
              totalRadii = ( $nave.offsetWidth / 2 ) + ( document.querySelector( '#linear-' + e ).offsetWidth / 2 ),
              magnitude = Math.sqrt( vx * vx + vy * vy ); // Teorema de Pitágoras

              enemyCollision(magnitude, totalRadii);
        }, 200);
      }
    }
  },

  boss = {
    _1  :
    {
      id          :   'boss-1',
      class       :   'boss',
      name        :   '', // Nome do personagem
      sprite      :   '', // Imagem do personagem (com extensão)

      diameter    :   135, // Tamanho do boss

      damage      : // Danos causados a esse personagem
      {
        bullet        :   1,
        missile       :   20,
        laser         :   30,
        annihilation  :   70,
        player        :   5
      },

      rateOfFire  :   1000, // Cadência de tiro (o valor determina os intervalos entre cada bala)

      desenha     :   function () // Desenha o personagem na tela
      {
        var b = document.createElement('div');
            b.id = this.id;
            b.className = this.class;
            b.style.width = this.diameter + 'px';
            b.style.height = this.diameter + 'px';
            b.style.right = '20px';
            b.style.backgroundImage = 'url(img/' + this.sprite + ')';

        rateOfFire = this.rateOfFire;

        $canvas.appendChild(b);

        $boss = document.querySelector('.boss');

        // Colisão com o inimigo
        setInterval(function ()
        {
          var
          vx = ( document.querySelector( '.boss' ).offsetLeft + document.querySelector( '.boss' ).offsetWidth / 2 ) - ( $nave.offsetLeft + $nave.offsetWidth / 2 ),
          vy = ( document.querySelector( '.boss' ).offsetTop + document.querySelector( '.boss' ).offsetHeight / 2 ) - ( $nave.offsetTop + $nave.offsetHeight / 2 ),
          totalRadii = ( $nave.offsetWidth / 2 ) + ( document.querySelector( '.boss' ).offsetWidth / 2 ), // Raio total do boss
          magnitude = Math.sqrt( vx * vx + vy * vy ); // Teorema de Pitágoras (c² = a² + b²)

          bossCollision(magnitude, totalRadii);
        }, 200);
      }
    }

  };



// Código das teclas
/*
window.addEventListener('keydown',function(event) {
  console.log(event.keyCode);
});*/


function run ()
{
  canvas.desenha();
  ground.desenha();
  nave._1.desenha();
  boss._1.desenha();
  enemy.zigzag.desenha();
  enemy.linear.desenha();
  setTimeout(function ()
  {
    enemy.zigzag.desenha();
    enemy.linear.desenha();
  }, 5000);

  gameStart = true;
  morto = false;
  life = 100;
  score = 0;
  tangivel = true;

  change('score', score);
  change('life', life);
}

run();




function invencivel() {
  tangivel = false;
}









function change (selector, value)
{
  if (selector === 'score')
  {
    document.querySelector( '#'+selector ).innerHTML = 'score: ' + value;
  }
  else
  {
    document.querySelector( '#'+selector ).innerHTML = 'fuselagem: ' + value + '%';
  }
}









function gameOver (message)
{
  if ( message === 'win' )
  {
  $( '#gameover' )
    .html( 'Você venceu a batalha<br>Clique para reiniciar' )
      .show();
  }
  else
  if ( message === 'lose' )
  {
    $( '#gameover' )
      .html( 'Você foi destruído<br>Clique para reiniciar' )
        .show();
  }
}






function shoot ()
{
  //bala.me.desenha();
  var j = Math.floor( Math.random() * 10000 );

        if ( gameStart )
        {
          var bala = document.createElement( 'div' );
              bala.className = 'bullet';
              bala.id = 'bullet-' + j;
              bala.style.top = $nave.offsetTop + 30 + 'px';
              bala.style.left = $nave.offsetLeft + 30 + 'px';
        }

        $canvas.appendChild(bala);
        $( '#bullet-' + j )
          .addClass( 'shot' );

  var hit = setInterval( function ()
  {
    if ( gameStart
      && $( '.bullet' ).is( ':visible' )
      && document.querySelector( '.bullet' ).offsetLeft > $inimigo.offsetLeft
      && document.querySelector( '.bullet' ).offsetLeft < ( $inimigo.offsetLeft + $inimigo.offsetWidth )
      && document.querySelector( '.bullet' ).offsetTop > $inimigo.offsetTop
      && document.querySelector( '.bullet' ).offsetTop < ( $inimigo.offsetTop + $inimigo.offsetHeight )
       )
    {
      console.log('hit');
      $( $inimigo )
        .addClass( 'boss-hit' );
      setTimeout( function ()
      {
        $( $inimigo )
          .removeClass( 'boss-hit' );
      }, 100);

      if ( $( '.bullet' ).hasClass('shot') )
      {
        score = score + 10;
        $( '.bullet' )
          .remove();
      }

      change('score', score);
    }

    if ( gameStart
      && $( '.bullet' ).is( ':visible' )
      && document.querySelector( '.bullet' ).offsetLeft > $boss.offsetLeft
      && document.querySelector( '.bullet' ).offsetLeft < ( $boss.offsetLeft + $boss.offsetWidth )
      && document.querySelector( '.bullet' ).offsetTop > $boss.offsetTop
      && document.querySelector( '.bullet' ).offsetTop < ( $boss.offsetTop + $boss.offsetHeight )
       )
    {
      $( $boss )
        .addClass( 'boss-hit' );
      setTimeout(function ()
      {
        $( $boss )
          .removeClass( 'boss-hit' );
      }, 100);

      if ( $( '.bullet' ).hasClass( 'shot' ) )
      {
        score = score + 10;

        $( '.bullet' )
          .remove();
      }

      change('score', score);

      if ( score >= 1000 )
      {
        $( $boss )
          .fadeOut();
        $( '.shot' )
          .remove();
        $( '.boss-shot' )
          .remove();
        $( 'div[class*="bullet-"]' )
          .remove();

        gameOver( 'win' );

        $( $nave )
          .addClass( 'you-win' );

        gameStart = false;
      }

      clearInterval(hit);
    }
  }, 0);


  var lose = setInterval( function ()
  {
    var g = Math.floor( Math.random() * 10000 );

    if ( gameStart
      && $( '.bullet' ).hasClass( 'shot' )
      && document.querySelector( '.bullet' ).offsetLeft > $canvas.offsetWidth
       )
    {
      $( '.shot' ).addClass( 'bullet-'+g );
      $( '.bullet-'+g ).addClass( 'shoted' );

      if ($( 'bullet-'+g ).hasClass( 'shoted' ))
      {
      $( 'bullet-'+g )
        .remove();
      }
      clearInterval(lose);
    }
  }, 0);



}






function missile ()
{
  var m = Math.floor( Math.random() * 10000 );

  var missil = document.createElement( 'div' );
      missil.className = 'missile-' + m;
      missil.style.top = $nave.offsetTop + 30 + 'px';
      missil.style.left = $nave.offsetLeft + 30 + 'px';

      $canvas.appendChild(missil);
      $( '.missile-' + m )
        .addClass( 'missile' );

  var missile_hit = setInterval( function ()
  {
    if ( gameStart
      && document.querySelector( '.missile-' + m ).offsetTop > ( $boss.offsetTop + $boss.offsetHeight )
      || document.querySelector( '.missile-' + m ).offsetTop > ( $inimigo.offsetTop + $inimigo.offsetHeight )
       )
    {
      document.querySelector( '.missile-' + m ).style.top = document.querySelector( '.missile-' + m ).offsetTop - 30+'px';
      document.querySelector( '.missile-' + m ).style.transform = 'rotate(-45deg)';
    }

    if ( gameStart
      && document.querySelector( '.missile-' + m ).offsetTop < $boss.offsetTop
      || document.querySelector( '.missile-' + m ).offsetTop < $inimigo.offsetTop
       )
    {
      document.querySelector( '.missile-' + m ).style.top = document.querySelector( '.missile-' + m ).offsetTop + 30+'px';
      document.querySelector( '.missile-' + m ).style.transform = 'rotate(45deg)';
    }

    else
    {
      document.querySelector( '.missile-' + m ).style.transform = 'rotate(0deg)';
    }
  }, 100);


  var hit = setInterval( function ()
  {
  if ( gameStart
      && $( '.missile-' + m ).is( ':visible' )
      && document.querySelector( '.missile-' + m ).offsetLeft > $inimigo.offsetLeft
      && document.querySelector( '.missile-' + m ).offsetLeft < ( $inimigo.offsetLeft + $inimigo.offsetWidth )
      && document.querySelector( '.missile-' + m ).offsetTop > $inimigo.offsetTop
      && document.querySelector( '.missile-' + m ).offsetTop < ( $inimigo.offsetTop + $inimigo.offsetHeight )
       )
    {
      $( $inimigo )
        .addClass( 'boss-hit' );
      setTimeout( function ()
      {
        $( $inimigo )
          .removeClass( 'boss-hit' );
      }, 100);

      if ( $( '.missile-' + m ).hasClass('missile') )
      {
        score = score + 10;

        $( '.missile-' + m )
        .remove();
      }

      change('score', score);

      clearInterval(hit);
      clearInterval(missile_hit);
    }

    if ( gameStart
      && $( '.missile-' + m ).is( ':visible' )
      && document.querySelector( '.missile-' + m ).offsetLeft > $boss.offsetLeft
      && document.querySelector( '.missile-' + m ).offsetLeft < ( $boss.offsetLeft + $boss.offsetWidth )
      && document.querySelector( '.missile-' + m ).offsetTop > $boss.offsetTop
      && document.querySelector( '.missile-' + m ).offsetTop < ( $boss.offsetTop + $boss.offsetHeight )
       )
    {
      $( $boss )
        .addClass( 'boss-hit' );
      setTimeout(function ()
      {
        $( $boss )
          .removeClass( 'boss-hit' );
      }, 100);

      if ( $( '.missile-' + m ).hasClass('missile') )
      {
        score = score + 10;

        $( '.missile-' + m )
        .remove();
      }

      change('score', score);

      if ( score >= 1000 )
      {
        $( $boss )
          .fadeOut();
        $( '.shot' )
          .remove();
        $( '.boss-shot' )
          .remove();
        $( 'div[class*="missile-"]' )
          .remove();

        gameOver( 'win' );

        $( $nave )
          .addClass( 'you-win' );

        gameStart = false;
      }

      clearInterval(hit);
      clearInterval(missile_hit);
    }
  }, 0);


  var lose = setInterval( function ()
  {
    if ( gameStart
      && $( '.missile-' + m ).hasClass( 'missile' )
      && document.querySelector( '.missile-' + m ).offsetLeft > $canvas.offsetWidth
       )
    {
      $( '.missile-' + m )
        .remove();

      clearInterval(lose);
      clearInterval(missile_hit);
    }
  }, 0);
}




function bossShoot ()
{
  var i = Math.floor(Math.random() * 10000),
      b = Math.floor(Math.random() * 135);

  if ( gameStart )
  {
    var bala = document.createElement( 'div' );
        bala.className = 'enemy-bullet-' + i;
        bala.style.top = $boss.offsetTop + b + 'px';
        bala.style.left = $boss.offsetLeft + 70 + 'px';


    $canvas.appendChild(bala);
    $( '.enemy-bullet-' + i )
      .addClass( 'boss-shot' );
  }

  var hitOnMe = setInterval( function ()
  {
    if ( gameStart
      && tangivel
      && $( '.enemy-bullet-' + i ).is( ':visible' )
      && document.querySelector( '.enemy-bullet-' + i ).offsetLeft > $nave.offsetLeft
      && document.querySelector( '.enemy-bullet-' + i ).offsetLeft < ( $nave.offsetLeft + $nave.offsetWidth )
      && document.querySelector( '.enemy-bullet-' + i ).offsetTop > ( $nave.offsetTop + 10 )
      && document.querySelector( '.enemy-bullet-' + i ).offsetTop < ( $nave.offsetTop + ( $nave.offsetHeight - 10 ) )
       )
    {
      $( '.enemy-bullet-' + i )
        .removeClass( 'boss-shot' );

      $( $nave )
        .addClass( 'player-hit' );
      setTimeout( function ()
      {
        $( $nave )
          .removeClass( 'player-hit' );
      }, 100);


      life = life - nave._1.damage.bullet.boss;

      change('life', life);

      clearInterval(hitOnMe);


      setTimeout( function ()
      {
        if ( life <= 0 )
        {
          morto = true;
          gameStart = false;

          $( 'div[class*="bullet-"]' )
            .remove();

          gameOver( 'lose' );

          playerExplosionEffect();

          change('life', 0);
        }
      }, 100);
    }

    else
    {
      return false;
    }
  }, 50);

  var lose2 = setInterval( function ()
  {
    if ( $( '.enemy-bullet-' + i ).is( ':visible' )
      && document.querySelector( '.enemy-bullet-' + i ).offsetLeft < 0
      )
    {
      $( '.enemy-bullet-' + i )
        .remove();
      clearInterval(lose2);
    }
  }, 0);
}





setInterval( function ()
{
  if ( gameStart
    && $nave.offsetTop > $boss.offsetTop
    && $nave.offsetTop < ( $boss.offsetTop + $boss.offsetHeight )
     )
  {
    setTimeout( function ()
    {
      bossShoot();
    }, 100); // Percepção do boss (quanto menor o valor, maior a percepcao)
  }
}, rateOfFire); // Cadencia de tiro do boss (quanto menor o valor, maior a cadencia)








function special () {
  missile();
}




$canvas.addEventListener( 'mousedown', function (event)
{
  if ( gameStart )
  {
    switch ( event.which ) {
      case 1:
        shoot();
        var mousedown = setInterval( function ()
        {
          shoot();
        }, nave._1.rateOfFire);

        $canvas.addEventListener( 'mouseup', function ()
        {
          clearInterval(mousedown);
        });
        break;
      case 3:
        special();
        return false;
        break;
    }
  }
});



$(document).on('contextmenu',function() {
  return false;
});
