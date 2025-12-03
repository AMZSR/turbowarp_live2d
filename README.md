# Live2D Effect Extension for TurboWarp

A TurboWarp extension that provides Live2D-style image transformation and deformation effects using mesh-based transformations and quadrilateral mapping.

> 📚 **Documentation**: [Quick Start](QUICKSTART.md) | [Examples](EXAMPLES.md) | [Contributing](CONTRIBUTING.md) | [Architecture](ARCHITECTURE.md) | [日本語](README.ja.md)

## Features

### 🎨 Image Transformation Capabilities

- **Quadrilateral Mesh Deformation**: Transform rectangular images into arbitrary quadrilaterals by controlling 4 corner vertices
- **Preset Transformations**: Quick-apply common effects like trapezoid, perspective, wave, and bulge
- **Flexible Image Loading**: Load images from Scratch costumes or external URLs
- **Precise Vertex Control**: Set each corner's X and Y position individually
- **Smooth Interpolation**: Uses bilinear interpolation and mesh subdivision for smooth transformations

### 📦 Block Categories

#### Image Loading
- `load image from costume [costume]` - Load image from a Scratch costume
- `load image from URL [url]` - Load image from an external URL

#### Vertex Control
- `set vertex [vertex] to x: [x] y: [y]` - Set individual vertex positions
- `vertex [vertex] x` - Get X coordinate of a vertex
- `vertex [vertex] y` - Get Y coordinate of a vertex

Vertices:
- Top Left
- Top Right
- Bottom Left
- Bottom Right

#### Transformation Presets
- `apply [preset] transform strength: [strength]%` - Apply preset transformations

Available Presets:
- **Trapezoid**: Narrows the top edge to create a trapezoidal shape
- **Perspective**: Creates a 3D perspective effect
- **Wave**: Applies a sinusoidal wave distortion
- **Bulge**: Bulges the image outward from the center

#### Drawing
- `draw transformed image at x: [x] y: [y]` - Prepare transformed image for drawing (see note below)
- `draw transformed image at x: [x] y: [y] width: [width] height: [height]` - Prepare with custom size
- `transformed image data URL` - Get the transformed image as a data URL for use with other extensions

**Note**: Due to TurboWarp's rendering architecture, the draw blocks prepare the transformation but don't directly display on stage. Use the `transformed image data URL` block to get the image data, which can then be used with other extensions or downloaded as a costume.

#### Utilities
- `reset all transformations` - Reset all vertices to their original positions
- `image width` - Get the loaded image width
- `image height` - Get the loaded image height

## Usage Examples

### Basic Trapezoid Effect

```scratch
when green flag clicked
load image from costume [character-1]
apply [trapezoid] transform strength: (50)%
draw transformed image at x: (0) y: (0)
```

### Custom Vertex Animation

```scratch
when green flag clicked
load image from costume [character-1]
forever
  set vertex [Top Right] to x: (100) y: (pick random (-20) to (20))
  set vertex [Bottom Right] to x: (100) y: (100 + pick random (-20) to (20)))
  draw transformed image at x: (0) y: (0)
  wait (0.1) seconds
end
```

### Creating a Waving Flag Effect

```scratch
when green flag clicked
load image from costume [flag]
forever
  change [time v] by (0.1)
  set vertex [Top Right] to x: (100) y: ((sin of (time)) * 10)
  set vertex [Bottom Right] to x: (100) y: (100 + (sin of (time + 90)) * 10)
  draw transformed image at x: (0) y: (0)
end
```

### Perspective Transformation

```scratch
when green flag clicked
load image from costume [background]
apply [perspective] transform strength: (75)%
draw transformed image at x: (0) y: (0) width: (480) height: (360)
```

## Technical Details

### Coordinate System

The extension uses a normalized coordinate system (0-1) for vertex positions internally, which is then scaled to the actual image dimensions during rendering.

- `(0, 0)` = Top-left corner
- `(1, 0)` = Top-right corner
- `(0, 1)` = Bottom-left corner
- `(1, 1)` = Bottom-right corner

