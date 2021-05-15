function name_this_colour(Hue, Saturation, Lightness) {

    // hue name
    const hues_dict = new Map([
        [0, 'red'],
        [15, 'red-orange'],
        [30, 'orange'],
        [45, 'orange-yellow'],
        [60, 'yellow'],
        [75, 'yellow-chartreuse'],
        [90, 'chartreuse'],
        [105, 'chatreuse-green'],
        [120, 'green'],
        [135, 'green-jade'],
        [150, 'jade'],
        [165, 'jade-cyan'],
        [180, 'cyan'],
        [195, 'cyan-azure'],
        [210, 'azure'],
        [225, 'azure-blue'],
        [240, 'blue'],
        [255, 'blue-violet'],
        [270, 'violet'],
        [285, 'violet-magenta'],
        [300, 'magenta'],
        [315, 'magenta-rose'],
        [330, 'rose'],
        [345, 'rose-red'],
        [360, 'red']
    ]);

    // define a min operation
    const min = (dict, prop) =>  [...Array.from(dict.keys())].sort((a,b) => Math.abs(a-prop) - Math.abs(b-prop));

    const [Hue_for_dict] =  min(hues_dict, Hue);
    const Hue_name = hues_dict.get(Hue_for_dict);

    const Saturation_dict = new Map([[0.10,'grayish'], [0.30,'desaturated'], [0.50,'muted'], [0.70,'saturated'], [0.90, 'vivid']]);
    const [Saturation_for_dict] = min(Saturation_dict, Saturation);
    const Saturation_name = Saturation_dict.get(Saturation_for_dict);

    const Lightness_dict = new Map([[0.10,'and very dark'], [0.30, 'dark'], [0.50, ''], [0.70001, 'light'], [0.90001, 'and very light']]);
    const [Lightness_for_dict] = min(Lightness_dict, Lightness);
    const Lightness_name = Lightness_dict.get(Lightness_for_dict);

    let Colour_name = '';

    if (Saturation == 0) {
        if (Lightness != 0 && Lightness != 1) {
            if (Lightness <= 0.20) {
                Colour_name = 'very dark gray';
            } else if (Lightness > 0.20 && Lightness <= 0.40) {
                Colour_name = 'dark gray';
            } else if (Lightness > 0.60 && Lightness <= 0.80) {
                Colour_name = 'light gray';
            } else if (Lightness > 0.80 && Lightness <= 1.00) { 
                Colour_name = 'very light gray';
            } else {
                Colour_name = 'medium gray';
            }
        } else if  (Lightness == 0) {
            Colour_name = 'black';
        } else if (Lightness == 1) {
            Colour_name = 'white';
        }         
    } else {
        Colour_name = `${Saturation_name} ${Lightness_name} ${Hue_name}`; // "%s %s %s" %(Saturation_name, Lightness_name, Hue_name)
    }
    return Colour_name;
}
console.log(name_this_colour(2557, 1, 100));



