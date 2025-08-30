import { Divider, Input, Stack, styled } from "@mui/joy";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SIZE = {
    sliderHeight: 16,
    previewSize: 36,
    presetSize: 36,
    borderRadius: 8,
} as const;

const TRANSPARENCY_PATTERN =
    "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)";
const TRANSPARENCY_BG_SIZE = "8px 8px";
const TRANSPARENCY_BG_POSITION = "0 0, 0 4px, 4px -4px, -4px 0px";

interface ColorPickerProps {
    value?: string;
    onChange?: (color: string) => void;
    presetColors?: string[];
}

interface HSV {
    h: number;
    s: number;
    v: number;
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface HSL {
    h: number;
    s: number;
    l: number;
}

const hexToRgb = (hex: string): RGB => {
    try {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) {
            console.warn("Invalid hex color:", hex);
            return { r: 255, g: 0, b: 0 };
        }
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        };
    } catch (error) {
        console.warn("Error parsing hex color:", hex, error);
        return { r: 255, g: 0, b: 0 };
    }
};

const rgbToHsv = (rgb: RGB): HSV => {
    try {
        const { r, g, b } = rgb;
        const rNorm = Math.max(0, Math.min(255, r)) / 255;
        const gNorm = Math.max(0, Math.min(255, g)) / 255;
        const bNorm = Math.max(0, Math.min(255, b)) / 255;

        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const diff = max - min;

        let h = 0;
        if (diff !== 0) {
            if (max === rNorm) {
                h = ((gNorm - bNorm) / diff) % 6;
            } else if (max === gNorm) {
                h = (bNorm - rNorm) / diff + 2;
            } else {
                h = (rNorm - gNorm) / diff + 4;
            }
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;

        const s = Math.round(max === 0 ? 0 : (diff / max) * 100);
        const v = Math.round(max * 100);

        return { h, s, v };
    } catch (error) {
        console.warn("Error converting RGB to HSV:", rgb, error);
        return { h: 0, s: 100, v: 100 };
    }
};

const hsvToRgb = (hsv: HSV): RGB => {
    try {
        const { h, s, v } = hsv;
        const hNorm = Math.max(0, Math.min(360, h));
        const sNorm = Math.max(0, Math.min(100, s)) / 100;
        const vNorm = Math.max(0, Math.min(100, v)) / 100;

        const c = vNorm * sNorm;
        const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
        const m = vNorm - c;

        let r = 0,
            g = 0,
            b = 0;

        if (hNorm >= 0 && hNorm < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (hNorm >= 60 && hNorm < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (hNorm >= 120 && hNorm < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (hNorm >= 180 && hNorm < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (hNorm >= 240 && hNorm < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (hNorm >= 300 && hNorm < 360) {
            r = c;
            g = 0;
            b = x;
        }

        return {
            r: Math.round(Math.max(0, Math.min(255, (r + m) * 255))),
            g: Math.round(Math.max(0, Math.min(255, (g + m) * 255))),
            b: Math.round(Math.max(0, Math.min(255, (b + m) * 255))),
        };
    } catch (error) {
        console.warn("Error converting HSV to RGB:", hsv, error);
        return { r: 255, g: 0, b: 0 };
    }
};

const rgbToHex = (rgb: RGB): string => {
    try {
        const toHex = (n: number) => {
            const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    } catch (error) {
        console.warn("Error converting RGB to hex:", rgb, error);
        return "#ff0000";
    }
};

const hsvToHsl = (hsv: HSV): HSL => {
    try {
        const { h, s, v } = hsv;
        const sNorm = Math.max(0, Math.min(100, s)) / 100;
        const vNorm = Math.max(0, Math.min(100, v)) / 100;

        const l = vNorm - (vNorm * sNorm) / 2;
        const sl = l === 0 || l === 1 ? 0 : (vNorm - l) / Math.min(l, 1 - l);

        return {
            h: Math.max(0, Math.min(360, h)),
            s: Math.round(Math.max(0, Math.min(100, sl * 100))),
            l: Math.round(Math.max(0, Math.min(100, l * 100))),
        };
    } catch (error) {
        console.warn("Error converting HSV to HSL:", hsv, error);
        return { h: 0, s: 100, l: 50 };
    }
};

const hslToHsv = (hsl: HSL): HSV => {
    try {
        const { h, s, l } = hsl;
        const sNorm = Math.max(0, Math.min(100, s)) / 100;
        const lNorm = Math.max(0, Math.min(100, l)) / 100;

        const v = lNorm + sNorm * Math.min(lNorm, 1 - lNorm);
        const sv = v === 0 ? 0 : 2 * (1 - lNorm / v);

        return {
            h: Math.max(0, Math.min(360, h)),
            s: Math.round(Math.max(0, Math.min(100, sv * 100))),
            v: Math.round(Math.max(0, Math.min(100, v * 100))),
        };
    } catch (error) {
        console.warn("Error converting HSL to HSV:", hsl, error);
        return { h: 0, s: 100, v: 100 };
    }
};

const parseColorInput = (input: string, format: string): HSV | null => {
    try {
        const trimmed = input.trim().toLowerCase();

        if (format === "hex") {
            if (/^#?[0-9a-f]{6}$/i.test(trimmed)) {
                const hex = trimmed.startsWith("#") ? trimmed : "#" + trimmed;
                return rgbToHsv(hexToRgb(hex));
            }
        } else if (format === "rgb") {
            const match = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
                if (r <= 255 && g <= 255 && b <= 255) {
                    return rgbToHsv({ r, g, b });
                }
            }
        } else if (format === "hsl") {
            const match = trimmed.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*(?:,\s*([\d.]+))?\s*\)/);
            if (match) {
                const h = parseInt(match[1]);
                const s = parseInt(match[2]);
                const l = parseInt(match[3]);
                if (h < 360 && s <= 100 && l <= 100) {
                    return hslToHsv({ h, s, l });
                }
            }
        }
    } catch (error) {
        console.warn("Error parsing color input:", input, error);
    }

    return null;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ value = "#ff0000", onChange, presetColors = [] }) => {
    const [isDragging, setIsDragging] = useState<"saturation" | "hue" | "alpha" | null>(null);
    const [alpha, setAlpha] = useState(100);
    const [format, setFormat] = useState<"hex" | "rgb" | "hsl">("hex");

    const hexToHsv = useCallback((hex: string): HSV => {
        return rgbToHsv(hexToRgb(hex));
    }, []);

    const [hsv, setHsv] = useState<HSV>(hexToHsv(value));

    const saturationRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);
    const alphaRef = useRef<HTMLDivElement>(null);

    const currentColor = useMemo(() => rgbToHex(hsvToRgb(hsv)), [hsv]);

    const formattedColor = useMemo(() => {
        const rgb = hsvToRgb(hsv);
        const hsl = hsvToHsl(hsv);

        switch (format) {
            case "rgb":
                return alpha < 100
                    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(alpha / 100).toFixed(2)})`
                    : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            case "hsl":
                return alpha < 100
                    ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${(alpha / 100).toFixed(2)})`
                    : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            default:
                return currentColor;
        }
    }, [hsv, format, alpha, currentColor]);

    const debouncedOnChange = useDebouncedCallback((color: string) => {
        if (onChange) onChange(color);
    }, 16);

    const updateColor = useCallback(
        (newHsv: HSV, newAlpha?: number) => {
            setHsv(newHsv);
            const newColor = rgbToHex(hsvToRgb(newHsv));
            const finalAlpha = newAlpha ?? alpha;

            let colorOutput = newColor;
            if (finalAlpha < 100) {
                const rgb = hsvToRgb(newHsv);
                colorOutput = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${finalAlpha / 100})`;
            }

            if (debouncedOnChange) {
                debouncedOnChange(colorOutput);
            }
        },
        [alpha, debouncedOnChange],
    );

    const handleSaturationMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging("saturation");
        handleSaturationMove(e);
    };

    const handleHueMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging("hue");
        handleHueMove(e);
    };

    const handleAlphaMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging("alpha");
        handleAlphaMove(e);
    };

    const handleSaturationMove = (e: React.MouseEvent | MouseEvent) => {
        if (saturationRef.current) {
            const rect = saturationRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
            const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

            const s = Math.round((x / rect.width) * 100);
            const v = Math.round(100 - (y / rect.height) * 100);

            const newHsv = { ...hsv, s, v };
            updateColor(newHsv);
        }
    };

    const handleHueMove = (e: React.MouseEvent | MouseEvent) => {
        if (hueRef.current) {
            const rect = hueRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
            const h = Math.round((x / rect.width) * 360);

            const newHsv = { ...hsv, h };
            updateColor(newHsv);
        }
    };

    const handleAlphaMove = (e: React.MouseEvent | MouseEvent) => {
        if (alphaRef.current) {
            const rect = alphaRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
            const newAlpha = Math.round((x / rect.width) * 100);
            setAlpha(newAlpha);
            updateColor(hsv, newAlpha);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: "saturation" | "hue" | "alpha") => {
        const delta = e.shiftKey ? 10 : 1;
        const newHsv = { ...hsv };
        let newAlpha = alpha;

        switch (type) {
            case "saturation":
                if (e.key === "ArrowLeft") {
                    newHsv.s = Math.max(0, newHsv.s - delta);
                } else if (e.key === "ArrowRight") {
                    newHsv.s = Math.min(100, newHsv.s + delta);
                } else if (e.key === "ArrowUp") {
                    newHsv.v = Math.min(100, newHsv.v + delta);
                } else if (e.key === "ArrowDown") {
                    newHsv.v = Math.max(0, newHsv.v - delta);
                } else {
                    return;
                }
                break;
            case "hue":
                if (e.key === "ArrowLeft") {
                    newHsv.h = (newHsv.h - delta + 360) % 360;
                } else if (e.key === "ArrowRight") {
                    newHsv.h = (newHsv.h + delta) % 360;
                } else {
                    return;
                }
                break;
            case "alpha":
                if (e.key === "ArrowLeft") {
                    newAlpha = Math.max(0, newAlpha - delta);
                } else if (e.key === "ArrowRight") {
                    newAlpha = Math.min(100, newAlpha + delta);
                } else {
                    return;
                }
                break;
        }

        e.preventDefault();
        if (type === "alpha") {
            setAlpha(newAlpha);
            updateColor(hsv, newAlpha);
        } else {
            updateColor(newHsv);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging === "saturation") {
                handleSaturationMove(e);
            } else if (isDragging === "hue") {
                handleHueMove(e);
            } else if (isDragging === "alpha") {
                handleAlphaMove(e);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(null);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging, hsv, alpha, updateColor]);

    const handleInputChange = (inputValue: string) => {
        const parsedHsv = parseColorInput(inputValue, format);
        if (parsedHsv) {
            updateColor(parsedHsv);
        }
    };

    const handlePresetClick = (color: string) => {
        const newHsv = rgbToHsv(hexToRgb(color));
        updateColor(newHsv);
    };

    return (
        <Stack gap={2}>
            {/* Saturation/Brightness Area */}
            <div
                style={{
                    position: "relative",
                    aspectRatio: 16 / 9,
                    borderRadius: SIZE.borderRadius,
                    overflow: "hidden",
                    cursor: "crosshair",
                }}
            >
                <div
                    ref={saturationRef}
                    onMouseDown={handleSaturationMouseDown}
                    onKeyDown={(e) => handleKeyDown(e, "saturation")}
                    role="slider"
                    aria-label="Saturation and brightness"
                    aria-valuetext={`Saturation ${hsv.s}%, Brightness ${hsv.v}%`}
                    style={{
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(to right, #ffffff, hsl(${hsv.h}, 100%, 50%)),
                        linear-gradient(to top, #000000, transparent)`,
                        position: "relative",
                        outline: "none",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: `${hsv.s}%`,
                            top: `${100 - hsv.v}%`,
                            width: "12px",
                            height: "12px",
                            border: "2px solid white",
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.3)",
                            pointerEvents: "none",
                        }}
                    />
                </div>
            </div>

            <Stack gap={1}>
                {/* Hue Slider */}
                <div
                    style={{
                        width: "100%",
                        height: SIZE.sliderHeight,
                        position: "relative",
                        borderRadius: SIZE.sliderHeight / 2,
                        overflow: "hidden",
                        cursor: "pointer",
                    }}
                >
                    <div
                        ref={hueRef}
                        onMouseDown={handleHueMouseDown}
                        onKeyDown={(e) => handleKeyDown(e, "hue")}
                        role="slider"
                        aria-label="Hue"
                        aria-valuetext={`${hsv.h} degrees`}
                        aria-valuenow={hsv.h}
                        aria-valuemin={0}
                        aria-valuemax={360}
                        style={{
                            width: "100%",
                            height: "100%",
                            background:
                                "linear-gradient(to right, #ff0000 0%, #ff8000 12.5%, #ffff00 25%, #80ff00 37.5%, #00ff00 50%, #00ff80 62.5%, #00ffff 75%, #0080ff 87.5%, #0000ff 100%)",
                            outline: "none",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: `${(hsv.h / 360) * 100}%`,
                                top: "50%",
                                width: "4px",
                                height: SIZE.sliderHeight + 4,
                                backgroundColor: "white",
                                border: "1px solid rgba(0, 0, 0, 0.3)",
                                borderRadius: "2px",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                </div>
                {/* Opacity Slider */}
                <div
                    style={{
                        width: "100%",
                        height: SIZE.sliderHeight,
                        position: "relative",
                        borderRadius: SIZE.sliderHeight / 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        backgroundImage: TRANSPARENCY_PATTERN,
                        backgroundSize: TRANSPARENCY_BG_SIZE,
                        backgroundPosition: TRANSPARENCY_BG_POSITION,
                    }}
                >
                    <div
                        ref={alphaRef}
                        onMouseDown={handleAlphaMouseDown}
                        onKeyDown={(e) => handleKeyDown(e, "alpha")}
                        role="slider"
                        aria-label="Opacity"
                        aria-valuetext={`${alpha}% opacity`}
                        aria-valuenow={alpha}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{
                            width: "100%",
                            height: "100%",
                            background: `linear-gradient(to right, transparent, ${currentColor})`,
                            outline: "none",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: `${alpha}%`,
                                top: "50%",
                                width: "4px",
                                height: SIZE.sliderHeight + 4,
                                backgroundColor: "white",
                                border: "1px solid rgba(0, 0, 0, 0.3)",
                                borderRadius: "2px",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                </div>
            </Stack>

            {/* Color Preview and Input */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                    style={{
                        width: SIZE.previewSize,
                        height: SIZE.previewSize,
                        borderRadius: SIZE.borderRadius,
                        backgroundColor: currentColor,
                        opacity: alpha / 100,
                        flexShrink: 0,
                        backgroundImage: TRANSPARENCY_PATTERN,
                        backgroundSize: TRANSPARENCY_BG_SIZE,
                        backgroundPosition: TRANSPARENCY_BG_POSITION,
                    }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "68px 1fr" }}>
                    <Select
                        sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        value={format}
                        onChange={(e) => setFormat(e.target.value as "hex" | "rgb" | "hsl")}
                    >
                        <Option value="hex">HEX</Option>
                        <Option value="rgb">RGB</Option>
                        <Option value="hsl">HSL</Option>
                    </Select>
                    <Input
                        sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: 144 }}
                        value={formattedColor}
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                </div>
            </div>

            {presetColors.length ? (
                <>
                    <Divider />
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 36px)", gap: 8 }}>
                            {presetColors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handlePresetClick(color)}
                                    aria-label={`Preset color ${color}`}
                                    style={{
                                        position: "relative",
                                        width: SIZE.presetSize,
                                        height: SIZE.presetSize,
                                        backgroundColor: color,
                                        border:
                                            currentColor === color
                                                ? "2px solid var(--joy-palette-primary-outlinedBorder)"
                                                : "1px solid var(--joy-palette-neutral-outlinedBorder)",
                                        borderRadius: SIZE.borderRadius,
                                        cursor: "pointer",
                                    }}
                                >
                                    {currentColor === color && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                width: SIZE.presetSize * 0.4,
                                                height: SIZE.presetSize * 0.4,
                                                borderRadius: SIZE.borderRadius * 0.6,
                                                backgroundColor: "var(--joy-palette-primary-solidBg)",
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : null}
        </Stack>
    );
};

export default ColorPicker;

const Select = styled("select")(({ theme: { palette, fontFamily, fontSize, lineHeight, shadow } }) => ({
    width: "100%",
    height: 36,
    border: "1px solid",
    paddingInline: 8,
    borderRadius: 8,
    backgroundColor: palette.background.surface,
    borderColor: palette.neutral.outlinedBorder,
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: palette.neutral.outlinedColor,
    boxShadow: shadow.xs,
    ":focus": { borderColor: palette.focusVisible },
}));

const Option = styled("option")(({ theme: { fontFamily, fontSize, lineHeight } }) => ({
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
}));
