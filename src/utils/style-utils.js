import SldStyleParser from 'geostyler-sld-parser';

export const getDataRange = (style) => {
    const dataRange = [];
    const colormapEntries = style.rules[0].symbolizers[0].colorMap.colorMapEntries;
    for(let i = colormapEntries.length-1; i >= 0; i--) {
        dataRange.push(colormapEntries[i].quantity);
    }

    return(dataRange.reverse());
};

export const scaleNumber = (unscaled, to_min, to_max, from_min, from_max) => {
    const scaled_num =
      ((to_max - to_min) * (unscaled - from_min)) / (from_max - from_min) +
      to_min;
    return scaled_num.toFixed(2);
  };

export const scaleRange = (l, minimum, maximum) => {
    const new_l = [];
    const to_min = parseFloat(minimum);
    const to_max = parseFloat(maximum);
    for (let i = 0; i < l.length; i++) {
        const num = scaleNumber(
        l[i],
        to_min,
        to_max,
        Math.min(...l).toFixed(2),
        Math.max(...l).toFixed(2)
        );
        new_l.push(num);
    }
    return new_l;
};

export const getUpdatedStyleColorMapQuantities = (style, range) => {

    const colormapEntries = [...style.rules[0].symbolizers[0].colorMap.colorMapEntries];
    colormapEntries.forEach((entry, idx) => {
        if (idx <= range.length) {
            entry.quantity = range[idx];
            if (style.name.includes("maxwvel")) {
                entry.label = range[idx] + " m/s";
            }
            else {
                entry.label = range[idx] + " m";
            }
        }
    });
    style.rules[0].symbolizers[0].colorMap.colorMapEntries=[...colormapEntries];

    return(style);
};