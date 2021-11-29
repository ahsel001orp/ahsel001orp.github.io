class MyRandom  //Пробую добавить свою картинку

{
constructor(image, x, y)
	{
		this.x = x;
		this.y = y;
		this.loaded = false;
		this.dead = false;
		
		this.image = new Image();

		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}
	
}

class Road
{
	constructor(image, y)
	{
		this.x = 0;
		this.y = y;
		this.loaded = false;

		this.image = new Image();
		
		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}

	Update(road) 
	{
		this.y += speed; //The image will move down with every frame

		if(this.y > window.innerHeight) //if the image left the screen, it will change it's position
		{
			this.y = road.y - canvas.width + speed; //New position depends on the second Road object
		}
	}
}

class Car
{
	constructor(image, x, y, isPlayer)
	{
		this.x = x;
		this.y = y;
		this.loaded = false;
		this.dead = false;
		this.isPlayer = isPlayer;

		this.image = new Image();

		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}

	Update()
	{
		if(!this.isPlayer)
		{
			this.y += speed;
		}

		if(this.y > canvas.height + 50)
		{
			this.dead = true;
		}
	}

	Collide(car)
	{
		var hit = false;

		if(this.y < car.y + car.image.height * scale && this.y + this.image.height * scale > car.y) //If there is collision by y
		{
			if(this.x + this.image.width * scale > car.x && this.x < car.x + car.image.width * scale) //If there is collision by x
			{
				hit = true;
			}
		}

		return hit;
	}

	Move(v) 
	{
		switch(v)
	      {
		case "xl": //Left
		        if (this.x > match + match/3 +50)
		        {
			this.x += -match;
			break;
			} else {break;}

		case "xr": //Right
		        if (this.x < 4*match -50)
		        {
			this.x += match;
			break;
			} else {break;}

		case "yu": //Up
		        if (this.y > 50)
		        {
			this.y += -match;
			break;
			} else {break;}

		case "yd": //Down
		        if (this.y < canvas.height-50 - match/3)
		        {
			this.y += match;
			break;
			} else {break;}

		
	      }
       }
}

const UPDATE_TIME = 1000 / 60;

var timer = null;

var canvas = document.getElementById("canvas"); //Getting the canvas from DOM
var ctx = canvas.getContext("2d"); //Getting the context to work with the canvas

Resize(); //Changing the canvas size on startup

window.addEventListener("resize", Resize); //Change the canvas size with the window size

//Forbidding openning the context menu to make the game play better on mobile devices
canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }); 

window.addEventListener("keydown", function (e) { KeyDown(e); }); //Listenning for keyboard events

window.addEventListener("click", function (e) { MouseDown(e); });

window.addEventListener("touchstart", function (e) { TouchDown(e); });

var match = canvas.width/6;

var objects = []; //Game objects

var roads = 
[
	new Road("images/road.jpg", 0),
	new Road("images/road.jpg", canvas.width)
]; //Backgrounds

var scale = roads[0].image.width*0.00015; //h0.15; //Cars scale

var player = new Car("images/car.png", match + match/3, canvas.height / 1.5, true); //Player's object

var myRandom = new MyRandom("images/l000l.jpg", canvas.width / 1.25, canvas.height / 8); //Создаю обьект моей картинки

var speed = 5;

var change = true;

Start();


function Start()
{
	if(!player.dead)
	{
		timer = setInterval(Update, UPDATE_TIME); //Updating the game 60 times a second
	}
	
}

function Stop()
{
	clearInterval(timer); //Game stop
	timer = null;
}

