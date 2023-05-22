let x_res = 10;
let y_res = 10;
let m_width = 400;
let m_height = 400;
let px_size_x = m_width / x_res;
let px_size_y = m_height / y_res;
let cells = initialize_arr(x_res, y_res, 0);
let next_cells;


function setup() {
    createCanvas(m_width, m_height);
    allocate_cells();
    background(255);
    square(60, 100, 20);
    // line(0, 0, 80, 80);
    ellipse(200, 200, 161, 80);
    find_walls();
    next_cells = Clone(cells);
}


function draw() {
    noLoop();
    draw_grid();
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            next_cells[y][x].updateFlow();
            }
            // console.log(x, y);
        }
    }
    cells = Clone(next_cells);
}

class Cell {
    constructor({
        x = -1,
        y = -1,
        type = 'ff'
    } = {}) {
        this.flow_left = 0;
        this.flow_top = 0;
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

    setAdjacent({
        top = null,
        left = null,
        right = null,
        bottom = null
    } = {}) {
        this.a_top = top ? top : this.a_top;
        this.a_left = left ? left : this.a_left;
        this.a_bottom = bottom ? bottom : this.a_bottom;
        this.a_right = right ? right : this.a_right;
    }

    setFlow({
        top = null,
        left = null,
        right = null,
        bottom = null
    } = {}) {
        this.flow_top = top ? top : this.flow_top;
        this.flow_left = left ? left : this.flow_left;
        this.flow_right = right ? right : this.flow_right;
        this.flow_bottom = bottom ? bottom : this.bottom;
    }

    _getFlowTopLeft() {
        try {
            // console.log(cells[this.y - 1][this.x].getType());
            this.flow_top = cells[this.y - 1][this.x].flow_bottom;
        } catch (TypeError) {
            this.flow_top = 0;
        }
        try {
            this.flow_left = cells[this.y][this.x - 1].flow_right;
        } catch (TypeError) {
            this.flow_left = 0;
        }
    }

    _wallFlow() {
        return "Nope!!!!!!!!!!!!";
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
                // return (this.getEdgesCount() * 255 / 4);
                return (this.getDiv() > 1 ? 0 : this.getDiv() * 255);
        }
    }

    updateFlow() {
        this._getFlowTopLeft();
        if (this.type != 'src') this.decompress();
        else if (this.type == 'wa') this.decompress();
        else if (this.type == 'src') this.decompress();
        // return this.getDiv();
    }

    getDiv() {
        let sum = this.flow_left ? this.flow_left : 0;
        sum += this.flow_top ? this.flow_top : 0;
        sum -= this.flow_right ? this.flow_right : 0;
        sum -= this.flow_bottom ? this.flow_bottom : 0;
        return sum;
    }
    decompress() {
        let div = this.getDiv();
        let edges = this.getEdgesCount();
        if (edges != 0) {
            this.flow_left += (div / edges) * this.over_relax;
            this.flow_top += (div / edges) * this.over_relax;
            this.flow_right -= (div / edges) * this.over_relax;
            this.flow_bottom -= (div / edges) * this.over_relax;
        }
    }
    getEdgesCount() { // work 
        // if (this.edges) return this.edges;
        let edges = 0;
        edges += (this.x > 0 && cells[this.y][this.x - 1].getType() == 'ff') ? 1 : 0;
        edges += (this.x < x_res - 1 && cells[this.y][this.x + 1].getType() == 'ff') ? 1 : 0;
        edges += (this.y > 0 && cells[this.y - 1][this.x].getType() == 'ff') ? 1 : 0;
        edges += (this.y < y_res - 1 && cells[this.y + 1][this.x].getType() == 'ff') ? 1 : 0;
        this.edges = edges;
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

function Clone(arr) {
    return arr.map((arr) => arr.slice());
}