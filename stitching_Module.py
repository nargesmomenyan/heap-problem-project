import cv2
import numpy as np
import time
from skimage.io import imread, imsave, imshow, show
from matplotlib import pyplot as plt

def make_shift_preciser(base_image, temp_image, shift_r, shift_c, scale):
    shrink_width = 10
    im_height, im_width, _ = base_image.shape
    intersection_region = np.max([shift_r, 0]), np.max([shift_c, 0]),\
                          im_height + np.min([shift_r, 0]) , im_width + np.min([shift_c, 0])


    intersection_region_sh_temp = intersection_region[0] + shrink_width - shift_r, intersection_region[1] + shrink_width - shift_c,\
                             intersection_region[2] - shrink_width - shift_r, intersection_region[3] - shrink_width - shift_c

    temp_crop = temp_image[intersection_region_sh_temp[0]:intersection_region_sh_temp[2], \
                intersection_region_sh_temp[1]:intersection_region_sh_temp[3]]

    temp_crop = np.float32(temp_crop - np.mean(temp_crop))
    # base_image = np.float32(base_image - np.mean(base_image))

    r_step = np.int(shift_r >= 0) * 2 - 1
    c_step = np.int(shift_c >= 0) * 2 - 1

    r_range = list(range(0, scale * r_step, r_step))
    c_range = list(range(0, scale * c_step, c_step))

    if is_Debug:
        print(intersection_region_sh_temp)
        print(c_range, r_range)

    corr_eps_matrix = np.zeros((len(r_range), len(c_range)))
    for r_idx, rr_eps in enumerate(r_range):
        for c_idx, cc_eps in enumerate(c_range):

            crop_base_image = base_image[(intersection_region_sh_temp[0] + shift_r + rr_eps): (intersection_region_sh_temp[2] + shift_r + rr_eps), \
                              (intersection_region_sh_temp[1] + shift_c + cc_eps): (intersection_region_sh_temp[3] + shift_c + cc_eps)]
            crop_base_image = np.float32(crop_base_image - np.mean(crop_base_image))

            if is_Debug:
                print(temp_crop.shape, crop_base_image.shape, base_image.shape)
                print(intersection_region_sh_temp[0] + shift_r + rr_eps, intersection_region_sh_temp[2] + shift_r + rr_eps,\
                    intersection_region_sh_temp[1] + shift_c + rr_eps, intersection_region_sh_temp[3] + shift_c + rr_eps)

            corr_eps_matrix[r_idx, c_idx] = np.sum(temp_crop * crop_base_image) / np.sqrt(np.sum(crop_base_image ** 2))

    _, _, _, (max_corr_x, max_corr_y) = cv2.minMaxLoc(corr_eps_matrix)

    shift_r += r_range[max_corr_x]
    shift_c += c_range[max_corr_y]

    return shift_r, shift_c

def is_image_blank(image, grey_std_threshold=10, area_threshold=1e-4):

    tt = time.time()

    grey_ness = np.std(image, axis=2)
    grey_ness[grey_ness >= grey_std_threshold] = 255
    grey_ness[grey_ness < grey_std_threshold] = 0

    color_ratio = (np.sum(grey_ness>0) / (image.shape[0] * image.shape[1]))

    print("C_RAT", color_ratio)
    if color_ratio < area_threshold:
        return True, color_ratio

    print(time.time() - tt)
    return False, color_ratio


def is_image_blank_new(image, grey_std_threshold=10, area_threshold=1e-4):

    tt = time.time()

    image = np.array(image, dtype=np.int8)
    bg = np.abs(image[:, :, 0] - image[:, :, 1]) > 2 * grey_std_threshold  # B == G
    gr = np.abs(image[:, :, 1] - image[:, :, 2]) > 2 * grey_std_threshold  # G == R
    br = np.abs(image[:, :, 0] - image[:, :, 2]) > 2 * grey_std_threshold  # G == R
    slices = np.bitwise_or(bg, gr)
    slices = np.bitwise_or(slices, br)
    slices = np.array(slices, dtype=np.uint8) * 255


    color_ratio = (np.sum(slices>0) / (image.shape[0] * image.shape[1]))

    print("C_RAT", color_ratio)
    if color_ratio < area_threshold:
        return True, color_ratio

    print(time.time() - tt)
    return False, color_ratio


