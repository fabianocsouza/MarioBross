kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  clearColor: [0,0,0,1]
})

/**  Variáveis do mario que identifica quando ele esta pulando, 
 * e quando ao comer cogumelo ficará grande.
**/
let isJumping = true
let isBig =false

//rotas das sprites:
loadRoot("https://i.imgur.com/")

//Carregamento das sprites:
loadSprite('bloco', 'M6rwarW.png')
loadSprite('goomba', 'KPO3fR9.png')
loadSprite('surpresa', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('moeda', 'wbKxhcd.png')
loadSprite('cogumelo', '0wMd92p.png')

loadSprite('tijolo', 'pogC9x5.png') // tijolo
loadSprite('tubo-top-left', 'ReTPiWY.png') // tubo esquerdo
loadSprite('tubo-top-right', 'hj2GK4n.png') // tubo direito
loadSprite('tubo-bottom-left', 'c1cYSbt.png') // tubo parte de baixo esquerdo
loadSprite('tubo-bottom-right', 'nqQ79eI.png') // tubo parte de baixo direito

loadSprite('blue-bloco', 'fVscIbn.png') // bloco azul
loadSprite('blue-tijolo', '3e5YRQd.png') // tijolo azul
loadSprite('blue-aco', 'gqVoI2b.png') // bloco de aço azul
loadSprite('blue-goomba', 'SvV4ueD.png')

loadSprite('mario', 'OzrEnBy.png', {
  sliceX: 3.9,
  anims:{
    idle: {
      from: 0,
      to: 0
    },
    move: {
      from: 1,
      to: 2
    }
  }
})

//scenes:
scene("game", ({ level, score, big }) => {
  layer(["background", "object", "ui"], "object")

  const maps = [
    [
        '~                                     ~', 
        '~                                     ~',
        '~                                     ~',
        '~                                     ~',
        '~                                     ~',
        '~                                     ~',
        '~       %   =*=%=                     ~',
        '~                                     ~',
        '~                             -+      ~',
        '~                     ^   ^   ()      ~',
        '=======================================',
    ],
    [       
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/                                     /',
        '/     %%%%%%                          /',
        '/                      x x            /',
        '/                    x x x x    -+    /',
        '/           z   z  x x x x x x  ()    /',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    ],
    [
        '                                       ',
        '                              !        ',
        '                             %%%%%%    ',
        '                      !                ',
        '              %%    %%%%%              ',
        '       %%%                             ',
        '                                       ',
        '    %                                  ',
        '==     !    !   =  ^  ^    !    !      ',
        '============================    ======/',
        '                           =    =     /',
        '                                      /',
        '         !                            /',
        '       %*%                            /',
        '  -+           %                      /',
        '  ()!         !    ^                  /',
        '%%%%%%%%%%%%%%%%%%%   ================/',
        '                                       ',
        '                                       ',
        '                                       ',
      ],
      [
        '=                                     =',
        '=                                     =',
        '=                                     =',
        '=                                     =',
        '=                                     =',
        '=     ======          =               =',
        '=                  =  =  =            =',
        '=               =  =  =  =  =   -+    =',
        '=               =  =  =  =  =   ()    =',
        '=======================================',
      ],

]

  //significados para as imagens
  const levelConfig ={
    width: 20,
    height: 20,
    '=': [sprite('bloco'), solid()],
    '$': [sprite('moeda'), 'moeda'],
    '%': [sprite('surpresa'), solid(), 'moeda-surpresa'],
    '*': [sprite('surpresa'), solid(), 'cogumelo-surpresa'],
    '}': [sprite('unboxed'), solid()],
    '^': [sprite('goomba'), 'dangerous'],
    '#': [sprite('cogumelo'), 'cogumelo', body()],

    '~': [sprite('tijolo'), solid()],
    '(': [sprite('tubo-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('tubo-bottom-right'), solid(), scale(0.5)],
    '-': [sprite('tubo-top-left'), solid(), 'tubo', scale(0.5)],
    '+': [sprite('tubo-top-right'), solid(), 'tubo', scale(0.5)],
    '!': [sprite('blue-bloco'), solid(), scale(0.5)],
    '/': [sprite('blue-tijolo'), solid(), scale(0.5)],
    'z': [sprite('blue-goomba'),body(), 'dangerous', scale(0.5)],
    'x': [sprite('blue-aco'), solid(), scale(0.5)],
  }
  //https://imgur.com/3e5YRQd
  //adicionando o mapa e as configurações das sprites
  const gameLevel = addLevel(maps[level], levelConfig)

  //Adicionando contagem de moedas
  const scoreLabel = add([
    text('Moedas: ' + score, 10),
    pos(25,10),
    layer('ui'),
    {
      value: score
    }
  ])

  //Nível do jogo:
  add([text('Level:  ' + parseInt(level + 1), 10), pos(25,30)])

  //Mario ao chocar com cogumelo irá crescer.
  function big() {
    return {
      isBig(){
        return isBig;
      },
      smallify(){
        this.scale = vec2(1) // retorna a escala atual.
        isBig = false;
      },
      biggify(){
        this.scale = vec2(1.5)
        isBig = true
      }
    }
  }

  //Adicionando o mario na cena:
  const player = add([
    sprite('mario', {
      animSpeed: 0.1,
      frame: 0
    }),
    solid(),
    body(),
    big(),
    pos(60,0),
    origin('bot')
  ])

  //Validar se o mario está grande:
  if(isBig){
    player.biggify
  }

  //Movimento do mario:
  keyDown('left', () => {
    player.flipX(true)
    player.move(-120,0)
  })

  keyDown('right', () => {
    player.flipX(false)
    player.move(120,0)
  })

  keyPress('space', () => {
     if(player.grounded()){
       player.jump(390)
       isJumping = true
     }
  })
// Animação do mario em movimento
  keyPress('left', () => {
    player.flipX(true)
    player.play('move')
 })
 keyPress('right', () => {
  player.flipX(false)
  player.play('move')
})

// Animação do mario em parado
keyRelease('left', () => {
  player.flipX(true)
  player.play('idle')
})
keyRelease('right', () => {
  player.flipX(false)
player.play('idle')
})

  //* Ação dos personagem do game: *
  //goomba inimigo do mario:
  action('dangerous', (object) => {
    object.move(-20, 0)
  })

  // *Mario: *
  player.action(() => {
    if(player.grounded()){
      isJumping = false
    }
  })

  //quando bater na caixa apareça a moeda ou cogumelo:
  player.on('headbutt', (object) => {
    if(object.is('moeda-surpresa')){
      gameLevel.spawn('$', object.gridPos.sub(0,1))
      destroy(object)
      gameLevel.spawn('}', object.gridPos.sub(0,0))
    }

    if(object.is('cogumelo-surpresa')){
      gameLevel.spawn('#', object.gridPos.sub(0,1))
      destroy(object)
      gameLevel.spawn('}', object.gridPos.sub(0,0))
    }
  })

  action('cogumelo', (object) => {
    object.move(20,0)
  })

  // * colisões *
  //mario cresce
  player.collides('cogumelo', (object) => {
    destroy(object)
    player.biggify()
  })

  //mario fica pequeno / até game over ao colidir com goomba
  player.collides('dangerous', (object) => {
   if(isJumping){
     destroy(object)
   }else {
     if(isBig){
       player.smallify()
     }else {
       go('lose', {score: scoreLabel.value})
     }
   }
  })

  //colisões com a moeda
  player.collides('moeda', (object) => {
    destroy(object)
    scoreLabel.value++
    scoreLabel.text = 'Moedas: ' + scoreLabel.value
  })

   //colisões com o tubo, irá para um outro nível.
   player.collides('tubo', () => {
      keyPress('down', () => {
        go('game', {
          level: (level + 1) % maps.length,
          score: scoreLabel.value,
          Big: isBig
        })
      })
   })

})

//Cenário de game over
scene('lose', ({score}) => {
  add([text('Score: ' + score, 20), origin('center'), pos(width()/2, height()/2)])
  keyPress('space', () => {
    go("game", { level: 0, score: 0, big: isBig })
  })
})
go("game", ({level: 0, score: 0, big: isBig }))