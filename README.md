# Interactive Population Pyramid Visualization

![Population Pyramid Screenshot](https://via.placeholder.com/800x400?text=Population+Pyramid+Visualization)

An interactive web-based tool for visualizing population pyramids for countries around the world. This repository contains demographic data and a visualization tool built with Chart.js that shows age/sex distribution of populations.

## Features

- Interactive population pyramid charts for 86 countries
- Country selection dropdown for easy comparison
- Clean, responsive design suitable for embedding in ArcGIS StoryMaps
- URL parameter support for direct linking to specific countries
- Mobile-friendly interface

## Demo

Visit the [GitHub Pages demo](https://yourusername.github.io/population-pyramid/) to see the visualization in action.

## Data Structure

Each country's data is available in two formats:

### CSV Format
```
Age Group,Male,Female
0-4,5204065,5328812
5-9,4858715,4864356
...
```

### JSON Format
```json
{
  "country": "Country Name",
  "population": 109338285,
  "year": 2023,
  "data": [
    {
      "ageGroup": "0-4",
      "male": 5204065,
      "female": 5328812
    },
    ...
  ]
}
```

## Usage

### Basic Usage

Simply open `index.html` in a web browser to view the visualization. Select different countries from the dropdown menu to see their population pyramids.

### URL Parameters

The visualization supports the following URL parameters:

- `country`: The name of the country to display (e.g., `?country=United_States`)
- `year`: The year to display if multiple years are available (e.g., `?year=2023`)

Example: `index.html?country=Japan&year=2023`

### Embedding in ArcGIS StoryMaps

To embed this visualization in ArcGIS StoryMaps:

1. Host this repository on GitHub Pages or your own server
2. In ArcGIS StoryMaps, add a new "Embed" element
3. Use the following iframe code (adjust the URL to your hosted location):

```html
<iframe 
  src="https://yourusername.github.io/population-pyramid/?country=United_States" 
  width="100%" 
  height="500" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

4. For responsive sizing, wrap in a container div:

```html
<div style="position:relative; padding-top:75%; width:100%;">
  <iframe 
    src="https://yourusername.github.io/population-pyramid/?country=United_States" 
    style="position:absolute; top:0; left:0; width:100%; height:100%;" 
    frameborder="0" 
    allowfullscreen>
  </iframe>
</div>
```

## Development

### Directory Structure

- `data/`: Contains all the demographic data files
  - CSV and JSON files for each country
  - `country_list.json`: List of all available countries
- `css/`: Stylesheet for the visualization
- `js/`: JavaScript code for the visualization
- `index.html`: Main HTML file

### Python Script

The `download_population_data.py` script can be run to regenerate the data or update it with newer sources if they become available.

```bash
python3 download_population_data.py
```

## Data Sources

The data is derived from multiple sources:

1. World Bank population data
2. Demographic estimates based on known patterns of population distribution
3. Statistical modeling based on median age and fertility rates

## License

This project is available under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request