/* globals Vector2D, allMasks, ml5, Vue, Face, Hand, p5, face, hands */


let handsfree = undefined;
function initHandsFree(face, hands) {
	console.log("Init handsfree")
	let updateCount = 0
	// From the handsfree demos (mostly)
	let handsfree = new Handsfree({
		showDebug: true,
		hands: true,
    facemesh: true
	})


	// Let's create a plugin called "logger" to console.log the data
	handsfree.use('logger', (data) => {
		updateCount++
    
    const el = document.getElementById("handsfree-canvas-video-1")
    console.log("EL", el)
    handsfree.aspectRatio = el.width/el.height
          
		// I like to always bail if there's no data,
		// which might happen if you swap out hands for the face later on
		if (!data.hands) return

		// Log the data  
		// Vue.set(app.tracking, "hands", data.hands.multiHandLandmarks)
// 		if (updateCount % 30 == 0) {
// 			console.log(data.hands.multiHandLandmarks)
// 		}

// 		console.log("track #", updateCount)

		
// 		// Only set position if visible
// 		// Also smooth with the previous point
// 		// pt.setToLerp((meshPt.x,meshPt.y), pt, app.smooth)
// 		function setPoint(pt, meshPt) {
		
			
// 			let x = (.5 - meshPt.x)*canvasW
// 			let y = (meshPt.y - .5)*canvasH
// 			pt.setTo(x, y)
// 			if (pt.index ===47)
// 				console.log(pt.toFixed())
// 			pt.visible = meshPt.visible
// 		}
    

		// Set the points to the current mesh
		if (data.facemesh &&  data.facemesh.multiFaceLandmarks &&  data.facemesh.multiFaceLandmarks.length > 0) {
			let faceMeshData = data.facemesh.multiFaceLandmarks[0]
			// console.log("update face")
			// Copy over all of the face data
      // console.log(faceMeshData)
      face.isActive = true
      face.setTo(faceMeshData)
      // console.log(face.nose)
     
			// for (var i = 0; i < face.points.length; i++) {
			// 	// setPoint(face.points[i], faceMesh[i])
			// }
		}

		
		if (data.hands.multiHandLandmarks && data.hands.multiHandLandmarks.length > 0) {
			// console.log("-- hands -- ", data.hands)
      data.hands.multiHandLandmarks.forEach((handData, index) => {
        hands[index].setTo(handData)
			
      })
		
		} else {
			// console.log("-- no hands -- ")
		}
		// calculateMetaTrackingData()



// 		console.log( app.tracking.face[300])
// 		Vue.set(app.tracking, "face", )
// 		Vue.set(app.tracking, "image", data.facemesh.image)
// 		console.log(app.tracking)

// 		app.image.src = data.facemesh.image.toDataURL();


	})


	// Start webcam and tracking (personally, I always like to ask first)
	handsfree.start()

}