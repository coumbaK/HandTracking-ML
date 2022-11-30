# Hand-Tracking ML


What "task" are we training this network on?  In this assignment, we will train a network that takes a hand position as input and predicts **some label**. Neural networks need to have a fixed number of input neurons, and a fixed number of output neurons.

Our input will be the 42 numbers we get from each hand (each hand has 21 points and each point has an X and Y coordinate)

Our output will either be:

* a "one-hot" encoding of a "class", for example `[0,1,0, 0]` if the label is the second of four options 
* an array of a fixed length, representing some point in a possibility space, like in your parametric generator

You *definitely* want to watch the class recording where we go over how to do this.

* Create new task by cloning task-slash 
  * add it to the HTML
* Record samples of your training data for each class by clicking the record button, or pressing "space"
  * you can also playback and delete existing recordings
* Once you have all recordings you want, train your model
  * wait for it to finish training, and it will download `model_meta.json`, `model.json`, and `model.weights.bin`. These are the representation of your trained neural network that we can load later
  * upload these files to Glitch, and "put them in a folder" by renaming them to `my_projects_id/model.json` and  `my_projects_id/model_meta.json`. You don't need to rename `model.weights.bin` but make sure it has that name, and copy its URL from the assets
  * Set that data in your .js file


