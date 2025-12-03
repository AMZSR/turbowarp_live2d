# Architecture and Design

This document explains the technical architecture and design decisions behind the Live2D Effect extension.

## Overview

The Live2D Effect extension implements mesh-based image deformation using Canvas 2D API and bilinear interpolation. It provides a Scratch-like block interface for controlling image transformations.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    TurboWarp/Scratch VM                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Live2D Effect Extension                    │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                   Block Interface                     │ │
│  │  • Image Loading                                      │ │
│  │  • Vertex Control                                     │ │
│  │  • Preset Transformations                             │ │
│  │  • Drawing Commands                                   │ │
│  └───────────────┬───────────────────────────────────────┘ │
│                  │                                          │
│                  ▼                                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Transformation Engine                    │ │
│  │                                                        │ │
│  │  ┌──────────────┐    ┌──────────────┐               │ │
│  │  │  Vertex      │    │   Preset     │               │ │
│  │  │  Management  │◄───┤   Generator  │               │ │
│  │  └──────┬───────┘    └──────────────┘               │ │
│  │         │                                             │ │
│  │         ▼                                             │ │
│  │  ┌──────────────────────────────────┐               │ │
│  │  │   Mesh Subdivision Engine        │               │ │
│  │  │   • 10x10 Grid Division          │               │ │
│  │  │   • Bilinear Interpolation       │               │ │
│  │  └──────┬───────────────────────────┘               │ │
│  │         │                                             │ │
│  │         ▼                                             │ │
│  │  ┌──────────────────────────────────┐               │ │
│  │  │   Canvas Transformation          │               │ │
│  │  │   • Affine Transforms            │               │ │
│  │  │   • Cell-by-Cell Rendering       │               │ │
│  │  └──────┬───────────────────────────┘               │ │
│  └─────────┼──────────────────────────────────────────┘ │
│            │                                              │
└────────────┼──────────────────────────────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │   Canvas 2D API    │
    │   • Image Drawing  │
    │   • Transformations│
    └────────────────────┘
```

## Component Description

### 1. Block Interface Layer

**Responsibility**: Provides the Scratch-like block interface

**Components**:
- `getInfo()`: Defines block structure and metadata
- Block handlers: Methods that execute when blocks are used
- Menu definitions: Dropdown options for blocks

**Key Methods**:
- `loadImageFromCostume()`: Load image from Scratch sprite
- `loadImageFromURL()`: Load image from web URL
- `setVertexPosition()`: Set individual vertex coordinates
- `applyPreset()`: Apply preset transformations
- `drawTransformed()`: Render the transformed image

### 2. Transformation Engine

**Responsibility**: Manages vertex positions and transformation logic

**Components**:

#### Vertex Management
- Stores 4 vertex positions (top-left, top-right, bottom-left, bottom-right)
- Uses normalized 0-1 coordinate system internally
- Supports arbitrary coordinate values for creative effects

#### Preset Generator
- Implements 4 preset transformation types:
  - **Trapezoid**: Narrows top edge
  - **Perspective**: Creates 3D depth effect
  - **Wave**: Applies sinusoidal distortion
  - **Bulge**: Expands outward from center

#### Mesh Subdivision Engine
- Divides image into 10x10 grid (100 cells)
- Applies bilinear interpolation to each grid intersection
- Calculates intermediate vertex positions

**Algorithm**:
```javascript
// Bilinear interpolation formula
x = tl.x * (1-u) * (1-v) + 
    tr.x * u * (1-v) + 
    bl.x * (1-u) * v + 
    br.x * u * v

y = tl.y * (1-u) * (1-v) + 
    tr.y * u * (1-v) + 
    bl.y * (1-u) * v + 
    br.y * u * v

where:
  u, v = normalized position in grid (0-1)
  tl, tr, bl, br = top-left, top-right, bottom-left, bottom-right vertices
```

#### Canvas Transformation
- Converts each mesh cell into an affine transform
- Applies transform matrix to Canvas 2D context
- Renders source image segment with transformation

## Data Flow

### Image Loading Flow

```
User Block → loadImageFromCostume/URL
                    ↓
          Create Image Object
                    ↓
           Load Image Data
                    ↓
        Store in this.imageData
                    ↓
         Initialize Canvas