However, when setting vertex positions, you can use any coordinate values, including negative numbers or values greater than the image dimensions for creative effects.

### Mesh Transformation Algorithm

The extension divides the image into a 10x10 grid and applies bilinear interpolation to each cell. This provides smooth deformations while maintaining good performance.

The transformation process:
1. Image is divided into a mesh grid
2. Each grid cell is transformed independently
3. Bilinear interpolation calculates intermediate positions
4. Canvas 2D transform API applies the deformation
5. Result is composited to the stage

### Performance Considerations

- **Mesh Division**: The extension uses a 10x10 mesh grid by default, balancing quality and performance
- **Image Size**: Larger images may take longer to transform
- **Frequent Updates**: For animations, consider reducing the update frequency if performance is an issue

## Installation

### Option 1: Load from URL (Recommended for Development)

1. Open TurboWarp
2. Go to Extensions (folder icon in bottom-left)
3. Choose "Custom Extension"
4. Enter the URL to `live2d-effect.js`
5. Click "Load"

### Option 2: Local Development

1. Clone this repository
2. Serve the extension file using a local web server
3. Load it as a custom extension in TurboWarp using `http://localhost:port/extensions/live2d-effect.js`

## Browser Compatibility

This extension requires:
- Canvas 2D API support
- ES6+ JavaScript features
- Cross-origin resource sharing (CORS) support for loading external images

Tested on:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- TurboWarp Desktop

## Examples and Use Cases

### Game Development
- Create character expressions by tilting/deforming facial features
- Add dynamic backgrounds with perspective effects
- Implement screen shake or wobble effects

### Visual Art
- Create abstract art with mesh deformations
- Animate geometric patterns
- Design dynamic UI elements

### Educational Projects
- Demonstrate geometric transformations
- Teach about perspective and 3D projection
- Explore interpolation and mesh concepts

## Limitations

- The extension requires unsandboxed mode to function properly
- External images must be served with appropriate CORS headers
- Very large images may impact performance
- The transformation is 2D only (no true 3D rotation)
- **Direct stage rendering**: The draw blocks prepare transformations but don't directly display on the stage due to TurboWarp's rendering architecture. Use the `transformed image data URL` block to retrieve the transformed image, which can then be used with other extensions or saved as a costume

## Advanced Usage

### Creating Custom Presets

While the extension provides built-in presets, you can create custom effects by manually setting all four vertices:

```scratch
when green flag clicked
load image from costume [sprite]
// Create a diamond shape
set vertex [Top Left] to x: (50) y: (0)
set vertex [Top Right] to x: (100) y: (50)
set vertex [Bottom Right] to x: (50) y: (100)
set vertex [Bottom Left] to x: (0) y: (50)
draw transformed image at x: (0) y: (0)
```

### Animating Between States

Store vertex positions in variables and interpolate between them for smooth transitions:

```scratch
when green flag clicked
load image from costume [character]
set [startX v] to (0)
set [targetX v] to (20)
repeat (20)
  set [progress v] to ((i) / (20))
  set [currentX v] to ((startX) + (((targetX) - (startX)) * (progress)))
  set vertex [Top Right] to x: (currentX) y: (0)
  draw transformed image at x: (0) y: (0)
end
```

## Troubleshooting

### Image Not Loading
- Ensure the costume name is correct (case-sensitive)
- For URLs, check that CORS headers are properly configured
- Verify the image format is supported (PNG, JPEG)

### Transformation Not Visible
- Make sure you've loaded an image first
- Check that vertex positions create a valid quadrilateral
- Verify the draw command is being called after setting vertices

### Performance Issues
- Reduce image size
- Lower the frequency of updates
- Use simpler transformations

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This extension is provided as-is for use with TurboWarp.

## Credits

- Inspired by Live2D's polygon deformation technology
- Built for the TurboWarp community
- Created by AMZSR

## Version History

### Version 1.0.0
- Initial release
- Basic quadrilateral transformation
- Four preset effects (trapezoid, perspective, wave, bulge)
- Costume and URL image loading
- Mesh-based interpolation system
- Vertex position control and reporting