function Update() 
{
	roads[0].Update(roads[1]);
	roads[1].Update(roads[0]);	

	if(RandomInteger(0, 10000) > 9800) //Generating new car
	{
	        var whichRoad = getRandomInt(0, 4)
	        switch(whichRoad)
	{
		case 0: 
			objects.push(new Car("images/car_red.png", match + match/3, RandomInteger(250, 400) * -1, false));
			break;

		case 1: 
			objects.push(new Car("images/car_red.png", match*2 + match/5, RandomInteger(250, 400) * -1, false));
			break;

		case 2: 
			objects.push(new Car("images/car_red.png", match*3 + match/6, RandomInteger(250, 400) * -1, false));
			break;

		case 3: 
			objects.push(new Car("images/car_red.png", match*4 + match/10, RandomInteger(250, 400) * -1, false));
			break;
		
	}	        
		
		if (change)
		{ 
		myRandom = new MyRandom("images/l000l(1).jpg", canvas.width / 1.25, canvas.height / 10);
		change = false;
		} else {
		myRandom = new MyRandom("images/l000l.jpg", canvas.width / 1.25, canvas.height / 10);
		change = true;
		}
	}

	player.Update();

	for(var i = 0; i < objects.length; i++)
	{
		objects[i].Update();

		if(objects[i].dead)
		{
			isDead = true;
		}
	}

	if(isDead)
	{
		objects.shift();
	}
	
	if(player.dead)	
	{		 
		 DrawCar(myRandom);
		 player.dead = true;		 		       	
	}

	var isDead = false; 

	var hit = false;

	for(var i = 0; i < objects.length; i++)
	{
		hit = player.Collide(objects[i]);

		if(hit)
		{       
		        myRandom.x = (canvas.width/2)-(myRandom.image.width/3);
		        myRandom.y = (canvas.height/2)-(myRandom.image.height/3);
		        player.x = (canvas.width/2)-(myRandom.image.width/3);
		        player.y = (canvas.height/2)-(myRandom.image.height/3);
		        scale = 0.78;
		        for(var i = 0; i < objects.length; i++)
		        { objects[i] = true;}		        	        
			break;
		}
	}	

	Draw();
}

function Draw() //Working with graphics
{
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas

	for(var i = 0; i < roads.length; i++)
	{
		ctx.drawImage
		(
			roads[i].image, //Image
			0, //First X on image
			0, //First Y on image
			roads[i].image.width, //End X on image
			roads[i].image.height, //End Y on image
			roads[i].x, //X on canvas
			roads[i].y, //Y on canvas
			canvas.width, //Width on canvas
			canvas.width //Height on canvas
		);
	}		

        DrawCar(player);
        
        DrawCar(myRandom);
        
	for(var i = 0; i < objects.length; i++)
	{
		DrawCar(objects[i]);
	}
	

}

function DrawCar(car)
{
	ctx.drawImage
	(
		car.image, 
		0, 
		0, 
		car.image.width, 
		car.image.height, 
		car.x, 
		car.y, 
		car.image.width * scale, 
		car.image.height * scale 
	);
}

function TouchDown(e)
{
if (e.clientX < canvas.width/2)
	{
	player.Move("xl");
	}
	if (e.clientX > canvas.width/2)
	{
	player.Move("xr");
	}
if (e.pageX < canvas.width/2)
	{
	player.Move("xl");
	}
	if (e.pageX > canvas.width/2)
	{
	player.Move("xr");
	}


}
function MouseDown(e)
{
	if (e.clientX < canvas.width/2)
	{
	player.Move("xl");
	}
	if (e.clientX > canvas.width/2)
	{
	player.Move("xr");
	}

}
function KeyDown(e)
{
	switch(e.keyCode)
	{
		case 37: //Left
			player.Move("xl");
			break;

		case 39: //Right
			player.Move("xr");
			break;

		case 38: //Up
			player.Move("yu");
			break;

		case 40: //Down
			player.Move("yd");
			break;

		case 27: //Esc
			if(timer == null)
			{
				Start();
			}
			else
			{
				Stop();
			}
			break;
	}
}

function Resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function RandomInteger(min, max) 
{
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function PlayAgain() {
  //ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas
  player = new Car("images/car.png", match + match/3, canvas.height / 1.5, true);   
  start();
}
