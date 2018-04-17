// 获取元素的长、宽、位置
export function getRect(el) {
    // 判断 SVG
    if (el instanceof window.SVGElement) {
        let rect = el.getBoundingClientRect ();
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        }
    } else {
        return {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        }
    }
}
