TANX
====

A simple JavaScript tank battle game that allows eight user generated AIs to battle.

This was written to be used at the UtahJS Orem Meetup and for a developer hack-a-thon at work.

#General Game
The Game is written to run in a browser and uses standard HTML, CSS and JavaScript. The Game code does use jQuery 1.11.2 (Which is included in the git repo.)

When the game starts it loads up each AI and attaches it as the control of the various tanks. The tanks all start in a random position, facing a random direction and moving at a random speed.

To start the animation cycle, the user clicks on the Run button at the bottom of the screen.

The tanks move around in the play field on the left of the screen while hits are tracked in the log on the right side.

At the bottom of the screen is a section with the list of tanks and their current scores.

##Running the Game
The game must be read out of a web server. It doesn't matter what web server, but it can not work in a file system. This is due to the dynamic loading of the AI files. These are loaded using AJAX calls and, as far as I know, AJAX calls only work through a web server.

##AI Files
AI Files are independantly loaded for each tank. To specify the file to use per tank you need to edit the file `tanx.js` and change the contents of the `tankAIs` array.

Each entry in the array is an object that looks like this: `{ "file": "someFile.js" }` this will load the file `someFile.js` from the `js.tanx` folder. Currently I supply a simple random AI that exists in the file `js/tanx/tank1.js`

>####Keyboard control
You can set the first tank up to be controlled by the keyboard instead of an AI. To do this just the first entry in the `tankAIs` array to `{ "user": true }`

In the default code I only have AI files controlling tanks 1, 2 and 3. Tank 0 is controlled by the keyboard and tanks 4 to 7 do not have any AI. They just move in the intial direction at their initial velocity.

If you want to run all 8 tanks using AIs, you can either have them all use the same AI or they can all use different AIs. Just set the `file` property in each entry to reference the AI file you want for that tank.

###How to write a Tank AI file
I provide a smiple random tank AI file. This file allows the AI authors to see the limits of the AI code.

You must provide a single exported function that is called each cycle with the inteligence information (intel). You write your AI logic using that intel to determine three things: Direction Adjustment, Velocity Adjustment and if you want to shoot or not.

>####Direction Adjustment
You can not indicate which direction you want to face, instead you can indicate if you want to turn left, turn right or nto turn at all.

>#### Velocity Adjustment
You can only indicate if you want to add forward velocity, reverse velocity, come to a stop, or stay at your current velocity.

>#### Shot
Each cycle you can indicate if you want to fire a shot or not. You are limited to how many shots you have and can not fire additional shots once depleated, but you are in control of when the shot is fired.

The intel object you get each cycle is a unique set of the data provided to everyone else. It is YOUR copy and any changes made to that data is ignored. So you can't affect any other tank by changing your intel data.

The intel object looks like this:

```js
intel = {
  "me": {
    index: [number 0-7],
    life: [number 0-10], // 0 = dead
    shots: [number 0-50] // 0 = no more shots
  },
  "tankList": [array of IntelInfo objects],
  "shotList": [array of IntelInfo objects],
  "helpers": {
    "itemDistance": [function],
    "itemAngle": [function]
  }
};
```

The intel object includesthe following:

* A list of all tanks
* A list of all the active shots
* Your index into the tankList array
* Some helper functions

The `tankList` and `shotList` arrays contain `IntelInfo` objects. The `IntelInfo` object has four properties: `x`, `y`, `velocty`, and `rotation`

>####x
>X location on the field of the object 

>####y
>Y location on the field of the object

>####velocity
>Velocity of the object

>####rotation
>Rotation of the object, in radians

The Helper functions are there to simplify calculating how far away an object is from another object and what angle an object is from another.

Your AI code will use the intel object to make the descisions you can make. And your function will then return an objec that tells the game what you want done to your tank. Including a change in direction, velocity or if you want to fire a shot.

Your return object must look like this:

```js
return {
  "direction": [DIRECTION.LEFT, DIRECTION.RIGHT or DIRECTION.STRAIGHT],
  "speed": [SPEED.STOP, SPEED.SLOWER, SPEED.FASTER or SPEED.MAINTAIN],
  "shoot": [true or false]
};
```

Any other return values are ignored by the game.

##Support
If these direction are not enough information, please let me know. Email me at `intervalia@gmail.com`

Mike
