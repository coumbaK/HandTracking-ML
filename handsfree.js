

function initHandsFree() {
	console.log("Init handsfree")
	let updateCount = 0
	// From the handsfree demos (mostly)
	handsfree = new Handsfree({
		showDebug: true,
		hands: true
	})

	handsfree.update({facemesh: true})

	// Let's create a plugin called "logger" to console.log the data
	handsfree.use('logger', (data) => {
		updateCount++
		// I like to always bail if there's no data,
		// which might happen if you swap out hands for the face later on
		if (!data.hands) return

		// Log the data  
		// Vue.set(app.tracking, "hands", data.hands.multiHandLandmarks)
// 		if (updateCount % 30 == 0) {
// 			console.log(data.hands.multiHandLandmarks)
// 		}

// 		console.log("track #", updateCount)

		
		// Only set position if visible
		// Also smooth with the previous point
		// pt.setToLerp((meshPt.x,meshPt.y), pt, app.smooth)
		function setPoint(pt, meshPt) {
		
			
			let x = (.5 - meshPt.x)*canvasW
			let y = (meshPt.y - .5)*canvasH
			pt.setTo(x, y)
			if (pt.index ===47)
				console.log(pt.toFixed())
			pt.visible = meshPt.visible
		}
    

		// Set the points to the current mesh
		if (data.facemesh &&  data.facemesh.multiFaceLandmarks &&  data.facemesh.multiFaceLandmarks.length > 0) {
			let faceMesh = data.facemesh.multiFaceLandmarks[0]
			console.log("update face")
			// Copy over all of the face data
			for (var i = 0; i < face.points.length; i++) {
				setPoint(face.points[i], faceMesh[i])
			}
		}

		hands[0].visible = false
		hands[1].visible = false
		if (data.hands.multiHandLandmarks && data.hands.multiHandLandmarks.length > 0) {
			console.log("-- hands -- ")
      data.hands.multiHandLandmarks[0].forEach()
			for (var i = 0; i < hands[0].points.length; i++) {

				setPoint(hand[0].points[i], data.hands.multiHandLandmarks[0][i])
				hand[0].visible = true
				if (data.hands.multiHandLandmarks[1]) {
					hand[1].visible = true
					setPoint(hand[1].points[i], data.hands.multiHandLandmarks[1][i])
				}
				
			}
		} else {
			console.log("-- no hands -- ")
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