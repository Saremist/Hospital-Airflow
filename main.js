let x_res = 50;
let y_res = 50;
let m_width = 400;
let m_height = 400;
let px_size_x = m_width / x_res;
let px_size_y = m_height / y_res;
let cells = initialize_arr(x_res, y_res, 127);
let cells_vx = initialize_arr(x_res, y_res, 0);
let cells_vy = initialize_arr(x_res, y_res, 0);
let cells_type = initialize_arr(x_res, y_res, 'ff');

let initialized = false;
//each cell stores ff, wa, src value deterimining its type

function initialize_arr(x, y, val) {
    return [...Array(y)].map(_ => Array(x).fill(val));
}

function setup() {
    createCanvas(m_width, m_height);
}

function draw() {
    background(255);
    line(0, 0, 100, 100);
    square(50, 50, 25);
    find_walls();
    draw_grid();
    initialized = true;
}

function draw_grid() {
    let color;
    for (let y = 0; y < y_res; ++y) {
        for (let x = 0; x < x_res; ++x) {
            b_x = x * px_size_x;
            b_y = y * px_size_y;
            // color = cells[y][x];
            if (cells_type[y][x] != 'ff')
                color = 0;
            else
                color = 127;
            noStroke();
            // noFill();
            fill(color);
            rect(b_x, b_y, px_size_x, px_size_y);
        }
    }
}

function find_walls() {
    if (!initialized)
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
    cells_type[y][x] = type;
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