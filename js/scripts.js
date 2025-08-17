
(function($) {
	
	$(function(){
		
		// variáveis do jogo
		let button_start = $(".button-start")
		let game_start = $("#game-start")
		let fly = $(".fly")
		let game_body = $("body")
		let game_play = $("#game-play")
		let info = $("#info")
		let finger = $("#finger")
		
		// cria em memória a tag audio
		let sound = $("<audio />")
		let killSound = $("<audio />")
		
		
		// cria em memória a tag source
		let	source = $("<source />")
		
		let flies
		
		let life = $("#life")
		let score = 0
		let time = 60		

		let bombUnlocked = false; // controle para não criar várias bombas
		let flyIntervalTime = 600; // tempo inicial entre moscas
		let flyInterval; // para controlar o setInterval das moscas
		
		// métodos do jogo
		
		button_start.click(() => {
			game_start.hide()
			
			// start game
			startGame()
		})
		
		function startGame() {
			startBackgroundSound()
			createFly()
			addEventClick()
			deleteBug()
			energy()
		}
		
		function startBackgroundSound() {
			sound.attr({
				"autoplay": "autoplay",
				"loop": "loop"
			})
			
			// adiciona atributos na tag source
			source.attr({
				"src": "sounds/background.mp3",
				"type": "audio/mp3"
			})
			
			sound.append(source)
		}

	

		// cria a bomba depois de 50 pontos
		function createBomb() {
			let windowX = getPositionX();

			let bomb = $("<div class='bomb' />").css({
				"top": "110%",   // começa fora da tela
				"left": windowX + "px",
				"position": "absolute"
			});

			bomb.on("click touchstart", activateBomb);

			game_play.append(bomb);

			// faz a bomba subir
			let moveBomb = setInterval(() => {
				let currentTop = parseInt(bomb.css("top"));
				if (currentTop <= -50) { // saiu da tela
					clearInterval(moveBomb);
					bomb.remove();
				} else {
					bomb.css("top", (currentTop - 2) + "px"); // ajusta velocidade
				}
			}, 30);
		}

		// ativa a bomba
		function activateBomb() {
			let killedFlies = $(".fly").length; // todas as moscas na tela
			score += killedFlies;               // adiciona ao score
			$("#score span").text(score);       // atualiza a tela
			lifePlus(score);                    // vidas extras se houver

			$(".fly").remove();                 // remove todas as moscas
			$(this).remove();                   // remove a bomba

			// acelera as moscas após usar a bomba
			if (flyIntervalTime > 200) {       // limite mínimo de 200ms
				flyIntervalTime -= 100;        // aumenta a velocidade
				clearInterval(flyInterval);    // reseta o intervalo
				createFly();                   // reinicia com nova velocidade
			}
		}

		
		function createFly() {
			setInterval(() => {
				
				// largura e altura da janela
				windowX = getPositionX()
				windowY = getPositionY()
				
				// gera valores aleatórios baseados na largura e altura
				posX = setPositionX(100, windowX)				
				posY = setPositionY(100, windowY)	
			
				fly = $("<div />")
				fly.attr({
					"class": "fly"
				})
				
				fly.css({
					"top": "110%",
					"left": posX + "px"
				})
				
				game_play.append(fly)

				flies = $(".fly")
				
			}, flyIntervalTime)
		}
		
		function getPositionX() {
			windowWidth = $(window).width() - 100;
			return windowWidth
		}
		
		function getPositionY() {			
			windowHeight = $(window).height() - 100;
			return windowHeight
		}
		
		function setPositionX(min, max) {
			return posX = Math.ceil(Math.random() * (max - min) + min)
		}
		
		function setPositionY(min, max) {
			return posY = Math.ceil(Math.random() * (max - min) + min)
		}
		
		
		function addEventClick() {
			setInterval(() => {
				
				$.each(flies, function(index, element){
					element.addEventListener("click", killBug)
					element.addEventListener("touchstart", killBug)
					element.addEventListener("click", altera)
					
				})
				
			}, 500)
		}
		
		function deleteBug() {
			setInterval(() => {
				
				$.each(flies, (index, element) => {
					//Position = guarda a Posicisão de todos os elementos
					position = $(element).position().top

					if(position < -10) {
						$(element).remove()
						lifeMinus()						
					}
				})
				
			}, 30)
		}
		
		window.onclick = altera;
		//Altera a mosca para Morta
		function altera() {
			$(this).css({
				"background": "url(imagens/deadlyFly.png)",
				"animation-play-state": "paused"
			})
		}
		
		function killBug() {
			
			setInterval(() => {
				$(this).remove()
			}, 1000)
			killBugSound()
			setScore()
			lifePlus(score)
		}
		
		function killBugSound() {			
			killSound.attr({
				"autoplay": "autoplay",
				"src": "sounds/fart.wav"
			})
			
		}
		//Cria Vida		
		function createLife() {
			heart = $("<i />")
			heart.attr({
				"class": "fa fa-heart"
			})
			//.text("<3")
			life.append(heart)
		}
		//Você começa o jogo com 3 vidas
		function energy() {
			for(i=0; i<5; i++) {
				createLife()
			}
		}
		//A cada 5 moscas mortas você ganha uma vida
		function lifePlus(value) {			
			if((value % 5) == 0) {
				createLife()				
			}
		}
		//Adiciona ponto a pontuação
		function setScore() {
			score++
			$("#score span").text(score)

			// depois de 50 pontos, aparece a bomba
			if (score % 50 === 0) {
				createBomb()
			}

		}
		//Remove Vida e se a vida for menor que 1 o jogo termina
		function lifeMinus() {
			lifes = $(".fa-heart")
			if(lifes.length < 1){
				window.location.href = "gameOver.html"
			}else{	
				lifes[0].remove()
			}
		}
		
		button_start.click(() => {
			var cronometro = setInterval(function () {
				time -= 1
				if (time < 0) {
					clearInterval(cronometro)
					clearInterval(createFly)
					window.location.href = "vitoria.html?="+score
				}
				$("#timer span").text(time)
				
			}, 1000)
		})
		function formatMouse(e){
			posX = e.clientX
			posY = e.clientY
			
			finger.css({
				"top": posY+"px",
				"left":posX+"px"
			})
		}
		
		$(document).on("mousemove", (e) => {
			formatMouse(e)
		})
		
		
	})	
	
})(jQuery)




