"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CopyIcon,
  RefreshCcw,
  Save as SaveIcon,
  X,
  HelpCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface Position {
  x: number;
  y: number;
}

interface SavedColor {
  id: string;
  hex: string;
  rgb: { r: number; g: number; b: number; a: number };
  timestamp: number;
}

export default function ColorConverterPage() {
  const [hexColor, setHexColor] = useState("#1e88e5");
  const [rgbColor, setRgbColor] = useState({ r: 30, g: 136, b: 229, a: 1 });
  const [hslColor, setHslColor] = useState({ h: 210, s: 80, l: 50 });
  const [cmykColor, setCmykColor] = useState({ c: 87, m: 41, y: 0, k: 10 });
  const [copied, setCopied] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [hue, setHue] = useState(210); // 默认色相
  const pickerRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [isAlphaDragging, setIsAlphaDragging] = useState(false);
  const alphaRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // 在组件加载时从 localStorage 读取保存的颜色
  useEffect(() => {
    const saved = localStorage.getItem("savedColors");
    if (saved) {
      setSavedColors(JSON.parse(saved));
    }
  }, []);

  // 保存颜色到历史记录
  const saveColor = () => {
    const newColor: SavedColor = {
      id: Date.now().toString(),
      hex: hexColor,
      rgb: rgbColor,
      timestamp: Date.now(),
    };

    // 检查是否已经保存过相同的颜色
    const isDuplicate = savedColors.some(
      (color) => color.hex === hexColor && color.rgb.a === rgbColor.a
    );

    if (!isDuplicate) {
      const updatedColors = [newColor, ...savedColors].slice(0, 20); // 最多保存20个颜色
      setSavedColors(updatedColors);
      localStorage.setItem("savedColors", JSON.stringify(updatedColors));
    }
  };

  // 从历史记录中删除颜色
  const removeColor = (id: string) => {
    const updatedColors = savedColors.filter((color) => color.id !== id);
    setSavedColors(updatedColors);
    localStorage.setItem("savedColors", JSON.stringify(updatedColors));
  };

  // 从历史记录中加载颜色
  const loadColor = (color: SavedColor) => {
    setHexColor(color.hex);
    setRgbColor(color.rgb);
    setHslColor(rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b));
    setCmykColor(rgbToCmyk(color.rgb.r, color.rgb.g, color.rgb.b));

    // 更新颜色选择器位置
    const hsv = rgbToHsv(color.rgb.r, color.rgb.g, color.rgb.b);
    setHue(hsv.h);
    setPosition({
      x: hsv.s / 100,
      y: 1 - hsv.v / 100,
    });
  };

  // 修改 hexToRgb 函数
  const hexToRgb = (
    hex: string
  ): { r: number; g: number; b: number; a: number } | null => {
    // 处理3位十六进制 (#RGB)
    const result3 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (result3) {
      return {
        r: parseInt(result3[1] + result3[1], 16),
        g: parseInt(result3[2] + result3[2], 16),
        b: parseInt(result3[3] + result3[3], 16),
        a: 1,
      };
    }

    // 处理4位十六进制 (#RGBA)
    const result4 = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (result4) {
      return {
        r: parseInt(result4[1] + result4[1], 16),
        g: parseInt(result4[2] + result4[2], 16),
        b: parseInt(result4[3] + result4[3], 16),
        a:
          Math.round((parseInt(result4[4] + result4[4], 16) / 255) * 100) / 100,
      };
    }

    // 处理6位十六进制 (#RRGGBB)
    const result6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result6) {
      return {
        r: parseInt(result6[1], 16),
        g: parseInt(result6[2], 16),
        b: parseInt(result6[3], 16),
        a: 1,
      };
    }

    // 处理8位十六进制 (#RRGGBBAA)
    const result8 =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result8) {
      return {
        r: parseInt(result8[1], 16),
        g: parseInt(result8[2], 16),
        b: parseInt(result8[3], 16),
        a: Math.round((parseInt(result8[4], 16) / 255) * 100) / 100,
      };
    }

    return null;
  };

  // 转换RGB到十六进制
  const rgbToHex = (r: number, g: number, b: number, a?: number): string => {
    const alpha =
      a !== undefined
        ? Math.round(a * 255)
            .toString(16)
            .padStart(2, "0")
        : "";
    return (
      "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1) + alpha
    );
  };

  // 转换RGB到HSL
  const rgbToHsl = (
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number; a: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      a: rgbColor.a,
    };
  };

  // 转换HSL到RGB
  const hslToRgb = (
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // 转换RGB到CMYK
  const rgbToCmyk = (
    r: number,
    g: number,
    b: number
  ): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  };

  // 转换CMYK到RGB
  const cmykToRgb = (
    c: number,
    m: number,
    y: number,
    k: number
  ): { r: number; g: number; b: number } => {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
    };
  };

  // 添加 RGB 到 HSV 的转换函数
  const rgbToHsv = (
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  };

  // 修改 handleHexChange 函数
  const handleHexChange = (value: string) => {
    if (value.startsWith("#") && value.length <= 9) {
      setHexColor(value);

      // 检查是否是有效的十六进制颜色值
      if (
        value.length === 4 ||
        value.length === 5 ||
        value.length === 7 ||
        value.length === 9
      ) {
        const rgb = hexToRgb(value);
        if (rgb) {
          setRgbColor(rgb);
          setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
          setCmykColor(rgbToCmyk(rgb.r, rgb.g, rgb.b));

          // 更新颜色选择器位置
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
          setHue(hsv.h);
          setPosition({
            x: hsv.s / 100,
            y: 1 - hsv.v / 100,
          });
        }
      }
    } else if (!value.startsWith("#") && value.length <= 8) {
      setHexColor("#" + value);

      // 检查是否是有效的十六进制颜色值
      if (
        value.length === 3 ||
        value.length === 4 ||
        value.length === 6 ||
        value.length === 8
      ) {
        const rgb = hexToRgb("#" + value);
        if (rgb) {
          setRgbColor(rgb);
          setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
          setCmykColor(rgbToCmyk(rgb.r, rgb.g, rgb.b));

          // 更新颜色选择器位置
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
          setHue(hsv.h);
          setPosition({
            x: hsv.s / 100,
            y: 1 - hsv.v / 100,
          });
        }
      }
    }
  };

  // 处理RGB输入变化
  const handleRgbChange = (color: "r" | "g" | "b" | "a", value: number) => {
    const maxValue = color === "a" ? 1 : 255;
    let newValue = Math.max(0, Math.min(maxValue, value));
    if (color === "a") {
      newValue = Math.round(newValue * 100) / 100; // 保留两位小数
    }
    const newRgb = { ...rgbColor, [color]: newValue };
    setRgbColor(newRgb);

    // 更新十六进制值，包含透明度
    setHexColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b, newRgb.a));

    // 只在更改 RGB 值时更新其他颜色格式和选择器位置
    if (color !== "a") {
      setHslColor(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
      setCmykColor(rgbToCmyk(newRgb.r, newRgb.g, newRgb.b));

      // 更新颜色选择器位置
      const hsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
      setHue(hsv.h);
      setPosition({
        x: hsv.s / 100,
        y: 1 - hsv.v / 100,
      });
    }
  };

  // 处理HSL输入变化
  const handleHslChange = (color: "h" | "s" | "l", value: number) => {
    const maxValues = { h: 360, s: 100, l: 100 };
    const newValue = Math.max(0, Math.min(maxValues[color], value));
    const newHsl = { ...hslColor, [color]: newValue };
    setHslColor(newHsl);

    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgbColor({ ...rgb, a: rgbColor.a });
    setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b, rgbColor.a));
    setCmykColor(rgbToCmyk(rgb.r, rgb.g, rgb.b));

    // 更新颜色选择器位置
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setHue(hsv.h);
    setPosition({
      x: hsv.s / 100,
      y: 1 - hsv.v / 100,
    });
  };

  // 处理CMYK输入变化
  const handleCmykChange = (color: "c" | "m" | "y" | "k", value: number) => {
    const newValue = Math.max(0, Math.min(100, value));
    const newCmyk = { ...cmykColor, [color]: newValue };
    setCmykColor(newCmyk);

    const rgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    setRgbColor({ ...rgb, a: rgbColor.a });
    setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b, rgbColor.a));
    setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));

    // 更新颜色选择器位置
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setHue(hsv.h);
    setPosition({
      x: hsv.s / 100,
      y: 1 - hsv.v / 100,
    });
  };

  // 复制颜色值
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // 重置颜色
  const resetColor = () => {
    setHexColor("#1e88e5");
    setRgbColor({ r: 30, g: 136, b: 229, a: 1 });
    setHslColor({ h: 210, s: 80, l: 50 });
    setCmykColor({ c: 87, m: 41, y: 0, k: 10 });
  };

  // 创建颜色值显示组件
  const ColorValueDisplay = ({
    label,
    value,
    onCopy,
  }: {
    label: string;
    value: string;
    onCopy: () => void;
  }) => (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center mt-1.5">
        <code className="bg-muted px-4 py-2 rounded-md font-mono flex-grow">
          {value}
        </code>
        <Button
          className="ml-2 flex-shrink-0"
          variant="outline"
          onClick={onCopy}
        >
          <CopyIcon className="h-4 w-4" />
          {copied === label && <span className="ml-1 text-xs">已复制!</span>}
        </Button>
      </div>
    </div>
  );

  // 计算颜色选择器的背景色
  const getPickerBackground = useCallback(() => {
    return `hsl(${hue}, 100%, 50%)`;
  }, [hue]);

  // 处理颜色面板的鼠标/触摸事件
  const handlePickerMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    handlePickerMove(e);
  };

  // 处理色相条的鼠标/触摸事件
  const handleHueMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsHueDragging(true);
    handleHueMove(e);
  };

  // 处理颜色选择器的移动
  const handlePickerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      if (!isDragging || !pickerRef.current) return;

      const bounds = pickerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const x = Math.max(
        0,
        Math.min(1, (clientX - bounds.left) / bounds.width)
      );
      const y = Math.max(
        0,
        Math.min(1, (clientY - bounds.top) / bounds.height)
      );

      setPosition({ x, y });

      // 将 HSV 转换为 RGB
      const s = x * 100;
      const v = (1 - y) * 100;
      const h = hue;

      // HSV to RGB 转换
      const rgb = hsvToRgb(h, s, v);
      setRgbColor({ ...rgb, a: rgbColor.a });
      setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b, rgbColor.a));
      setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
      setCmykColor(rgbToCmyk(rgb.r, rgb.g, rgb.b));
    },
    [isDragging, hue]
  );

  // 处理色相条的移动
  const handleHueMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      if (!isHueDragging || !hueRef.current) return;

      const bounds = hueRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const x = Math.max(
        0,
        Math.min(1, (clientX - bounds.left) / bounds.width)
      );

      const newHue = Math.round(x * 360);
      setHue(newHue);

      // 更新颜色
      const s = position.x * 100;
      const v = (1 - position.y) * 100;
      const rgb = hsvToRgb(newHue, s, v);
      setRgbColor({ ...rgb, a: rgbColor.a });
      setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b, rgbColor.a));
      setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
      setCmykColor(rgbToCmyk(rgb.r, rgb.g, rgb.b));
    },
    [isHueDragging, position]
  );

  // 添加 HSV 到 RGB 的转换函数
  const hsvToRgb = (
    h: number,
    s: number,
    v: number
  ): { r: number; g: number; b: number } => {
    s = s / 100;
    v = v / 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  };

  // 添加透明度滑块的触摸事件处理
  const handleAlphaMove = (e: MouseEvent | TouchEvent) => {
    if (!isAlphaDragging || !alphaRef.current) return;

    const bounds = alphaRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));

    handleRgbChange("a", x);
  };

  // 添加事件监听器
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsHueDragging(false);
      setIsAlphaDragging(false);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      handlePickerMove(e);
      handleHueMove(e);
      handleAlphaMove(e);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, [handlePickerMove, handleHueMove, handleAlphaMove]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">颜色转换器</h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                <HelpCircle className="h-4 w-4 mr-2" />
                颜色格式说明
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] p-4">
              <DropdownMenuLabel className="text-sm font-semibold mb-2">
                颜色格式说明
              </DropdownMenuLabel>
              <div className="space-y-3">
                <div className="p-2 rounded-md bg-muted/30">
                  <h4 className="font-medium text-xs mb-1">HEX (十六进制)</h4>
                  <p className="text-xs text-muted-foreground">
                    十六进制颜色支持3位(#RGB)、4位(#RGBA)、6位(#RRGGBB)和8位(#RRGGBBAA)格式。
                  </p>
                </div>
                <div className="p-2 rounded-md bg-muted/30">
                  <h4 className="font-medium text-xs mb-1">RGBA</h4>
                  <p className="text-xs text-muted-foreground">
                    RGBA颜色由四个值组成：红色(R)、绿色(G)和蓝色(B)的值范围是0到255，透明度(A)的值范围是0到1。
                  </p>
                </div>
                <div className="p-2 rounded-md bg-muted/30">
                  <h4 className="font-medium text-xs mb-1">HSL/HSLA</h4>
                  <p className="text-xs text-muted-foreground">
                    HSL/HSLA表示色调(Hue)、饱和度(Saturation)、亮度(Lightness)和透明度(Alpha)。
                  </p>
                </div>
                <div className="p-2 rounded-md bg-muted/30">
                  <h4 className="font-medium text-xs mb-1">CMYK</h4>
                  <p className="text-xs text-muted-foreground">
                    CMYK颜色模型用于印刷，由青色(Cyan)、品红色(Magenta)、黄色(Yellow)和黑色(Key)四种油墨的百分比组成。
                  </p>
                </div>
                <div className="p-2 rounded-md bg-muted/30">
                  <h4 className="font-medium text-xs mb-1">HSV/HSVA</h4>
                  <p className="text-xs text-muted-foreground">
                    HSV/HSVA表示色调(Hue)、饱和度(Saturation)、明度(Value)和透明度(Alpha)。
                  </p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 颜色预览 */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* 颜色选择器 */}
              <div
                className="relative w-full aspect-square rounded-lg shadow-md"
                ref={pickerRef}
                style={{
                  backgroundColor: getPickerBackground(),
                  backgroundImage:
                    "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
                }}
                onMouseDown={handlePickerMouseDown}
                onTouchStart={handlePickerMouseDown}
              >
                {/* 选择器指示点 */}
                <div
                  className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${position.x * 100}%`,
                    top: `${position.y * 100}%`,
                    backgroundColor: hexColor,
                  }}
                />
              </div>

              {/* 色相滑块 */}
              <div
                className="relative h-4 rounded-md shadow-md"
                ref={hueRef}
                style={{
                  background:
                    "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                }}
                onMouseDown={handleHueMouseDown}
                onTouchStart={handleHueMouseDown}
              >
                {/* 色相滑块指示器 */}
                <div
                  className="absolute w-4 h-full border-2 border-white rounded-md shadow-md transform -translate-x-1/2"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                  }}
                />
              </div>

              {/* 透明度滑块 */}
              <div
                className="relative h-4 rounded-md shadow-md"
                ref={alphaRef}
                style={{
                  background: `linear-gradient(to right, transparent, ${hexColor})`,
                  backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
                  backgroundSize: "8px 8px",
                  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                }}
                onMouseDown={(e) => {
                  setIsAlphaDragging(true);
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(
                    0,
                    Math.min(1, (e.clientX - bounds.left) / bounds.width)
                  );
                  handleRgbChange("a", x);
                }}
                onTouchStart={(e) => {
                  setIsAlphaDragging(true);
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(
                    0,
                    Math.min(
                      1,
                      (e.touches[0].clientX - bounds.left) / bounds.width
                    )
                  );
                  handleRgbChange("a", x);
                }}
              >
                {/* 透明度滑块指示器 */}
                <div
                  className="absolute w-4 h-full border-2 border-white rounded-md shadow-md transform -translate-x-1/2"
                  style={{
                    left: `${rgbColor.a * 100}%`,
                    backgroundColor: hexColor,
                  }}
                />
              </div>

              <div className="flex justify-center space-x-2 mb-2">
                <Button variant="outline" onClick={resetColor}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  重置颜色
                </Button>
                <Button variant="outline" onClick={saveColor}>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  保存颜色
                </Button>
              </div>

              {/* 历史记录 - 更紧凑的版本 */}
              <div className="border-t pt-2">
                <div className="flex flex-wrap gap-1">
                  {savedColors.slice(0, 8).map((color) => (
                    <div key={color.id} className="relative group">
                      <div
                        className="w-6 h-6 rounded-sm cursor-pointer border border-border/50"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => loadColor(color)}
                      >
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-1 -right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeColor(color.id);
                          }}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 颜色值展示 - 右侧 */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* 颜色预览和HEX输入 */}
              <div>
                <div className="flex items-center mb-2">
                  {/* 隐藏的颜色选择器 */}
                  <input
                    type="color"
                    ref={colorPickerRef}
                    value={hexColor}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="sr-only"
                  />

                  {/* 可点击的颜色预览块 */}
                  <div
                    className="w-8 h-8 rounded-md border border-border/50 shadow-sm mr-2 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                    style={{
                      backgroundColor: hexColor,
                      backgroundImage:
                        rgbColor.a < 1
                          ? `
                        linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%)
                      `
                          : "none",
                      backgroundSize: "4px 4px",
                      backgroundPosition: "0 0, 0 2px, 2px -2px, -2px 0px",
                    }}
                    onClick={() => colorPickerRef.current?.click()}
                    title="点击打开颜色选择器"
                  />
                  <Label htmlFor="hex">十六进制颜色值 (HEX)</Label>
                </div>
                <div className="flex mt-1">
                  <Input
                    id="hex"
                    value={hexColor}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="font-mono"
                    placeholder="#000000"
                  />
                  <Button
                    className="ml-2 flex-shrink-0"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(hexColor.toUpperCase(), "HEX")
                    }
                  >
                    <CopyIcon className="h-4 w-4" />
                    {copied === "HEX" && (
                      <span className="ml-1 text-xs">已复制!</span>
                    )}
                  </Button>
                </div>
              </div>

              {/* 颜色值展示区域 - 使用两列布局 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 左列 */}
                <div className="space-y-4">
                  {/* RGB 值显示 */}
                  <div className="space-y-2">
                    <h3 className="font-medium">RGBA</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="r-value">R (红)</Label>
                        <Input
                          id="r-value"
                          type="number"
                          min="0"
                          max="255"
                          value={rgbColor.r}
                          onChange={(e) =>
                            handleRgbChange("r", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="g-value">G (绿)</Label>
                        <Input
                          id="g-value"
                          type="number"
                          min="0"
                          max="255"
                          value={rgbColor.g}
                          onChange={(e) =>
                            handleRgbChange("g", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="b-value">B (蓝)</Label>
                        <Input
                          id="b-value"
                          type="number"
                          min="0"
                          max="255"
                          value={rgbColor.b}
                          onChange={(e) =>
                            handleRgbChange("b", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="a-value">A (透明度)</Label>
                        <Input
                          id="a-value"
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={rgbColor.a}
                          onChange={(e) =>
                            handleRgbChange(
                              "a",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                    </div>
                    <ColorValueDisplay
                      label="RGBA"
                      value={`rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${rgbColor.a})`}
                      onCopy={() =>
                        copyToClipboard(
                          `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${rgbColor.a})`,
                          "RGBA"
                        )
                      }
                    />
                  </div>

                  {/* HSL 值显示 */}
                  <div className="space-y-2">
                    <h3 className="font-medium">HSL</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="h-value">H (色调)</Label>
                        <Input
                          id="h-value"
                          type="number"
                          min="0"
                          max="360"
                          value={hslColor.h}
                          onChange={(e) =>
                            handleHslChange("h", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="s-value">S (饱和度)</Label>
                        <Input
                          id="s-value"
                          type="number"
                          min="0"
                          max="100"
                          value={hslColor.s}
                          onChange={(e) =>
                            handleHslChange("s", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="l-value">L (亮度)</Label>
                        <Input
                          id="l-value"
                          type="number"
                          min="0"
                          max="100"
                          value={hslColor.l}
                          onChange={(e) =>
                            handleHslChange("l", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                    </div>
                    <ColorValueDisplay
                      label="HSL"
                      value={`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`}
                      onCopy={() =>
                        copyToClipboard(
                          `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`,
                          "HSL"
                        )
                      }
                    />
                  </div>

                  {/* CMYK 值显示 */}
                  <div className="space-y-2">
                    <h3 className="font-medium">CMYK</h3>
                    <div className="flex flex-wrap gap-2">
                      <div className="w-[80px]">
                        <Label htmlFor="c-value">C (青)</Label>
                        <Input
                          id="c-value"
                          type="number"
                          min="0"
                          max="100"
                          value={cmykColor.c}
                          onChange={(e) =>
                            handleCmykChange("c", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                      <div className="w-[80px]">
                        <Label htmlFor="m-value">M (品红)</Label>
                        <Input
                          id="m-value"
                          type="number"
                          min="0"
                          max="100"
                          value={cmykColor.m}
                          onChange={(e) =>
                            handleCmykChange("m", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                      <div className="w-[80px]">
                        <Label htmlFor="y-value">Y (黄)</Label>
                        <Input
                          id="y-value"
                          type="number"
                          min="0"
                          max="100"
                          value={cmykColor.y}
                          onChange={(e) =>
                            handleCmykChange("y", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                      <div className="w-[80px]">
                        <Label htmlFor="k-value">K (黑)</Label>
                        <Input
                          id="k-value"
                          type="number"
                          min="0"
                          max="100"
                          value={cmykColor.k}
                          onChange={(e) =>
                            handleCmykChange("k", parseInt(e.target.value) || 0)
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                    </div>
                    <ColorValueDisplay
                      label="CMYK"
                      value={`cmyk(${cmykColor.c}%, ${cmykColor.m}%, ${cmykColor.y}%, ${cmykColor.k}%)`}
                      onCopy={() =>
                        copyToClipboard(
                          `cmyk(${cmykColor.c}%, ${cmykColor.m}%, ${cmykColor.y}%, ${cmykColor.k}%)`,
                          "CMYK"
                        )
                      }
                    />
                  </div>
                </div>

                {/* 右列 */}
                <div className="space-y-4">
                  {/* HSLA 值显示 */}
                  <div className="space-y-2">
                    <h3 className="font-medium">HSLA</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <Label htmlFor="hsl-a-value">A (透明度)</Label>
                        <Input
                          id="hsl-a-value"
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={rgbColor.a}
                          onChange={(e) =>
                            handleRgbChange(
                              "a",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                    </div>
                    <ColorValueDisplay
                      label="HSLA"
                      value={`hsla(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%, ${rgbColor.a})`}
                      onCopy={() =>
                        copyToClipboard(
                          `hsla(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%, ${rgbColor.a})`,
                          "HSLA"
                        )
                      }
                    />
                  </div>

                  {/* HSV/HSVA 值显示 */}
                  <div className="space-y-2">
                    <h3 className="font-medium">HSVA</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="hsv-h-value">H (色相)</Label>
                        <Input
                          id="hsv-h-value"
                          type="number"
                          min="0"
                          max="360"
                          value={hue}
                          onChange={(e) => {
                            const newHue = parseInt(e.target.value) || 0;
                            setHue(newHue);
                            const rgb = hsvToRgb(
                              newHue,
                              position.x * 100,
                              (1 - position.y) * 100
                            );
                            setRgbColor({ ...rgb, a: rgbColor.a });
                            setHexColor(
                              rgbToHex(rgb.r, rgb.g, rgb.b, rgbColor.a)
                            );
                            setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
                            setCmykColor(rgbToCmyk(rgb.r, rgb.g, rgb.b));
                          }}
                          className="font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hsv-s-value">S (饱和度)</Label>
                        <Input
                          id="hsv-s-value"
                          type="number"
                          min="0"
                          max="100"
                          value={Math.round(position.x * 100)}
                          onChange={(e) => {
                            const s = parseInt(e.target.value) || 0;
                            setPosition({ ...position, x: s / 100 });
                            const rgb = hsvToRgb(
                              hue,
                              s,
                              (1 - position.y) * 100
                            );
                            setRgbColor({ ...rgb, a: rgbColor.a });
                            setHexColor(
                              rgbToHex(rgb.r, rgb.g, rgb.b, rgbColor.a)
                            );
                            setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
                            setCmykColor(rgbToCmyk(rgb.r, rgb.g, rgb.b));
                          }}
                          className="font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hsv-v-value">V (明度)</Label>
                        <Input
                          id="hsv-v-value"
                          type="number"
                          min="0"
                          max="100"
                          value={Math.round((1 - position.y) * 100)}
                          onChange={(e) => {
                            const v = parseInt(e.target.value) || 0;
                            setPosition({ ...position, y: 1 - v / 100 });
                            const rgb = hsvToRgb(hue, position.x * 100, v);
                            setRgbColor({ ...rgb, a: rgbColor.a });
                            setHexColor(
                              rgbToHex(rgb.r, rgb.g, rgb.b, rgbColor.a)
                            );
                            setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
                            setCmykColor(rgbToCmyk(rgb.r, rgb.g, rgb.b));
                          }}
                          className="font-mono mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hsv-a-value">A (透明度)</Label>
                        <Input
                          id="hsv-a-value"
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={rgbColor.a}
                          onChange={(e) =>
                            handleRgbChange(
                              "a",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="font-mono mt-1"
                        />
                      </div>
                    </div>
                    <ColorValueDisplay
                      label="HSVA"
                      value={`hsva(${hue}, ${Math.round(
                        position.x * 100
                      )}%, ${Math.round((1 - position.y) * 100)}%, ${
                        rgbColor.a
                      })`}
                      onCopy={() =>
                        copyToClipboard(
                          `hsva(${hue}, ${Math.round(
                            position.x * 100
                          )}%, ${Math.round((1 - position.y) * 100)}%, ${
                            rgbColor.a
                          })`,
                          "HSVA"
                        )
                      }
                    />
                  </div>

                  {/* 右侧列的空间可以用于其他内容 */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 底部的颜色格式说明已移至顶部 */}
    </div>
  );
}
