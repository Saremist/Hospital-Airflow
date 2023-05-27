// import structuredClone from '@ungap/structured-clone';

let x_res = 1000;
let y_res = 500;
let m_width = 1000;
let m_height = 500;
let px_size_x = m_width / x_res;
let px_size_y = m_height / y_res;
let cells = initialize_arr(x_res, y_res, 0);
let next_cells = initialize_arr(x_res, y_res, 0);


function setup() {
    createCanvas(m_width, m_height);
    allocate_cells();
    background(255);
    // square(60, 100, 20);
    // line(0, 0, 400, 400);
    // fill(0);
    ellipse(200, 200, 80, 80);
    find_walls();
    Clone(cells, next_cells);
    frameRate(30);
}

let line_x = 300, line_y = m_height/2;
let cell_x = Math.round(line_x/m_width*x_res), cell_y = Math.round(line_y/m_height*y_res);

function draw() {
    draw_grid();
    // if (frameCount > 10)
    //     noLoop();
    // console.log("frame{frameCount}");
    console.log(frameRate());
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            cells[y][x].updateFlow();
        }
    }

    line(line_x, line_y, line_x + 100 * cells[cell_y][cell_x].getVelocity('v'), line_y + 100 * cells[cell_y][cell_x].getVelocity('h'));
    Clone(next_cells, cells);
}

// CELL DEFF

class Cell {
    constructor({
        x = -1,
        y = -1,
        type = 'ff'
    } = {}) {
        this.flow_right = 0;
        this.flow_bottom = 0;
        this.setType(type);
        this.setCords(x, y);
        this.over_relax = 1;
    }
    setCords(x, y) {
        this.x = x;
        this.y = y;
    }

    setType(type) {
        this.type = type;
        if (type == 'src') {
            this.setFlow({
                right: 1
            });
            // this.flow_right = 1;
        }
    }

    setFlow({
        right = null,
        bottom = null
    } = {}) {
        this.flow_right = right ? right : this.flow_right;
        this.flow_bottom = bottom ? bottom : this.bottom;
    }


    getType() {
        return this.type;
    }

    getXY() {
        return (this.x, this.y);
    }

    getColor() {
        switch (this.type) {
            case 'wa':
                return [255, 0, 0, 255];
            case 'src':
                return [0, 255, 0, 255];
            case 'ff':
                // return (this.getEdgesCount() * 255 /4 );
                // return (this.getDiv() * 5 * 255);
                return (this.getVelocity("v") * 255/4 + 255/2);
        }
    }

    updateFlow() {
        switch (this.getType()) {
            case 'ff':
                this.decompress();
                break;
            case 'wa':
                // this.decompress();
                break;
            case 'src':
                break;
                // return this.getDiv();}
        }
    }

    getDiv() {
        let sum = 0;
        sum += this.getFlow("left") ? this.getFlow("left") : 0;
        sum += this.getFlow("top") ? this.getFlow("top") : 0;
        sum -= this.flow_right ? this.flow_right : 0;
        sum -= this.flow_bottom ? this.flow_bottom : 0;
        return sum;
    }

    getFlow(direction) {
        let flow;
        try {
            switch (direction) {
                case "top":
                    this.top_flow = this.getCell("top").getFlow('bottom');
                    flow = this.top_flow;
                    break;
                case "bottom":
                    flow = this.flow_bottom;
                    break;
                case "left":
                    this.left_flow = this.getCell("left").getFlow('right');
                    flow = this.left_flow;
                    break;
                case "right":
                    flow = this.flow_right;
                    break;
                default:
                    throw TypeError("wrong direction selected");
            }
            return flow;
        } catch (e) {
            if (e instanceof TypeError)
                return false;
            else
                throw e;
        }
    }