def stitch_ud(image_up, image_down, splitRatio=3, up_image_portion=0.7, acceptanceThresh=0.9, maxHighCorrPoint=5,
              expected_shift_r_ratio=0.75, expected_shift_c_ratio=0, max_shift_c_threshold_ratio=1.0,
              max_shift_r_threshold_ratio=0.15, grey_thresh = 10, pyramid_scale=4):


    print("Start Stitching ...")
    # Scaling
    image_down_small = image_down.copy()
    image_up_small   = image_up.copy()
    for ss in range(int(np.log2(pyramid_scale))):
        image_up_small    = cv2.pyrDown(image_up_small)
        image_down_small  = cv2.pyrDown(image_down_small)

    image_up_gray           = cv2.cvtColor(image_up_small, cv2.COLOR_BGR2GRAY)
    effective_x             = np.uint16(image_up_gray.shape[0] * up_image_portion)
    image_up_gray_cropped   = image_up_gray[effective_x:, :]
    image_down_gray         = cv2.cvtColor(image_down_small, cv2.COLOR_BGR2GRAY)

    # init list and parameters ...
    shift_direction_r = []
    shift_direction_c = []
    temp_r = np.uint16(image_down_small.shape[0] / splitRatio)
    temp_c = np.uint16(image_down_small.shape[1] / splitRatio)

    # Blankness check
    if is_image_blank(image_down_small[:temp_r, :, :], grey_std_threshold=grey_thresh)[0]:
        shift_c, shift_r = -1000, -1000
        print(shift_r, shift_c, "BLANK")
        return shift_r, shift_c
    else:
        image_up_gray_cropped_norm = np.float32(image_up_gray_cropped)
        for j in range(splitRatio):
            if len(shift_direction_c) >= maxHighCorrPoint:
                break

            image_cur_split = np.float32(image_down_gray[:temp_r, temp_c * j:temp_c * (j + 1)])
            corrMatrix      = cv2.matchTemplate(image_up_gray_cropped_norm, image_cur_split, cv2.TM_CCOEFF_NORMED)

            print(np.round(np.max(corrMatrix), 2))
            if np.round(np.max(corrMatrix), 2) >= acceptanceThresh:
                _, _, _, (max_corr_x, max_corr_y) = cv2.minMaxLoc(corrMatrix)
                max_corr_y += effective_x
                center_r, center_c = 0, np.uint16(image_down_small.shape[1] / splitRatio * j)

                if abs((max_corr_x - center_c) / image_up_small.shape[1] - expected_shift_c_ratio) > max_shift_c_threshold_ratio or \
                            abs((max_corr_y - center_r) / image_up_small.shape[0] - expected_shift_r_ratio) > max_shift_r_threshold_ratio:

                    continue

                shift_direction_r.append(max_corr_y - center_r)
                shift_direction_c.append(max_corr_x - center_c)

        if len(shift_direction_c) == 0:
            shift_c, shift_r = -1000, -1000
            print(shift_r, shift_c, "NO DETECTION")
            return shift_r, shift_c
        else:
            shift_c = np.median(np.array(shift_direction_c))
            shift_r = np.median(np.array(shift_direction_r))

            shift_c = np.int16(shift_c * pyramid_scale)
            shift_r = np.int16(shift_r * pyramid_scale)

            print("Stitch: ", shift_r, shift_c, len(shift_direction_c))
            return shift_r, shift_c

