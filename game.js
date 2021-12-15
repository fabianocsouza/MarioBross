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
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('cogumelo', '0wMd92p.png')

//scenes:
scene("game", ({ score }) => {
  layer(["background", "object", "ui"], "object")

  const map = [
    '=                                     =',
    '=                                     =',
    '=                                     =',
    '=                                     =',
    '=                                     =',
    '=                                     =',
    '=    %    =*=%=                       =',
    '=                                     =',
    '=                                     =',
    '=                ^         ^          =',
    '=======================================',
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
  }

  //adicionando o mapa e as configurações das sprites
  const gameLevel = addLevel(map, levelConfig)

  //Adicionando contagem de moedas
  const scoreLabel = add([
    text('Moedas: ' + score, 10),
    pos(25,10),
    layer('ui'),
    {
      value: score
    }
  ])

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
    sprite('mario'),
    solid(),
    body(),
    big(),
    pos(60,0),
    origin('bot')
  ])

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
       go('lose')
     }
   }
  })

  player.collides('moeda', (object) => {
    destroy(object)
    scoreLabel.value++
    scoreLabel.text = 'Moedas: ' + scoreLabel.value
  })

})

scene('lose', () => {
  
})
go("game", ({ score: 0 }))