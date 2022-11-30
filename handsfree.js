let handsfree = undefined;
function initHandsFree({ face, hands, p, useHandsFree, onFrame, detectHands, detectFace }) {
  console.log(`HANDSFREE - initialize, hands:${detectHands} face:${detectFace}`);
  let frameCount = 0;
  
  

  // From the handsfree demos (mostly)
  let handsfree = new Handsfree({
    showDebug: true,
    hands: detectHands,
    facemesh: detectFace,
  });

  // Let's create a plugin called "logger" to console.log the data
  handsfree.use("logger", (data) => {
    
    frameCount++;

    const el = document.getElementsByClassName("handsfree-debugger")[0];
    const videoEl = document.getElementById("handsfree-canvas-video-1");

    // document.getElementById("controls").appendChild(el);
    // console.log("EL", el)
    handsfree.aspectRatio = videoEl.width / videoEl.height;
    // console.log(handsfree.aspectRation)

    // I like to always bail if there's no data,
    // which might happen if you swap out hands for the face later on
    if (!data.hands) return;

    let xScale = handsfree.aspectRatio / (p.width / p.height);

    let settings = {
      aspectRatio: handsfree.aspectRatio,
      scale: p.width,
      setPoint(pt, hfPt) {
        pt.setTo(p.width - hfPt.x * p.height * xScale, hfPt.y * p.height);
      },
    };

    if (useHandsFree()) {
      // Set the points to the current mesh
      if (
        data.facemesh &&
        data.facemesh.multiFaceLandmarks &&
        data.facemesh.multiFaceLandmarks.length > 0
      ) {
        let faceMeshData = data.facemesh.multiFaceLandmarks[0];
        // console.log("update face")
        // Copy over all of the face data
        // console.log(faceMeshData)

        face.setTo(faceMeshData, settings);
      }

      if (
        data.hands.multiHandLandmarks &&
        data.hands.multiHandLandmarks.length > 0
      ) {
        // console.log("-- hands -- ", data.hands)
        hands.forEach((hand, index) => {
          let handData = data.hands.multiHandLandmarks[index];
          hand.setTo(handData, settings);
        });
      } else {
        // console.log("-- no hands -- ")
      }
    }

    onFrame(frameCount);
  });

  // Start webcam and tracking (personally, I always like to ask first)
  handsfree.start();
  console.log("HANDSFREE - started, waiting...");
  return handsfree;
}
