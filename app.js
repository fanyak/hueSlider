(() => {

    const component = document.querySelector('rgb-widget');
  
    // if <rgb-widget> hasn't been added to the HTML, then we don't know where to display the widget -> we abort
    if (!component) {
      return;
    }
    // list of eventListeners
    const listeners = [];
  
    function name_this_colour(Hue, Saturation, Lightness) {
      const min = (dict, prop) => [...Array.from(dict.keys())].sort((a, b) => Math.abs(a - prop) - Math.abs(b - prop));
  
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
      const [Hue_for_dict] = min(hues_dict, Hue);
      const Hue_name = hues_dict.get(Hue_for_dict);
  
      const Saturation_dict = new Map([[0.10, 'grayish'], [0.30, 'desaturated'], [0.50, 'muted'], [0.70, 'saturated'], [0.90, 'vivid']]);
      const [Saturation_for_dict] = min(Saturation_dict, Saturation);
      const Saturation_name = Saturation_dict.get(Saturation_for_dict);
  
      const Lightness_dict = new Map([[0.10, 'and very dark'], [0.30, 'dark'], [0.50, ''], [0.70001, 'light'], [0.90001, 'and very light']]);
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
        } else if (Lightness == 0) {
          Colour_name = 'black';
        } else if (Lightness == 1) {
          Colour_name = 'white';
        }
      } else {
        Colour_name = `${Saturation_name} ${Lightness_name} ${Hue_name}`;
      }
  
      return Colour_name;
    }
    
    /**
     * Display the selected hum inside the rectangle assinged to the function
     * @param {num} Red 
     * @param {num} Green 
     * @param {num} Blue 
     * @param {Function} fn 
     */
    const show_color = (fn, Red, Green, Blue) =>
      document.querySelector(`.${fn.name}_showColor`).style.background = `rgb(${Red},${Green},${Blue})`;
  
    /** 
    * Round float to 2 decimals
    * @param {float} num
    * returns rounded number in string type to display text
    */
    const twof = (num) => num.toFixed(2);
  
    /**
     * Diplay the formulated text
     * @param {Function} fn 
     * @param {integer} n 
     * @param {string} text 
     */
    const display_text = (fn, n, text) => {
      const el = document.querySelector(`#${fn.name}_text_${n}`);
      el.textContent = text;
    };
  
    function from_RGB(Red, Green, Blue) {
      const rgb_255 = [Red, Green, Blue];
  
      const rgb_percent = rgb_255.map(el => el / 255);
      const diff = Math.max(...rgb_percent) - Math.min(...rgb_percent);
      const red_pc = rgb_percent[0];
      const green_pc = rgb_percent[1];
      const blue_pc = rgb_percent[2];
      let Hue;
  
      // calculate chromaticness, whiteness and blackness
      const Chromaticness = Math.max(...rgb_percent) - Math.min(...rgb_percent);
      const Whiteness = Math.max(...rgb_percent) - Chromaticness;
      const Blackness = 1 - Chromaticness - Whiteness;
  
      const rgb_header_1_text = `Chromaticness: ${twof(Chromaticness * 100)}%, Whiteness: ${twof(Whiteness * 100)}%, Blackness: ${twof(Blackness * 100)}%`;
      display_text(from_RGB, 1, rgb_header_1_text);
  
      // calculate Hue, Saturation and Lightness
      if (Math.max(...rgb_percent) == Math.min(...rgb_percent)) {
        Hue = 0;
      } else if (Math.max(...rgb_percent) == red_pc) {
        Hue = (60 * ((green_pc - blue_pc) / diff) + 360) % 360;
      } else if (Math.max(...rgb_percent) == green_pc) {
        Hue = (60 * ((blue_pc - red_pc) / diff) + 120) % 360;
      } else if (Math.max(...rgb_percent) == blue_pc) {
        Hue = (60 * ((red_pc - green_pc) / diff) + 240) % 360;
      }
  
      const Lightness = Whiteness + Chromaticness / 2;
      const Saturation = Chromaticness;
  
      const rgb_header_2_text = `Hue: ${twof(Hue)}, Saturation: ${twof(Saturation * 100)}%, Lightness: ${twof(Lightness * 100)}%`;
      display_text(from_RGB, 2, rgb_header_2_text);
  
      show_color(from_RGB, Red, Green, Blue);
  
      // Name the colour
      const rgb_header_3_text = `This colour is named: ${name_this_colour(Hue, Saturation, Lightness)}`;
      display_text(from_RGB, 3, rgb_header_3_text);
  
      return null;
    }
  
    // from_RGB(59, 179, 159);
  
    // this function gives the RGB values for 'pure colours'. it is a helper function that's used in the chsl2rgb function
    function pure_hue(hue) {
      hue = hue > 0 ? hue % 1.0 : (1 + hue);
      if (hue < 1 / 6) {
        return hue * 6.0;
      }
      if (hue < 0.5) {
        return 1;
      }
      if (hue < 2 / 3) {
        return (2 / 3 - hue) * 6.0;
      }
      return 0;
    }  
  
    // define widgets with constraints for the following interaction
    const saturation_widget = create_slider(to_RGB, 'saturation', [0, 1, 0.01]);
    const lightness_widget = create_slider(to_RGB, 'lightness', [0, 1, 0.01]);
  
    function update_lightness_range(target) {
      const min = 0.5 * Number(target.value);
      const max = 1 - 0.5 * Number(target.value);
      const current = lightness_widget.getAttribute('value');
      lightness_widget.setAttribute('min', min);
      lightness_widget.setAttribute('max', max);
      const update = () => {
        if (current > max) {
          lightness_widget.setAttribute('value', max);
        } else if (current < min) {
          lightness_widget.setAttribute('value', min);
        } else {
          lightness_widget.setAttribute('value', current);
        }
      };
      window.requestAnimationFrame(update);
      display_slider_values(to_RGB);
    }
  
  
    function to_RGB(Hue, Saturation, Lightness) {
      const [r, g, b] = [pure_hue(Hue / 360 + 1 / 3) * 255, pure_hue(Hue / 360) * 255, pure_hue(Hue / 360 - 1 / 3) * 255];
  
      const Chromaticness = Saturation;
      const Whiteness = Lightness - (Saturation / 2);
      const Blackness = 1 - Whiteness - Chromaticness;
  
      const rgb_header_1_text = `Chromaticness: ${twof(Chromaticness * 100)}%, Whiteness: ${twof(Whiteness * 100)}%, Blackness: ${twof(Blackness * 100)}%`;
      display_text(to_RGB, 1, rgb_header_1_text);
  
      const Red = Math.floor(r * Saturation + Whiteness * 255);
      const Green = Math.floor(g * Saturation + Whiteness * 255);
      const Blue = Math.floor(b * Saturation + Whiteness * 255);
  
      const rgb_header_2_text = `RGB values: Red: ${Red}, Green: ${Green}, Blue: ${Blue}`;
      display_text(to_RGB, 2, rgb_header_2_text);
  
      show_color(to_RGB, Red, Green, Blue);
  
      // Name the colour
      const rgb_header_3_text = `This colour is named: ${name_this_colour(Hue, Saturation, Lightness)}`;
      display_text(to_RGB, 3, rgb_header_3_text);
  
      return null;
    }
    /**
     * get the current values of the sliders that interact with a function and display then
     * @param {Function} fn is the Function that the sliders interact with     
     */
    function display_slider_values(fn, target) {
      if (target && target == saturation_widget) {
        update_lightness_range(target);
        return;
      }
      const sliderNodes = document.querySelectorAll(`input[id^="${fn.name}_widget_"]`);
      const sliderList = Array.from(sliderNodes);
      const values = sliderList.map((slider) => Number(slider.value));
  
      if (target) {
        const span = document.querySelector(`.${target.id}_value`);
        span.textContent = twof(Number(target.value));
      } else {
        sliderList.forEach((slider) => {
          const span = document.querySelector(`.${slider.id}_value`);
          span.textContent = twof(Number(slider.value));
        });
      }
  
      fn(...values);
    }
  
    /**
     * Create a slider Widget
     * @param {Function} fn which function we are interacting with (i.e from_rgb or to_rgb)
     * @param {Object} widget_params The keys are the properties of the slider (hue, red, green, saturation etc)
     * the value of a widget_param[key] is an already crated slider or [min,max,step]
     */
    function interact(fn, widget_params) {
  
      const slider_holder = document.createElement('DIV');
  
      Object.keys(widget_params).forEach(key => {
        let slider;
        // if the value of the key is an already created slider element
        if (widget_params[key] instanceof HTMLElement) {
          slider = widget_params[key];
        } else if (Array.isArray(widget_params[key])) { // if  the value of the key is a list [min,max,step]
          slider = create_slider(fn, key, widget_params[key]);
        } else {
          // add new type in the future
        }
  
        //@TODO remove EventListeners when we remove the component
        // add the EventListeners 
        const input_observer = (evt) => {
          evt.stopPropagation();
          display_slider_values(fn, evt.target);
        };
  
        slider.addEventListener('input', input_observer, true);
        listeners.push([slider, input_observer, 'input']);
  
        const value_holder = document.createElement('DIV');
        const label = create_slider_label(key);
        const value_box = document.createElement('SPAN');
        value_box.classList.add(`${fn.name}_widget_${key.toLowerCase()}_value`);
        label.appendChild(slider);
        value_holder.appendChild(label);
        value_holder.appendChild(value_box);
        slider_holder.appendChild(value_holder);
      });
  
      const details = create_slider_details(fn.name);
      slider_holder.appendChild(details);
      component.appendChild(slider_holder);
      display_slider_values(fn);
    }
  
  
    // Make the interactions
    interact(to_RGB, { Hue: [0, 360, 1], Saturation: saturation_widget, Lightness: lightness_widget });
    interact(from_RGB, { Red: [0, 255, 1], Green: [0, 255, 1], Blue: [0, 255, 1] });
  
  
  
    // ************************ FUNCTIONS TO DISPLAY THE WIDGET INSIDE THE WEB PAGE ************************ //
  
    set_styles();
  
    /**
     * Create a slider inside the page
     * @param {Funtion} fn  which function the slide is for
     * @param {string} key  what property is the slider dipslayng
     * @param {list[min,max,step]} param2 Default range is 0 to 100 if we don't pass the list
     * @returns 
     */
  
    function create_slider(fn, key, [min, max, step]) {
      // create the slider;
      const slider = document.createElement('INPUT');
      slider.setAttribute('type', 'range');
      if (min != undefined) {
        slider.setAttribute('min', min);
      }
      if (max != undefined) {
        slider.setAttribute('max', max);
        slider.setAttribute('value', Math.floor(max / 2));
      }
      if (step != undefined) {
        slider.setAttribute('step', step);
      }
      slider.setAttribute('id', `${fn.name}_widget_${key.toLowerCase()}`);
      return slider;
    }
    /**
     * Create the label (name to display in the page for the slider)
     * @param {string} key 
     * @returns 
     */
    function create_slider_label(key) {
      // create the label with a capitalized 1st letter
      const capitalize = (s) => s[0].toUpperCase() + s.slice(1);
      const label = document.createElement('LABEL');
      const label_text = document.createTextNode(capitalize(key));
      label.appendChild(label_text);
      return label;
    }
  
    /**
     * Create the elements to display the details of sliders inside the page
     * @param {string} name the name of the function that the elements belong to
     * @returns 
     */
  
    function create_slider_details(name) {
      const details_holder = document.createElement('DIV');
      details_holder.setAttribute('id', `${name}_details`);
  
      const title1 = document.createElement('DIV');
      title1.setAttribute('id', `${name}_text_1`);
      const title2 = document.createElement('DIV');
      title2.setAttribute('id', `${name}_text_2`);
      const showColor = document.createElement('DIV');
      showColor.setAttribute('class', `${name}_showColor`);
      const title3 = document.createElement('DIV');
      title3.setAttribute('id', `${name}_text_3`);
  
      details_holder.appendChild(title1);
      details_holder.appendChild(title2);
      details_holder.appendChild(showColor);
      details_holder.appendChild(title3);
      return details_holder;
    }
  
    /**
     * set the style of the elements we have added to the web page
     */
    function set_styles() {
  
      // Parameters to display the elements in the web page - these can be changes
      const widget_width = '680px';
      const widget_max_width = '100%';
      const show_color_width = '100%';
      const show_color_height = '100px';
  
      component.style.display = 'block';
      component.style.width = `${widget_width}`;
      component.style.maxWidth = `${widget_max_width}`;
      component.style.fontFamily = 'inherit';
      const widgets = document.querySelectorAll('rgb-widget > div');
      Array.from(widgets).forEach(widget => {
        widget.style.marginTop = '20px';
        widget.style.paddingBottom = '5px';
        widget.style.borderBottom = 'solid 1px #ccc';
      });
      const labels = document.querySelectorAll('rgb-widget > div label');
      Array.from(labels).forEach(label => {
        label.style.display = 'inline-flex';
        label.style.width = '230px';
        label.style.justifyContent = 'space-between';
        label.style.marginRight = '20px';
      });
      const inputs = document.querySelectorAll('rgb-widget > div input[type="range"]');
      Array.from(inputs).forEach(input => {
        input.style.width = '130px';
        input.style.outlineWidth = '0';
      });
      const spans = document.querySelectorAll('rgb-widget > div label+span');
      Array.from(spans).forEach(span => {
        span.style.display = 'inline-block';
        span.style.boxSixing = 'border-box';
        span.style.verticalAlign = 'text-bottom';
      });
      const details = document.querySelectorAll('rgb-widget div[id*="_RGB_details"]');
      Array.from(details).forEach(detail => {
        detail.style.marginTop = '10px';
      });
      const titles = document.querySelectorAll('rgb-widget div[id*="RGB_text_"]');
      Array.from(titles).forEach(title => {
        title.style.lineHeight = '1.125';
        title.style.fontSize = '1em';
        title.style.color = 'rgba(0,0,0,.7)';
        if(window.screen.width < 700) {
            title.style.minHeight = '50px';
        }
      });
      const colorDivs = document.querySelectorAll('rgb-widget div[class*="_RGB_showColor"]');
      Array.from(colorDivs).forEach(colorDiv => {
        colorDiv.style.width = `${show_color_width}`;
        colorDiv.style.height = `${show_color_height}`;
        colorDiv.style.margin = '10px 0 10px 0';
      });
  
    }
  
    /**
     * Remove all eventListeners when we leave the web page
     */
    document.addEventListener('beforeunload', function logData() {
      listeners.forEach(([el, fn, ac]) => el.removeEventListener(`${ac}`, fn, true));
    });
  
  })();
  