```

### Transformation Flow

```
User Sets Vertices/Preset
          ↓
    Update this.vertices
          ↓
    User Calls Draw
          ↓
   Loop Through 10x10 Grid
          ↓
   For Each Cell:
     1. Calculate source rectangle
     2. Interpolate destination quad
     3. Compute affine transform
     4. Draw image segment
          ↓
    Complete Transformed Image
```

### Preset Application Flow

```
User Selects Preset + Strength
          ↓
    Reset to Original Vertices
          ↓
    Apply Preset Algorithm
    (based on strength parameter)
          ↓
    Update this.vertices
          ↓
    Ready for Drawing
```

## Coordinate Systems

### Internal Coordinate System (Normalized)

The extension uses a normalized 0-1 coordinate system internally:

```
(0,0) ──────────► (1,0)
  │                 │
  │                 │
  │     Image       │
  │                 │
  │                 │
  ▼                 ▼
(0,1) ──────────► (1,1)
```

**Benefits**:
- Resolution-independent
- Easy scaling to any image size
- Simplified interpolation calculations

### User Coordinate System

Users can set vertex positions using any numeric values:
- Positive/negative numbers
- Values outside 0-1 range
- Fractional values

These are converted to pixel coordinates during rendering:
```javascript
pixelX = vertexX * imageWidth
pixelY = vertexY * imageHeight
```

## Transformation Mathematics

### Bilinear Interpolation

For any point (u, v) within the quad, the position is calculated using weighted averages of the four corners:

```
P(u,v) = P₀(1-u)(1-v) + P₁u(1-v) + P₂(1-u)v + P₃uv

where:
  P₀ = top-left vertex
  P₁ = top-right vertex
  P₂ = bottom-left vertex
  P₃ = bottom-right vertex
  u = horizontal parameter (0-1)
  v = vertical parameter (0-1)
```

### Affine Transform Matrix

For each mesh cell, we compute an affine transform:

```
│ a  c  e │   │ x │   │ x' │
│ b  d  f │ × │ y │ = │ y' │
│ 0  0  1 │   │ 1 │   │ 1  │

where:
  a, b = horizontal basis vector
  c, d = vertical basis vector
  e, f = translation vector
```

In code:
```javascript
ctx.transform(
  dx1/sw,  // a: horizontal scale/skew
  dy1/sw,  // b: vertical component of horizontal basis
  dx2/sh,  // c: horizontal component of vertical basis
  dy2/sh,  // d: vertical scale/skew
  tl.x,    // e: x translation
  tl.y     // f: y translation
);
```

## Performance Considerations

### Optimization Strategies

1. **Mesh Division**: 10x10 grid balances quality vs performance
   - Fewer divisions = faster but rougher
   - More divisions = slower but smoother

2. **Canvas Reuse**: Single canvas is reused for all transformations
   - Avoids creating/destroying canvas objects
   - Reduces memory allocation

3. **Lazy Evaluation**: Transformations only computed when drawing
   - Setting vertices is instant
   - Only draw calls trigger calculations

### Performance Characteristics

| Image Size | Mesh Grid | Transform Time | Recommended Use |
|-----------|-----------|----------------|-----------------|
| 100x100   | 10x10     | ~5ms          | Real-time animation |
| 200x200   | 10x10     | ~10ms         | Real-time animation |
| 500x500   | 10x10     | ~25ms         | Interactive use |
| 1000x1000 | 10x10     | ~50ms         | Static/occasional |

*Times are approximate and vary by browser/hardware*

## Memory Management

### Memory Usage

- **Canvas**: Width × Height × 4 bytes (RGBA)
- **Image Data**: Original image size
- **Vertex Data**: Negligible (4 points × 2 coordinates)

### Memory Optimization

1. Single canvas instance shared across all transformations
2. Image data stored as reference (not copied)
3. No intermediate buffers retained

## Error Handling

### Error Scenarios

1. **Image Load Failure**
   - Costume not found
   - URL inaccessible or CORS blocked
   - Invalid image format
   - **Handling**: Log error, return gracefully

2. **Invalid Vertex Positions**
   - Out of bounds values
   - NaN or undefined values
   - **Handling**: Clamp or ignore, don't crash

3. **Canvas Operations**
   - Transform matrix singularities
   - Drawing outside bounds
   - **Handling**: Try-catch blocks, silent failures

## Extension Points

### Adding New Presets

To add a new transformation preset:

1. Add preset name to `PRESET_TYPES` constant
2. Add menu item in `getInfo().menus.presetMenu`
3. Implement case in `applyPreset()` switch statement
4. Document in README and EXAMPLES

Example:
```javascript
case 'mypreset':
  const factor = strength * 0.5;
  this.vertices.topleft.x = factor;
  // ... calculate other vertices
  break;
