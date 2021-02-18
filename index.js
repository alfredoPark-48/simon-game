"use strict";

/* --------------------------------------------- GLOBAL VARIABLES --------------------------------------------------------------*/
const colors = ["green", "red", "blue", "yellow"];
let gameColor = [];
let userColor = [];
let isPlaying = false;
let level = 0;

/* --------------------------------------------- GAME LOGIC --------------------------------------------------------------*/

// Function that handles the color generation and levels
const newPattern = function () {
	if (isPlaying) {
		// Level is added by one
		level++;
		// Level text is changed depending on current level the player is
		$(".level").text(`Level ${level}`);

		// Generate random number from 0 to 3 to get index of color array, use randomColor to retrieve color from array.
		const randomNumber = Math.trunc(Math.random() * 3);
		const randomColor = colors[randomNumber];

		// Push the random retrieved color to gameColor array
		gameColor.push(randomColor);

		// Remove all the elements inside userColor array in order for checkAnswer function to work
		userColor = [];
	}
};

// Function that handles player input
const playerInput = function () {
	// Pushing user color choice to userColor array
	userColor.push($(this).attr("id"));

	// Calling checkAnswer function giving the length - 1 at parameters
	checkAnswer(userColor.length - 1);
};

// Function that checks if the userColor is equal to gameColor
const checkAnswer = function (currentLevel) {
	if (isPlaying) {
		// Given the current index (currentLevel = userColor.length-1) checks if gameColor at given index is the same as userColor at given index
		if (gameColor[currentLevel] === userColor[currentLevel]) {
			// Playing sound if correct
			const correct = new Audio("resources/sounds/correct.WAV");
			correct.play();

			// Since playerInput function is pushing elements to userColor, once gameColor array and userColor array have the same length, newPattern function and displayColor function is called
			if (gameColor.length === userColor.length) {
				newPattern();
				displayColor();
			}
		} else {
			// Playing sound if incorrect
			const wrong = new Audio("resources/sounds/wrong.WAV");
			wrong.play();

			// Changing the background-color in order to indicate wrong choice
			$("body").css("background-color", "#000");

			// Displaying loss status and highscore
			$(".title").text(`You lost! Highscore Is ${level - 1}`);

			// Displaying restart status
			$(".level").text("Press Any Key To Restart");

			// isPlaying is set to false in order for keypress event listener to function as well as buttons not making sound effects when pressed, in case player wants to restart
			isPlaying = false;
		}
	}
};

// Function that handles body color display
const displayColor = function () {
	// Hidding the buttons
	$(".game").hide();

	// Using a transition in order to display the new color in gameColor array
	$("body").css("transition", "0.3s");
	$("body").css(
		"background-color",
		`var(--${gameColor[gameColor.length - 1]}-color)`
	);

	// Using a setTimeout in order to change the background color back to default after 1000ms
	setTimeout(function () {
		$("body").css("transition", "0.3s");
		$("body").css("background-color", "var(--default-color)");
	}, 1000);

	// Showing the buttons
	$(".game").show(1000);
};

/* --------------------------------------------- EVENT LISTENERS --------------------------------------------------------------*/
// Event listener that handles keypress in order to start game
$(document).keypress(function () {
	// isPlaying is set to false by default
	if (isPlaying === false) {
		// When a key is pressed all the global variables are set to their default values
		level = 0;
		isPlaying = true;
		$(".title").text("Simon Game");
		userColor = [];
		gameColor = [];

		// After setting the variables to their default values, newPattern and displayColor functions are called
		newPattern();
		displayColor();
	}
});

// Event listener that handles button clicks
$(".btn").click(playerInput);
