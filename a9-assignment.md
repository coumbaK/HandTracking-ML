# Hand-Tracking ML


What "task" are we training this network on?  In this assignment, we will train a network that takes a hand position as input and predicts **some label**. Neural networks need to have a fixed number of input neurons, and a fixed number of output neurons.

Our input will be the 42 numbers we get from each hand (each hand has 21 points and each point has an X and Y coordinate)

Our output will either be:

* a "one-hot" encoding of a "class", for example `[0,1,0, 0]` if the label is the second of four options 
* an array of a fixed length, representing some point in a possibility space, like in your parametric generator

You *definitely* want to watch the class recording where we go over how to do this.

Build an experience that uses the user's hand positions and detected gestures to do *something interesting*

* **Recording and Training**
* Create new task by cloning task-slash 
  * add it to the HTML
* Choose what "classifications" you want to train for
  * What is the user trying to do? 
    * Emoji? Words? 
    * Making shadow-puppets? Sign-language letters? Attacks? 
* Record samples of your training data for each class by clicking the record button, or pressing "space"
  * usually a few seconds per gesture is good
  * you can also playback and delete existing recordings
* Once you have all recordings you want, train your model
  * wait for it to finish training, and it will download `model_meta.json`, `model.json`, and `model.weights.bin`. These are the representation of your trained neural network that we can load later
  * Make a note of how long (approximately) it took to train
  * upload these files to Glitch, and "put them in a folder" by renaming them to `my_projects_id/model.json` and  `my_projects_id/model_meta.json`. You don't need to rename `model.weights.bin` but make sure it has that name, and copy its URL from the assets
  * Set that data in your .js file
  * You should now see this making predictions
* **Interacting**
  * Edit your task to use the predictions on each hand to do *something*
  * You have access to the predicted label on each hand, along with the certainty
  * You also have each hand's positions, which are 
    * hand.points (all points)
    * hand.fingers (an array of 4 points for each finger)
    * hand.center
  * You may also want to do something on the *event* that the predicted classification of a hand changes, like playing/starting/stopping a sound, changing color or graphics, or a number
  
* Finally, do a comparison  
  * Try training the same hand gestures on https://teachablemachine.withgoogle.com/
  * This trains on the camera's pixels, without converting your hand to hand positions first.
  * Record approximately the same data
  * Train it
  * How long did it take?
  * How did the accuracy compare?
  * Change your lighting or turn to a diffent angle.
  * Does this change the accuracy
  
**As usual, turn in**
* downloaded Glitch code
* your markdown
* documentation (a GIF) of your interaction working