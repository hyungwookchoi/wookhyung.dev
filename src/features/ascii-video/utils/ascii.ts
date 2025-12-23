// ASCII 문자셋 (어두움 → 밝음 순서) - 70개 문자로 확장
const ASCII_CHARS =
  ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

export interface AsciiCell {
  char: string;
  r: number;
  g: number;
  b: number;
}

/**
 * 감마 보정 적용 (어두운 부분 디테일 향상)
 */
function applyGammaCorrection(brightness: number, gamma: number = 1.1): number {
  return Math.pow(brightness / 255, gamma) * 255;
}

/**
 * 대비 향상 적용
 */
function applyContrast(brightness: number, contrast: number = 1.3): number {
  return Math.min(255, Math.max(0, (brightness - 128) * contrast + 128));
}

/**
 * 밝기값(0-255)을 ASCII 문자로 변환
 */
function brightnessToAscii(brightness: number): string {
  // 감마 보정 및 대비 향상 적용
  const corrected = applyContrast(applyGammaCorrection(brightness));
  const index = Math.floor((corrected / 255) * (ASCII_CHARS.length - 1));
  // 반전: 밝은 곳 = 밀도 높은 문자
  return ASCII_CHARS[ASCII_CHARS.length - 1 - index];
}

/**
 * 이미지에서 밝기 맵 생성 (엣지 검출용)
 */
function createBrightnessMap(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): number[][] {
  const brightnessMap: number[][] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      row.push(r * 0.299 + g * 0.587 + b * 0.114);
    }
    brightnessMap.push(row);
  }

  return brightnessMap;
}

/**
 * Sobel 엣지 검출
 */
function calculateEdgeMagnitude(
  brightnessMap: number[][],
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  // Sobel 커널
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];

  let gx = 0;
  let gy = 0;

  for (let ky = -1; ky <= 1; ky++) {
    for (let kx = -1; kx <= 1; kx++) {
      const px = Math.min(Math.max(x + kx, 0), width - 1);
      const py = Math.min(Math.max(y + ky, 0), height - 1);
      const brightness = brightnessMap[py][px];

      gx += brightness * sobelX[ky + 1][kx + 1];
      gy += brightness * sobelY[ky + 1][kx + 1];
    }
  }

  return Math.sqrt(gx * gx + gy * gy);
}

/**
 * ImageData를 컬러 ASCII 데이터로 변환 (엣지 강조 포함)
 */
export function imageDataToColorAscii(
  imageData: ImageData,
  cols: number,
  rows: number,
): AsciiCell[][] {
  const { data, width, height } = imageData;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  // 엣지 검출용 밝기 맵 생성
  const brightnessMap = createBrightnessMap(data, width, height);

  const result: AsciiCell[][] = [];

  for (let row = 0; row < rows; row++) {
    const rowData: AsciiCell[] = [];

    for (let col = 0; col < cols; col++) {
      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let totalBrightness = 0;
      let count = 0;

      const startX = Math.floor(col * cellWidth);
      const endX = Math.floor((col + 1) * cellWidth);
      const startY = Math.floor(row * cellHeight);
      const endY = Math.floor((row + 1) * cellHeight);

      // 셀 중앙 좌표 (엣지 검출용)
      const centerX = Math.floor((startX + endX) / 2);
      const centerY = Math.floor((startY + endY) / 2);

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const i = (y * width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          totalR += r;
          totalG += g;
          totalB += b;
          totalBrightness += r * 0.299 + g * 0.587 + b * 0.114;
          count++;
        }
      }

      const avgR = count > 0 ? Math.round(totalR / count) : 0;
      const avgG = count > 0 ? Math.round(totalG / count) : 0;
      const avgB = count > 0 ? Math.round(totalB / count) : 0;
      const avgBrightness = count > 0 ? totalBrightness / count : 0;

      // 셀 중앙에서만 엣지 강도 계산 (성능 최적화)
      const edgeMagnitude = calculateEdgeMagnitude(
        brightnessMap,
        centerX,
        centerY,
        width,
        height,
      );

      // 엣지 강도를 밝기에 블렌딩 (30% 가중치)
      // 엣지 강도를 0-255 범위로 정규화 (최대값 약 1443)
      const normalizedEdge = Math.min(255, edgeMagnitude / 5.66);
      const blendedBrightness = avgBrightness * 0.7 + normalizedEdge * 0.3;

      rowData.push({
        char: brightnessToAscii(blendedBrightness),
        r: avgR,
        g: avgG,
        b: avgB,
      });
    }

    result.push(rowData);
  }

  return result;
}

/**
 * 비디오 비율에 맞는 cols/rows 계산
 * 모노스페이스 문자는 세로가 가로의 약 2배 (가로:세로 = 1:2)
 * 따라서 동일한 비율을 유지하려면 가로 문자 수를 2배로 해야 함
 */
export function calculateDimensions(
  videoWidth: number,
  videoHeight: number,
  maxRows: number = 80,
): { cols: number; rows: number } {
  const charHeightRatio = 2; // 문자 세로/가로 비율 (세로가 가로의 2배)
  const videoAspectRatio = videoWidth / videoHeight;

  // rows를 기준으로 cols 계산
  // cols = rows * (videoWidth/videoHeight) * charHeightRatio
  const rows = maxRows;
  const cols = Math.round(rows * videoAspectRatio * charHeightRatio);

  return { cols, rows };
}