def stitch_rl(image_left, image_right, splitRatio=3, left_image_portion=0.7, acceptanceThresh=0.9, maxHighCorrPoint=5,
              expected_shift_r_ratio=0, expected_shift_c_ratio=0.75, max_shift_c_threshold_ratio=0.15,
              max_shift_r_threshold_ratio=0.15, grey_thresh=10, pyramid_scale=4):
    # Scaling
    image_right_small = image_right.copy()
    image_left_small = image_left.copy()

    for ss in range(int(np.log2(pyramid_scale))):
        image_right_small = cv2.pyrDown(image_right_small)
        image_left_small = cv2.pyrDown(image_left_small)

    print("Stitching ...")
    image_left_gray             = cv2.cvtColor(image_left_small, cv2.COLOR_BGR2GRAY)
    effective_x                 = np.uint16(image_left_small.shape[1] * left_image_portion)
    image_left_gray_cropped     = image_left_gray[:, effective_x:]
    image_right_gray            = cv2.cvtColor(image_right_small, cv2.COLOR_BGR2GRAY)

    # Blocking ...
    shift_direction_r = []
    shift_direction_c = []
    temp_r = np.uint16(image_right_small.shape[0] / splitRatio)
    temp_c = np.uint16(image_right_small.shape[1] / splitRatio)

    # Blankness check
    if is_image_blank(image_right_small[:, :temp_c, :], grey_std_threshold=grey_thresh)[0]:
        shift_c, shift_r = -1000, -1000
        print(shift_r, shift_c, "BLANK")
        return shift_r, shift_c
    else:
        image_left_gray_cropped_norm = np.float32(image_left_gray_cropped)

        for i in range(splitRatio):
            if len(shift_direction_c) >= maxHighCorrPoint:
                break
            image_cur_split = np.float32(image_right_gray[temp_r * i:temp_r * (i + 1), :temp_c])
            corrMatrix = cv2.matchTemplate(image_left_gray_cropped_norm, image_cur_split, cv2.TM_CCOEFF_NORMED)

            if np.round(np.max(corrMatrix), 2) > acceptanceThresh:
                _, _, _, (max_corr_x, max_corr_y) = cv2.minMaxLoc(corrMatrix)
                max_corr_x += effective_x
                center_r, center_c = np.uint16(image_right_small.shape[0] / splitRatio * i), 0

                if abs((max_corr_x - center_c) / image_left_small.shape[1] - expected_shift_c_ratio) > max_shift_c_threshold_ratio or \
                        abs((max_corr_y - center_r) / image_left_small.shape[0] - expected_shift_r_ratio) > max_shift_r_threshold_ratio:
                    continue

                shift_direction_r.append(max_corr_y - center_r)
                shift_direction_c.append(max_corr_x - center_c)

        if len(shift_direction_c) == 0:
            shift_c, shift_r = -1000, -1000
            print(shift_r, shift_c, "LEN=0")
            return shift_r, shift_c
        else:
            print(shift_direction_r, shift_direction_c)
            shift_c = np.median(np.array(shift_direction_c))
            shift_r = np.median(np.array(shift_direction_r))

            shift_c = np.int16(shift_c * pyramid_scale)
            shift_r = np.int16(shift_r * pyramid_scale)

            print("Stitch: ", shift_r, shift_c, len(shift_direction_c))
            return shift_r, shift_c

is_Debug = False


# image_left_path  = 'Data/whole_lamel_3_new/img_14_32.jpeg'
# image_right_path = 'Data/whole_lamel_3_new/img_14_33.jpeg'
#
# image_up_path    = 'Data/whole_lamel_3_new/img_10_33.jpeg'
# image_down_path  = 'Data/whole_lamel_3_new/img_11_32.jpeg'
#
#
# image_left  = cv2.imread(image_left_path)
# image_right = cv2.imread(image_right_path)
#
# split_ratio_lr      = 6
# split_ratio_ud      = 4
# maxHighCorrPoint_lr = 3
# maxHighCorrPoint_ud = 2
# acceptanceThresh_lr = 0.9
# acceptanceThresh_ud = 0.85
# lu_image_portion    = 0.5
# pyramid_scale       = 1
#
# r1, c1 = stitch_rl(image_left, image_right, splitRatio=split_ratio_lr, left_image_portion=lu_image_portion,\
#                       acceptanceThresh=acceptanceThresh_lr, maxHighCorrPoint=maxHighCorrPoint_lr, pyramid_scale=pyramid_scale)
#
#
# pyramid_scale       = 2
# r2, c2 = stitch_rl(image_left, image_right, splitRatio=split_ratio_lr, left_image_portion=lu_image_portion,\
#                       acceptanceThresh=acceptanceThresh_lr, maxHighCorrPoint=maxHighCorrPoint_lr, pyramid_scale=pyramid_scale)
#
# pyramid_scale       = 4
# r3, c3 = stitch_rl(image_left, image_right, splitRatio=split_ratio_lr, left_image_portion=lu_image_portion,\
#                       acceptanceThresh=acceptanceThresh_lr, maxHighCorrPoint=maxHighCorrPoint_lr, pyramid_scale=pyramid_scale)
#
#
# print(r1, c1)
# print(r2, c2)
# print(r3, c3)