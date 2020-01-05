import cv from './opencv'

function stitch_rl(image_left, image_right, splitRatio = 3, left_image_portion = 0.7, acceptanceThresh = 0.9, maxHighCorrPoint = 5,
    expected_shift_r_ratio = 0, expected_shift_c_ratio = 0.75, max_shift_c_threshold_ratio = 0.15,
    max_shift_r_threshold_ratio = 0.15, grey_thresh = 10, pyramid_scale = 4) {
    // Scaling
    image_right_small = image_right.copy()
    image_left_small = image_left.copy()

    //downSampleImage
    for (let ss in range(int(np.log2(pyramid_scale)))) {
        image_right_small = cv.pyrDown(image_right_small)
        image_left_small = cv.pyrDown(image_left_small)
    }

    //gray
    image_left_gray = cv.cvtColor(image_left_small, cv.COLOR_BGR2GRAY)
    effective_x = np.uint16(image_left_small.shape[1] * left_image_portion)


    // image_left_gray_cropped = image_left_gray[:, effective_x:]
    let rect = new cv.Rect(image_left_gray.cols - effective_x, 0, effective_x - 1, image_left_gray.rows - 1);
    image_left_gray_cropped = image_left_gray.roi(rect);

    image_right_gray = cv.cvtColor(image_right_small, cv.COLOR_BGR2GRAY)

    // Blocking ...
    shift_direction_r = []
    shift_direction_c = []
    temp_r = np.uint16(image_right_small.shape[0] / splitRatio)
    temp_c = np.uint16(image_right_small.shape[1] / splitRatio)

    // Blankness check
    if (is_image_blank(image_right_small[:, : temp_c, :], grey_std_threshold = grey_thresh)[0]) {
        shift_c, shift_r = -1000, -1000
        print(shift_r, shift_c, "BLANK")
        return shift_r, shift_c
    }
    else {
        image_left_gray_cropped_norm = np.float32(image_left_gray_cropped)

        for (let i in range(splitRatio)) {
            if (len(shift_direction_c) >= maxHighCorrPoint)
                break
            image_cur_split = np.float32(image_right_gray[temp_r * i: temp_r * (i + 1), : temp_c])
            corrMatrix = cv.matchTemplate(image_left_gray_cropped_norm, image_cur_split, cv.TM_CCOEFF_NORMED)
        }

        if (np.round(np.max(corrMatrix), 2) > acceptanceThresh) {
            { max_corr_x, max_corr_y } = cv.minMaxLoc(corrMatrix)
            max_corr_x += effective_x
            center_r, center_c = np.uint16(image_right_small.shape[0] / splitRatio * i), 0

            if (abs((max_corr_x - center_c) / image_left_small.shape[1] - expected_shift_c_ratio) > max_shift_c_threshold_ratio ||
                abs((max_corr_y - center_r) / image_left_small.shape[0] - expected_shift_r_ratio) > max_shift_r_threshold_ratio) {
                continue
            }

            shift_direction_r.append(max_corr_y - center_r)
            shift_direction_c.append(max_corr_x - center_c)
        }

        if (len(shift_direction_c) == 0) {
            shift_c, shift_r = -1000, -1000
            print(shift_r, shift_c, "LEN=0")
            return shift_r, shift_c
        }
        else {
            print(shift_direction_r, shift_direction_c)
            shift_c = np.median(np.array(shift_direction_c))
            shift_r = np.median(np.array(shift_direction_r))

            shift_c = np.int16(shift_c * pyramid_scale)
            shift_r = np.int16(shift_r * pyramid_scale)

            print("Stitch: ", shift_r, shift_c, len(shift_direction_c))
            return shift_r, shift_c
        }
    }
}

// def is_image_blank(image, grey_std_threshold=10, area_threshold=1e-4):

//     tt = time.time()

//     grey_ness = np.std(image, axis=2)
grey_ness[grey_ness >= grey_std_threshold] = 255
grey_ness[grey_ness < grey_std_threshold] = 0

color_ratio = (np.sum(grey_ness > 0) / (image.shape[0] * image.shape[1]))

//     print("C_RAT", color_ratio)
//     if color_ratio < area_threshold:
//         return True, color_ratio

//     print(time.time() - tt)
//     return False, color_ratio