    decompress() {
        let div = this.getDiv();
        let edges = this.getEdgesCount();

        try {
            let leftCell = Object.assign(new Cell(), this.getNextCell("left"));
            if (leftCell.getType() == "ff") {
                leftCell.flow_right -= (div / edges) * this.over_relax;
                next_cells[this.y][this.x - 1] = leftCell;
            }
        } catch (e) {
            if (e instanceof TypeError) {} else {
                throw e;
            }
        }

        try {
            let topCell = Object.assign(new Cell(), this.getNextCell("top"));
            if (topCell.getType() == "ff") {
                topCell.flow_bottom -= (div / edges) * this.over_relax;
                next_cells[this.y - 1][this.x] = topCell;
            }
        } catch (e) {
            if (e instanceof TypeError) {} else {
                throw e;
            }
        }

        try {
            if (this.x == x_res-1 || this.getCell("right").getType() == "ff" ){
                next_cells[this.y][this.x].flow_right += (div / edges) * this.over_relax;
            }
        } catch (e) {
            if (e instanceof TypeError) {} else {
                throw e;
            }
        }

        try {
            if (this.y == y_res-1 ||this.getCell("bottom").getType() == "ff")
                next_cells[this.y][this.x].flow_bottom += (div / edges) * this.over_relax;
        } catch (e) {
            if (e instanceof TypeError) {} else {
                throw e;
            }
        }
    }

    getCell(direction) {
        let cell;
        switch (direction) {
            case "top":
                cell = cells[this.y - 1][this.x];
                break;
            case "bottom":
                cell = cells[this.y + 1][this.x];
                break;
            case "left":
                cell = cells[this.y][this.x - 1];
                break;
            case "right":
                cell = cells[this.y][this.x + 1];
                break;
            default:
                throw TypeError("wrong direction selected");
        }
        return cell;
    }

    getNextCell(direction) {
        let cell;
        switch (direction) {
            case "top":
                cell = next_cells[this.y - 1][this.x];
                break;
            case "bottom":
                cell = next_cells[this.y + 1][this.x];
                break;
            case "left":
                cell = next_cells[this.y][this.x - 1];
                break;
            case "right":
                cell = next_cells[this.y][this.x + 1];
                break;
            default:
                throw TypeError("wrong direction selected");
        }
        return cell;
    }

    getVelocity(direction = null) {
        switch (direction) {
            case null:
                return [this.getFlow("left") + this.getFlow("right"), this.getFlow("top") + this.getFlow("bottom")];
            case "v":
                return this.getFlow("left") + this.getFlow("right");
            case "h":
                return this.getFlow("top") + this.getFlow("bottom");
            }
    }
    

    getEdgesCount() { // work 
        // if (this.edges) return this.edges;
        let edges = 0;
        edges += (this.x > 0 && cells[this.y][this.x - 1].getType() == 'ff') ? 1 : 0;
        edges += (this.x == x_res - 1 || this.x < x_res - 1 && cells[this.y][this.x + 1].getType() == 'ff') ? 1 : 0;
        edges += (this.y == 0 || this.y > 0 && cells[this.y - 1][this.x].getType() == 'ff') ? 1 : 0;
        edges += (this.y == y_res - 1 || this.y < y_res - 1 && cells[this.y + 1][this.x].getType() == 'ff') ? 1 : 0;
        return edges;
    }
}
//each cell stores ff, wa, src value deterimining its type

function allocate_cells() { // works
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            cells[y][x] = new Cell({
                x,
                y,
                type: "ff"
            });
            next_cells[y][x] = new Cell({
                x,
                y,
                type: "ff"
            });
        }
    }
}


function draw_grid() { // works
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            b_x = x * px_size_x;
            b_y = y * px_size_y;
            fill(cells[y][x].getColor());
            noStroke();
            rect(b_x, b_y, px_size_x, px_size_y);
        }
    }
    stroke(1);
}

function find_walls() { // works
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            b_x = x * px_size_x;
            b_y = y * px_size_y;
            if (x == 0) {
                cells[y][x].setType('src');
                continue;
            }
            if (scan_pixel(b_x, b_y)) {
                cells[y][x].setType('wa');
            }
        }
    }
}

