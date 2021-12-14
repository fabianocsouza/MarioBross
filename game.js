kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  clearColor: [0,0,0,1]
})

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
scene("game", () => {
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

  //Adicionando o mario na cena:
  const player = add([
    sprite('mario'),
    solid(),
    body(),
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
     }
  })
})

go("game")