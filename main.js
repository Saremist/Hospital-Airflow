let x_res = 10;
let y_res = 10;
let m_width = 400;
let m_height = 400;
let px_size_x = m_width / x_res;
let px_size_y = m_height / y_res;
let cells = initialize_arr(x_res, y_res, 0);


function setup() {
    createCanvas(m_width, m_height);
    allocate_cells();
}

function draw() {
    noLoop(background(255));
    noLoop(square(60, 100, 20));
    noLoop(line(0, 0, 80, 80));
    noLoop(ellipse(200, 200, 161, 80));
    noLoop(find_walls());
    draw_grid();
    console.log(cells[10][0].updateFlow());
    console.log(cells[10][0].type);
    console.log(cells[10][1].updateFlow());
}

class Cell {
    constructor({
        x,
        y,
        type = 'ff'
    } = {}) {
        this.x = x;
        this.y = y;
        this.flow_left = 0;
        this.flow_top = 0;
        this.flow_right = 0;
        this.flow_bottom = 0;
        this.setType(type);

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

    _getFlowTopLeft(topCell, leftCell) {
        if (topCell) {
            this.flow_top = topCell.flow_bottom;
        } else {
            this.flow_top = 0;
        }
        if (leftCell) {
            this.flow_left = leftCell.flow_right;
        } else {
            this.flow_left = 0;
        }
    }
    getColor() {
        switch (this.type) {
            case 'wa':
                return [255, 0, 0, 255];
            case 'src':
                return [0, 255, 0, 255];
            case 'ff':
                return (this.getEdgesCount() * 255 / 4);
        }
    }

    updateFlow() {
        this._getFlowTopLeft();
        if (this.type != 'src')this.decompress();
        return this.getDiv();
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
        this.flow_left -= div / edges;
        this.flow_top -= div / edges;
        this.flow_right += div / edges;
        this.flow_bottom += div / edges;
    }
    getEdgesCount() {
        if (this.edges) return this.edges;
        let edges = 0;
        let x = this.x;
        let y = this.y;
        // console.log(cells[y][x + 1].type); // TODO getter
        edges += (x > 0 && cells[y][x - 1].type == 'ff') ? 1 : 0;
        edges += (x<x_res && cells[y][x + 1].type == 'ff') ? 1 : 0;
        edges += (y>0 && cells[y-1][x].type == 'ff') ? 1 : 0;
        edges += (y<y_res && cells[y+1][x].type == 'ff') ? 1 : 0;
        this.edges = edges;
        // console.log(edges);
        return edges;
    }
}
//each cell stores ff, wa, src value deterimining its type

function allocate_cells() {
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            cells[y][x] = new Cell(x, y);
        }
    }
}


function draw_grid() {
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

function find_walls() {
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

function scan_pixel(b_x, b_y) {
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

function initialize_arr(x, y, val) {
    return [...Array(y)].map(_ => Array(x).fill(val));
}