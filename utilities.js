function oneHot(count, index) {
   let arr = new Array(count).fill(0);
    arr[index] = 1;
  return arr
}

function quickdrawToVectors(data) {
  // Reorder quickdraw data to make it more convenient for drawing with P5
  return data.drawing.map((stroke) => {
    // let count = stroke[0].length
    return stroke[0].map((val, index) => [val, stroke[1][index]]);
  });
}

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l];
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

// ---------------------------
// Voronoi

// let voronoi = new Voronoi();

function computeVoronoi(bbox, pts) {
  //   Is pts a list of vectors, or a list of lists of vectors?
  if (!Array.isArray(pts) || !Array.isArray(pts[0]))
    throw "Needs a list of points";

  if (Array.isArray(pts[0][0])) {
    pts = [].concat.apply([], pts);
  }

  let sites = [];
  pts.forEach((v) => {
    sites.push({ x: v[0], y: v[1], point: v });
  });

  let diagram = voronoi.compute(sites, bbox);
  // console.log(diagram);

  function angleTo(s0, s1) {
    return Math.atan2(s1.y - s0.y, s1.x - s0.x);
  }

  function getNeighbor(site, edge) {
    if (isNaN(edge.vb.x) || isNaN(edge.vb.y))
     return [edge.rSite, edge.va];
    
    
    if (edge.lSite === site) return [edge.rSite, edge.va, edge.vb];
    
    return [edge.lSite, edge.vb, edge.va];
  }
  
//   Process each cell to get its edges neighbors, start point, and angle to neighbor
  diagram.forEachCell = (fxn) => {
    diagram.cells.forEach((cell) => {
   
      let ptsOriginal = [];
      cell.halfedges.forEach((he) => {
        let [n, pt, pt1] = getNeighbor(he.site, he.edge);
        he.pt = pt;
        he.pt1 = pt1;
        
        if (n == null) {
          n = {x: he.pt.x, y:he.pt.y}
        }
        he.n = n;
       
        he.angle = angleTo(cell.site, he.pt);
      
        // console.log(he.pt)
      });
      
      cell.halfedges.sort((he0, he1) => {
        return he0.angle - he1.angle;
      });
      
      
      fxn(
        cell.site.point,
        cell.halfedges.map((he) => new Vector2D(he.pt.x, he.pt.y)),
        cell.halfedges.map((he) => he.angle),
        cell.halfedges.map((he) => he.n?.point),
         cell.halfedges.map((he) => new Vector2D(he.pt1.x, he.pt1.y)),
      );
    });
  };
  return diagram;
}


function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}