function scan_pixel(b_x, b_y) { // works
    for (let s_y = 0; s_y < px_size_y; ++s_y) {
        for (let s_x = 0; s_x < px_size_x; ++s_x) {
            color = get(b_x + s_x, b_y + s_y)[0];
            if (color != 255) {
                return true;
            }
        }
    }
    return false;
}

function initialize_arr(x, y, val) { // works
    return [...Array(y)].map(_ => Array(x).fill(val));
}

function Clone(from, to) {
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            to[y][x] = Object.assign(new Cell(), {
                ...from[y][x]
            }); // TODO COPY CAT
        }
    }
}

// ----------------- start of simulator ------------------------------

class Fluid {
    constructor(density, numX, numY, h) {
        this.density = density;
        this.numX = numX + 2; 
        this.numY = numY + 2;
        this.numCells = this.numX * this.numY;
        this.h = h;
        this.u = new Float32Array(this.numCells);
        this.v = new Float32Array(this.numCells);
        this.newU = new Float32Array(this.numCells);
        this.newV = new Float32Array(this.numCells);
        this.p = new Float32Array(this.numCells);
        this.s = new Float32Array(this.numCells);
        this.m = new Float32Array(this.numCells);
        this.newM = new Float32Array(this.numCells);
        this.m.fill(1.0)
        var num = numX * numY;
    }

    integrate(dt, gravity) {
        var n = this.numY;
        for (var i = 1; i < this.numX; i++) {
            for (var j = 1; j < this.numY-1; j++) {
                if (this.s[i*n + j] != 0.0 && this.s[i*n + j-1] != 0.0)
                    this.v[i*n + j] += gravity * dt;
            }	 
        }
    }

    solveIncompressibility(numIters, dt) {

        var n = this.numY;
        var cp = this.density * this.h / dt;

        for (var iter = 0; iter < numIters; iter++) {

            for (var i = 1; i < this.numX-1; i++) {
                for (var j = 1; j < this.numY-1; j++) {

                    if (this.s[i*n + j] == 0.0)
                        continue;

                    var s = this.s[i*n + j];
                    var sx0 = this.s[(i-1)*n + j];
                    var sx1 = this.s[(i+1)*n + j];
                    var sy0 = this.s[i*n + j-1];
                    var sy1 = this.s[i*n + j+1];
                    var s = sx0 + sx1 + sy0 + sy1;
                    if (s == 0.0)
                        continue;

                    var div = this.u[(i+1)*n + j] - this.u[i*n + j] + 
                        this.v[i*n + j+1] - this.v[i*n + j];

                    var p = -div / s;
                    p *= scene.overRelaxation;
                    this.p[i*n + j] += cp * p;

                    this.u[i*n + j] -= sx0 * p;
                    this.u[(i+1)*n + j] += sx1 * p;
                    this.v[i*n + j] -= sy0 * p;
                    this.v[i*n + j+1] += sy1 * p;
                }
            }
        }
    }

    extrapolate() {
        var n = this.numY;
        for (var i = 0; i < this.numX; i++) {
            this.u[i*n + 0] = this.u[i*n + 1];
            this.u[i*n + this.numY-1] = this.u[i*n + this.numY-2]; 
        }
        for (var j = 0; j < this.numY; j++) {
            this.v[0*n + j] = this.v[1*n + j];
            this.v[(this.numX-1)*n + j] = this.v[(this.numX-2)*n + j] 
        }
    }

