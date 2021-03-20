import { Dimensions } from "react-native";

const BASE_HEIGHT = 812;
const DESIGN_WIDTH = 375;
const { width: viewportWidth } = Dimensions.get("window");

export const getHeightPercentageOf: (pixels: number) => number = (pixels) =>
  (pixels / BASE_HEIGHT) * 100;

export const getResponsive = (x: number) => {
  return Math.round((x / DESIGN_WIDTH) * viewportWidth);
};

function dp(pixels: number, px: true): string;
function dp(pixels: number, px?: undefined): string;
function dp(pixels: number, px: false): number;
function dp(pixels: number, px?: boolean) {
  const usePxUnit = px === undefined || px;

  const dp = getResponsive(pixels);

  return usePxUnit ? `${dp}px` : dp;
}
function dpx(pixels: number) {
  return getResponsive(pixels);
}

export { dp, dpx };

type Spacings =
  | 0
  | 1
  | 2
  | 4
  | 6
  | 8
  | 10
  | 12
  | 14
  | 16
  | 18
  | 20
  | 22
  | 26
  | 30
  | 34
  | 40;

export function padding(spacings: Spacings[]): string {
  return `padding: ${spacings.map((s) => dp(s)).join(" ")};`;
}
export function margin(spacings: Spacings[]): string {
  return `margin: ${spacings.map((s) => dp(s)).join(" ")};`;
}

export function mt(s: Spacings): string {
  return `margin-top: ${dp(s)}`;
}
export function ml(s: Spacings): string {
  return `margin-left: ${dp(s)}`;
}

export function mr(s: Spacings): string {
  return `margin-right: ${dp(s)}`;
}

export const convertMeasureInNumber = (measure: string) =>
  parseFloat(measure.replace("px", ""));

export default {
  borderRadius: dp(10),
  smallBorderRadius: dp(2),
  ellipseBorderRadius: dp(100),

  bigPadding: dp(15),
  largePadding: dp(25),
  hugePadding: dp(35),
  mediumPadding: dp(10),
  normalPadding: dp(20),
  tinyPadding: dp(2),
  smallPadding: dp(7),
  buttonPadding: dp(19),

  largeMargin: dp(15),
  bigMargin: dp(20),
  modalMargin: dp(25),
  mediumMargin: dp(10),
  smallMargin: dp(5),
  logoMargin: dp(50.6),

  defaultMarginToUnderline: dp(6),

  inputHeight: dp(60),
  ruleLineHeight: dp(1),
  loadingIndicatorHeight: dp(4),

  marginLeft: dp(22),
};
