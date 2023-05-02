let x_res = 50;
let y_res = 50;
let m_width = 400;
let m_height = 400;
let px_size_x = m_width / x_res;
let px_size_y = m_height / y_res;
let cells = initialize_arr(x_res, y_res, 0);


function setup() {
    createCanvas(m_width, m_height);
    console.log(cells[10][0].type);
    allocate_cells();
    console.log(cells[10][0].type);
}

function draw() {
    background(255);
    square(40, 40, 80);
    line(0, 0, 80, 80);
    ellipse(200, 200, 161, 80);
    noLoop(find_walls());
    draw_grid();
}


class Cell {
    constructor(topCell = null, leftCell = null, bottomCell = null, rightCell = null, type = 'ff') {
        this.adjacentsTLBR = [topCell, leftCell, bottomCell, rightCell];
        this.flow_left = leftCell ? leftCell.flow_right : 0;
        this.flow_top = topCell ? topCell.flow_top : 0;
        this.flow_right = 0;
        this.flow_bottom = 0;
        this.setType(type);
    }

    setType(type) {
        this.type = type;
    }

    setAdjacent(top = null, left = null, right = null, bottom = null) {
        let _top = top ? top : this.adjacentsTLBR[0];
        let _left = left ? left : this.adjacentsTLBR[1];
        let _bottom = bottom ? bottom : this.adjacentsTLBR[2];
        let _right = right ? right : this.adjacentsTLBR[3];
        this.adjacentsTLBR = [_top, _left, _bottom, _right];
    }

    setFlow(top = null, left = null, right = null, bottom = null) {
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
    getDiv() {
        sum = this.flow_left;
        sum += this.flow_top;
        sum -= this.flow_right;
        sum -= this.flow_bottom;
        return sum;
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
    decompress() {
        div = this.getDiv();
        edges = this.getEdgesCount();
        this.flow_left -= div / edges;
        this.flow_top -= div / edges;
        this.flow_right += div / edges;
        this.flow_bottom += div / edges;
    }
    getEdgesCount() {
        if (this.edges) return this.edges;
        let edges = 0;
        for (const c of this.adjacentsTLBR) {
            edges += (c && c.type == 'ff') ? 1 : 0;
        }
        return edges;
    }
}
//each cell stores ff, wa, src value deterimining its type

function allocate_cells() {
    let x = 0;
    let y = 0;
    for (y = 0; y < y_res; ++y) {
    console.log(cells[y][x].type);
    cells[y][x] = new Cell(type = 'src');
    console.log(cells[y][x].type);
}
    for (y = 0; y < y_res; ++y) {
        for (x = 1; x < x_res; ++x) {
            cells[y][x] = new Cell();
        }
    }

    for (y = 0; y < y_res; ++y) {
        for (x = 0; x < x_res; ++x) {
            let t = null;
            let l = null;
            let b = null;
            let r = null;
            try {
                t = cells[y - 1][x];
            } catch (ValueError) {}
            try {
                l = cells[y][x - 1];
            } catch (ValueError) {}
            try {
                b = cells[y + 1][x];
            } catch (ValueError) {}
            try {
                r = cells[y][x + 1];
            } catch (ValueError) {}
            cells[y][x].setAdjacent(t, l, r, b);
        }
    }
}

function initialize_arr(x, y, val) {
    return [...Array(y)].map(_ => Array(x).fill(val));
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
            if (scan_pixel(b_x, b_y)) {
                set_type(x, y, 'wa');
            }
        }
    }
}

function set_type(x, y, type) {
    cells[y][x].setType(type);
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