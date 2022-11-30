# Hand-Tracking ML

You *definitely* want to watch the class recording where we go over how to do this.

* Create new task  
  * add it to the HTML
* Record samples of your training data for each class by clicking the record button, or pressing "space"
  * you can also playback and delete existing recordings
* Once you have all recordings you want

What "task" are we training this network on?  In this assignment, we will train a network that takes a hand position as input and predicts **some label**. Neural networks need to have a fixed number of input neurons, and a fixed number of output neurons.

Our input will be the 42 numbers we get from each hand (each hand has 21 points and each point has an X and Y coordinate)

Our output will either be:

* a "one-hot" encoding of a "class", for example `[0,1,0, 0]` if the label is the second of four options 
* an array of a fixed length, representing some point in a possibility space, like in your parametric generator

Handsfree 

sequence (or single frame) of hand tracking

Marie Petit style: find new in the latent space
https://www.youtube.com/watch?v=xIOeTroDfyw
Autoencode hand positions?

Share hand tracking? Paste in from external, export to json