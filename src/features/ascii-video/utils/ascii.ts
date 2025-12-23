// ASCII 문자셋 (어두움 → 밝음 순서)
const ASCII_CHARS = ' .:-=+*#%@';

export interface AsciiCell {
  char: string;
  r: number;
  g: number;
  b: number;
}

/**
 * 밝기값(0-255)을 ASCII 문자로 변환
 */
function brightnessToAscii(brightness: number): string {
  const index = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
  // 반전: 밝은 곳 = 밀도 높은 문자
  return ASCII_CHARS[ASCII_CHARS.length - 1 - index];
}

/**
 * ImageData를 컬러 ASCII 데이터로 변환
 */
export function imageDataToColorAscii(
  imageData: ImageData,
  cols: number,
  rows: number,
): AsciiCell[][] {
  const { data, width, height } = imageData;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

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

      rowData.push({
        char: brightnessToAscii(avgBrightness),
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
