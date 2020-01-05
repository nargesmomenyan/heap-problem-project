// var nj = require('./numjs.min.js');
// var cv = require('./opencv');


let inputElement1 = document.getElementById("fileInput1");
let inputElement2 = document.getElementById("fileInput2");

let image1 = document.getElementById("image1");
let image2 = document.getElementById("image2");

inputElement1.addEventListener("change", (e) => {
    image1.src = URL.createObjectURL(e.target.files[0]);
}, false);
inputElement2.addEventListener("change", (e) => {
    image2.src = URL.createObjectURL(e.target.files[0]);

}, false);


function stitch_rl() {

    var t0 = performance.now();
    let splitRatio = 6, left_image_portion = 0.7, acceptanceThresh = 0.95, maxHighCorrPoint = 3,
        expected_shift_r_ratio = 0, expected_shift_c_ratio = 0.75, max_shift_c_threshold_ratio = 0.15,
        max_shift_r_threshold_ratio = 0.15, grey_thresh = 11, pyramid_scale = 1

    let image_left = cv.imread(image1);
    let image_right = cv.imread(image2);

    // 1. downSampleImage
    let image_left_small = downSampleImage(image_left)
    let image_right_small = downSampleImage(image_right)

    // 2. gray
    let image_left_gray = new cv.Mat();
    cv.cvtColor(image_left_small, image_left_gray, cv.COLOR_BGR2GRAY)
    let effective_x = parseInt(Math.abs(image_left_small.cols * left_image_portion))

    let image_left_gray_cropped = new cv.Mat();
    let rect = new cv.Rect(effective_x - 1, 0, image_left_gray.cols - effective_x, image_left_gray.rows - 1);
    image_left_gray_cropped = image_left_gray.roi(rect);

    let image_right_gray = new cv.Mat();
    cv.cvtColor(image_right_small, image_right_gray, cv.COLOR_BGR2GRAY)

    // Blocking ...
    let shift_direction_r = []
    let shift_direction_c = []
    let temp_r = Math.abs(parseInt(image_right_small.rows / splitRatio))
    let temp_c = Math.abs(parseInt(image_right_small.cols / splitRatio))
    let is_blank = false// is_image_blank(image_right_small)
    if (!is_blank) {
        // let image_left_gray_cropped_norm = math.float32(image_left_gray_cropped)

        for (let i = 0; i < splitRatio; i++) {
            if (shift_direction_c.length >= maxHighCorrPoint)
                break

            let image_cur_split = new cv.Mat();
            let rect_temp = new cv.Rect(0, temp_r * i, temp_c - 1, temp_r);
            image_cur_split = image_right_gray.roi(rect_temp);

            let corrMatrix = new cv.Mat();

            cv.matchTemplate(image_left_gray_cropped, image_cur_split, corrMatrix, cv.TM_CCOEFF_NORMED)
            // let max = Math.max(corrMatrix.data32F)

            var max = corrMatrix.data32F.reduce(function (a, b) {
                return Math.max(a, b);
            });

            let rounded = Math.round(max, 2)
            if (rounded > acceptanceThresh) {
                let result = cv.minMaxLoc(corrMatrix)
                let max_corr_x = result.maxLoc.x
                let max_corr_y = result.maxLoc.y

                max_corr_x += effective_x
                let center_r = math.abs(parseInt(image_right_small.rows / splitRatio * i))
                let center_c = 0


                if (math.abs((max_corr_x - center_c) / image_left_small.cols - expected_shift_c_ratio) > max_shift_c_threshold_ratio ||
                    math.abs((max_corr_y - center_r) / image_left_small.rows - expected_shift_r_ratio) > max_shift_r_threshold_ratio) {
                    continue
                }

                shift_direction_r.push(max_corr_y - center_r)
                shift_direction_c.push(max_corr_x - center_c)

            }
        }
        if ((shift_direction_c.length) == 0) {
            let shift_c = -1000
            let shift_r = -1000
            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
            console.log({ shift_r, shift_c })
            return { shift_r, shift_c }
        }
        else {
            let shift_c = math.median(...shift_direction_c)
            let shift_r = math.median(...shift_direction_r)

            shift_c = parseInt(shift_c * pyramid_scale)
            shift_r = parseInt(shift_r * pyramid_scale)
            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
            console.log({ shift_r, shift_c })
            return { shift_r, shift_c }
        }


        cv.imshow('outputCanvas', image_right_small);
        image_right_small.delete();
        image_left_small.delete();

    }
}

function downSampleImage(img) {
    let pyramid_scale = 4

    let dst = img.clone();
    for (let ss = 1; ss < Math.log2(pyramid_scale); ss++) {
        cv.pyrDown(img, dst, new cv.Size(0, 0), cv.BORDER_DEFAULT)
        img = dst
    }
    return dst
}

function is_image_blank(image, grey_std_threshold = 10, area_threshold = 1e-4) {
    return false

    let rgbaPlanes = new cv.MatVector();
    // Split the Mat
    cv.split(image, rgbaPlanes);
    // Get R channel
    let R = rgbaPlanes.get(0);

    let SDR = getSD(R.data)

    let matVec = new cv.MatVector();
    // Push a Mat back into MatVector
    matVec.push_back(image);

    
    grey_ness = nj.std(rgbaPlanes)

    grey_ness[grey_ness >= grey_std_threshold] = 255
    grey_ness[grey_ness < grey_std_threshold] = 0

    color_ratio = Math.sum(grey_ness > 0) / (image.rows * image.cols)

    if (color_ratio < area_threshold) {
        return true
    }

    return false
}

let getMean = function (data) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / data.length;
};

let getSD = function (data) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
        return sq + Math.pow(n - m, 2);
    }, 0) / (data.length - 1));
};