```

### Adding New Blocks

To add a new block type:

1. Define block in `getInfo().blocks` array
2. Implement handler method in class
3. Add menu if needed in `getInfo().menus`
4. Update documentation

### Modifying Mesh Resolution

To change mesh quality:

```javascript
// In _drawMeshTransform method
const divisions = 10; // Change this value

// Higher = better quality, slower
// Lower = worse quality, faster
```

## Design Decisions

### Why Canvas 2D instead of WebGL?

**Reasons**:
1. **Simplicity**: Canvas 2D is simpler to implement and debug
2. **Compatibility**: Better browser support
3. **Sufficient Performance**: Adequate for typical use cases
4. **Easier Maintenance**: More developers understand Canvas 2D

**Future**: Could add WebGL renderer as performance option

### Why 10x10 Mesh Grid?

**Analysis**:
- 5×5: Too coarse, visible artifacts
- 10×10: Good balance (chosen)
- 20×20: Minimal visual improvement, 4× slower
- 50×50: Overkill for most cases, 25× slower

### Why Normalized Coordinates?

**Benefits**:
1. Resolution-independent
2. Easy to scale
3. Simplified math
4. Consistent behavior across images

**Tradeoff**: Extra conversion step, but worth it for flexibility

## Testing Strategy

### Manual Testing

1. **Image Loading**: Test various formats and sources
2. **Transformations**: Verify each preset at various strengths
3. **Vertex Control**: Test extreme values and edge cases
4. **Drawing**: Test at various positions and sizes
5. **Performance**: Test with different image sizes

### Browser Testing

Test on multiple browsers:
- Chrome/Chromium
- Firefox
- Safari
- TurboWarp Desktop

### Edge Cases

- Empty/missing costumes
- Very large images (1000×1000+)
- Very small images (10×10)
- Extreme vertex positions (negative, very large)
- Rapid consecutive transformations
- Zero-size dimensions

## Future Enhancements

### Potential Additions

1. **3D Transformations**: True perspective projection
2. **More Presets**: Rotation, spiral, pinch, swirl
3. **Animation Helpers**: Tween functions, easing
4. **Mesh Export**: Save/load vertex configurations
5. **WebGL Renderer**: For better performance
6. **Texture Mapping**: Apply textures to mesh
7. **Multi-point Control**: More than 4 vertices
8. **Bezier Curves**: Curved edge deformation

### API Extensions

Possible future blocks:
- `save vertex configuration`
- `load vertex configuration`
- `animate to preset over [n] seconds`
- `get transformation matrix`
- `apply custom matrix`

## References

### Technical Concepts

- **Bilinear Interpolation**: [Wikipedia](https://en.wikipedia.org/wiki/Bilinear_interpolation)
- **Affine Transformations**: [Wikipedia](https://en.wikipedia.org/wiki/Affine_transformation)
- **Canvas 2D API**: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

### Inspiration

- **Live2D**: Polygon deformation for 2D animation
- **Scratch**: Block-based programming interface
- **TurboWarp**: Enhanced Scratch runtime

## Conclusion

The Live2D Effect extension provides a powerful yet simple interface for image deformation in TurboWarp. By using mesh-based transformations and bilinear interpolation, it achieves smooth, high-quality results while maintaining good performance.

The architecture is designed to be:
- **Extensible**: Easy to add new features
- **Maintainable**: Clear separation of concerns
- **Performant**: Optimized for interactive use
- **User-Friendly**: Intuitive block interface

For questions or suggestions about the architecture, please open an issue on GitHub.
