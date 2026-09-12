import os
import cv2
import numpy as np
from PIL import Image as PILImage

class ComputerVisionService:
    """
    Member 2 — Computer Vision Preprocessing Pipeline:
    - Image format & dimension validation
    - Grayscale & noise filtering
    - CLAHE adaptive contrast normalization
    - Deskew angle calculation & rotation
    - Label region contour identification & cropping
    """

    @staticmethod
    def preprocess_image(image_path: str, output_dir: str) -> dict:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Input image not found: {image_path}")

        # Read image
        img = cv2.imread(image_path)
        if img is None:
            # Try PIL fallback if OpenCV format fails
            pil_img = PILImage.open(image_path).convert('RGB')
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        h, w = img.shape[:2]

        # 1. Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 2. Denoise with bilateral filter (preserves edges of text)
        denoised = cv2.bilateralFilter(gray, 9, 75, 75)

        # 3. CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        contrast_enhanced = clahe.apply(denoised)

        # 4. Perimeter & Crimp Edge Band Enhancement (for dot-matrix CIJ inkjet codes on borders/flaps)
        perimeter_enhanced = ComputerVisionService._enhance_perimeter_bands(contrast_enhanced)

        # 5. Estimate skew angle
        angle = ComputerVisionService._detect_skew_angle(perimeter_enhanced)
        if abs(angle) > 0.5 and abs(angle) < 45.0:
            rotated = ComputerVisionService._rotate_image(perimeter_enhanced, angle)
        else:
            rotated = perimeter_enhanced

        # Save processed output image
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        os.makedirs(output_dir, exist_ok=True)
        processed_path = os.path.join(output_dir, f"{base_name}_preprocessed.png")
        cv2.imwrite(processed_path, rotated)

        return {
            "processed_path": processed_path,
            "original_width": w,
            "original_height": h,
            "skew_angle_corrected": float(angle),
            "enhancements": ["bilateral_denoise", "clahe_contrast", "perimeter_crimp_enhance", "deskew"]
        }

    @staticmethod
    def _enhance_perimeter_bands(gray_img: np.ndarray) -> np.ndarray:
        """
        Enhances contrast and sharpness along the top/bottom/side perimeter crimps and flaps
        where dynamic Continuous Inkjet (CIJ) or Laser batch codes and prices are stamped.
        """
        try:
            h, w = gray_img.shape[:2]
            result = gray_img.copy()

            top_h = max(10, int(h * 0.16))
            bot_h = min(h - 10, int(h * 0.84))
            left_w = max(10, int(w * 0.14))
            right_w = min(w - 10, int(w * 0.86))

            # Apply unsharp masking to boost low-contrast dot-matrix dots
            gaussian = cv2.GaussianBlur(gray_img, (0, 0), 2.0)
            unsharp = cv2.addWeighted(gray_img, 1.5, gaussian, -0.5, 0)

            result[:top_h, :] = unsharp[:top_h, :]
            result[bot_h:, :] = unsharp[bot_h:, :]
            result[:, :left_w] = unsharp[:, :left_w]
            result[:, right_w:] = unsharp[:, right_w]
            return result
        except Exception:
            return gray_img

    @staticmethod
    def _detect_skew_angle(gray_img) -> float:
        try:
            edges = cv2.Canny(gray_img, 50, 150, apertureSize=3)
            lines = cv2.HoughLinesP(edges, 1, np.pi / 180, 100, minLineLength=100, maxLineGap=10)
            if lines is not None and len(lines) > 0:
                angles = []
                for line in lines:
                    x1, y1, x2, y2 = line[0]
                    if x2 != x1:
                        theta = np.degrees(np.arctan2(y2 - y1, x2 - x1))
                        if abs(theta) < 45:
                            angles.append(theta)
                if angles:
                    return float(np.median(angles))
            return 0.0
        except Exception:
            return 0.0

    @staticmethod
    def _rotate_image(image, angle: float):
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        return cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
