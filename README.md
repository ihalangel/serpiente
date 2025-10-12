# react-snake

### To launch the development server

- `git clone https://github.com/snake-devhub/react-snake.git`
- `cd react-snake`
- `npm install`
- `npm start`

<br/>

## Dependencies
This project needs [react](https://www.npmjs.com/package/react) to operate. Install it with `npm install react`

<br/>

### Props
_All props are optional_

|Prop|Type|Default value|Description|
|:-:|:-:|:-:|:-|
|`percentageWidth`|number|`40`|A **percentage** defining the width of the game board, based on the width of the game's parent element|
|`startSnakeSize`|number|`6`|The starting size of the snake|
|`snakeColor`|string|_random_|The color of the snake|
|`appleColor`|string|_random_|The color of apples|

<br/>

## How to play
You can move the snake with the arrow keys or `W` / `A` / `S` / `D`.

<br/>

## High-Score
The highest score is saved locally in the browser's _local storage_, in a `snakeHighScore` field.
