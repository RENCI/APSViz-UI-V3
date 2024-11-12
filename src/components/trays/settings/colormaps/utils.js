export const maxSliderValues = {
    "maxele": { "metric": 10, "imperial": 30 },
    "maxwvel": { "metric": 100, "imperial": 200 },
    "swan":  { "metric": 30, "imperial": 100 }
};

export const sliderSteps = {
    "maxele": { "metric": 0.25, "imperial": 1 },
    "maxwvel": { "metric": 1, "imperial": 5 },
    "swan": { "metric": 0.5, "imperial": 5 }
};

export const sliderMarkSteps = {
    "maxele": { "metric": 1, "imperial": 5 },
    "maxwvel": { "metric": 10, "imperial": 20 },
    "swan": { "metric": 5, "imperial": 10 }
};

// find a float number in a colormap entry label and 
// return with designated decimal places.
export const getFloatNumberFromLabel = (label, decimalPlaces) => {
    let num = 0.0;
    const labelMatch = label.match(/[+-]?\d+(\.\d+)?/g);
    if (labelMatch)
        num = parseFloat(labelMatch).toFixed(decimalPlaces);

    return num;
};