    sampleField(x, y, field) {
        var n = this.numY;
        var h = this.h;
        var h1 = 1.0 / h;
        var h2 = 0.5 * h;

        x = Math.max(Math.min(x, this.numX * h), h);
        y = Math.max(Math.min(y, this.numY * h), h);

        var dx = 0.0;
        var dy = 0.0;

        var f;

        switch (field) {
            case U_FIELD: f = this.u; dy = h2; break;
            case V_FIELD: f = this.v; dx = h2; break;
            case S_FIELD: f = this.m; dx = h2; dy = h2; break

        }

        var x0 = Math.min(Math.floor((x-dx)*h1), this.numX-1);
        var tx = ((x-dx) - x0*h) * h1;
        var x1 = Math.min(x0 + 1, this.numX-1);
        
        var y0 = Math.min(Math.floor((y-dy)*h1), this.numY-1);
        var ty = ((y-dy) - y0*h) * h1;
        var y1 = Math.min(y0 + 1, this.numY-1);

        var sx = 1.0 - tx;
        var sy = 1.0 - ty;

        var val = sx*sy * f[x0*n + y0] +
            tx*sy * f[x1*n + y0] +
            tx*ty * f[x1*n + y1] +
            sx*ty * f[x0*n + y1];
        
        return val;
    }

    avgU(i, j) {
        var n = this.numY;
        var u = (this.u[i*n + j-1] + this.u[i*n + j] +
            this.u[(i+1)*n + j-1] + this.u[(i+1)*n + j]) * 0.25;
        return u;
            
    }

    avgV(i, j) {
        var n = this.numY;
        var v = (this.v[(i-1)*n + j] + this.v[i*n + j] +
            this.v[(i-1)*n + j+1] + this.v[i*n + j+1]) * 0.25;
        return v;
    }

    advectVel(dt) {

        this.newU.set(this.u);
        this.newV.set(this.v);

        var n = this.numY;
        var h = this.h;
        var h2 = 0.5 * h;

        for (var i = 1; i < this.numX; i++) {
            for (var j = 1; j < this.numY; j++) {

                cnt++;

                // u component
                if (this.s[i*n + j] != 0.0 && this.s[(i-1)*n + j] != 0.0 && j < this.numY - 1) {
                    var x = i*h;
                    var y = j*h + h2;
                    var u = this.u[i*n + j];
                    var v = this.avgV(i, j);
//						var v = this.sampleField(x,y, V_FIELD);
                    x = x - dt*u;
                    y = y - dt*v;
                    u = this.sampleField(x,y, U_FIELD);
                    this.newU[i*n + j] = u;
                }
                // v component
                if (this.s[i*n + j] != 0.0 && this.s[i*n + j-1] != 0.0 && i < this.numX - 1) {
                    var x = i*h + h2;
                    var y = j*h;
                    var u = this.avgU(i, j);
//						var u = this.sampleField(x,y, U_FIELD);
                    var v = this.v[i*n + j];
                    x = x - dt*u;
                    y = y - dt*v;
                    v = this.sampleField(x,y, V_FIELD);
                    this.newV[i*n + j] = v;
                }
            }	 
        }

        this.u.set(this.newU);
        this.v.set(this.newV);
    }

    advectSmoke(dt) {

        this.newM.set(this.m);

        var n = this.numY;
        var h = this.h;
        var h2 = 0.5 * h;

        for (var i = 1; i < this.numX-1; i++) {
            for (var j = 1; j < this.numY-1; j++) {

                if (this.s[i*n + j] != 0.0) {
                    var u = (this.u[i*n + j] + this.u[(i+1)*n + j]) * 0.5;
                    var v = (this.v[i*n + j] + this.v[i*n + j+1]) * 0.5;
                    var x = i*h + h2 - dt*u;
                    var y = j*h + h2 - dt*v;

                    this.newM[i*n + j] = this.sampleField(x,y, S_FIELD);
                 }
            }	 
        }
        this.m.set(this.newM);
    }

    // ----------------- end of simulator ------------------------------


    simulate(dt, gravity, numIters) {

        this.integrate(dt, gravity);

        this.p.fill(0.0);
        this.solveIncompressibility(numIters, dt);

        this.extrapolate();
        this.advectVel(dt);
        this.advectSmoke(dt);
    }
}
