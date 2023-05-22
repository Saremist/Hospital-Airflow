// import structuredClone from '@ungap/structured-clone';

let x_res = 10;
let y_res = 10;
let m_width = 400;
let m_height = 400;
let px_size_x = m_width / x_res;
let px_size_y = m_height / y_res;
let cells = initialize_arr(x_res, y_res, 0);
let next_cells = initialize_arr(x_res, y_res, 0);


function setup() {
    createCanvas(m_width, m_height);
    allocate_cells();
    background(255);
    // square(60, 100, 20);
    // line(0, 0, 80, 80);
    // fill(0);
    ellipse(200, 200, 161, 80);
    find_walls();
    Clone(cells, next_cells);
    frameRate(60);
}


function draw() {
    draw_grid();
    if (frameCount > 20)
        noLoop();
    console.log(frameCount);
    console.log(cells[0][1]);
    console.log(next_cells[0][1]);
    for (let y = 0; y < y_res; ++y){
        for (let x = 0; x < x_res; ++x) {
            cells[y][x].updateFlow();
        }
    }
    console.log(cells[0][1]);
    console.log(next_cells[0][1]);
    Clone(next_cells, cells);
    cells[0][1].flow_right = "chuj";
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
        this.over_relax = 1.0;
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
                return (this.getDiv() > 1 ? 0 : this.getDiv() + 0.5 * 255);
        }
    }

    updateFlow() {
        switch (this.getType()) {
            case 'ff':
                this.decompress();
                break;
            case 'wa':
                this.decompress();
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
                    flow = 0 + this.top_flow;
                    break;
                case "bottom":
                    flow = 0 + this.flow_bottom;
                    break;
                case "left":
                    this.left_flow = this.getCell("left").getFlow('right');
                    flow = 0 + this.left_flow;
                    break;
                case "right":
                    flow = 0 + this.flow_right;
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
        let tempCell;
        try {
            tempCell = this.getCell("left");} catch (e) {
            if (e instanceof TypeError) { throw e; } else {
                throw e;
            }
        }
        if (tempCell.getType() == "ff") {
            tempCell.flow_right -= (div / edges) * this.over_relax;
            next_cells[this.y][this.x - 1] = tempCell;
        }
        try {
            let tempCell = this.getCell("top");
            if (tempCell.getType() == "ff") {
                tempCell.flow_bottom -= (div / edges) * this.over_relax;
            }
            next_cells[this.y - 1][this.x] = tempCell;
        } catch (e) {
            if (e instanceof TypeError) {} else {
                throw e;
            }
        }
        try {
            let _new = next_cells[this.y][this.x].flow_right + (div / edges) * this.over_relax;
            next_cells[this.y][this.x].flow_right = _new;
        } catch (e) {
            if (e instanceof TypeError) {} else {
                throw e;
            }
        }
        try {
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


function deep(source) {
    return JSON.parse(JSON.stringify(source));
}

const _ = require('lodash');

function Clone(from, to) {
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            to[y][x] = _.cloneDeep(from[y][x]); // TODO COPY CAT
        }
    }
}