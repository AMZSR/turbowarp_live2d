# Live2D Effect Extension - Usage Examples

This document provides detailed examples of how to use the Live2D Effect extension in your TurboWarp projects.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Examples](#basic-examples)
3. [Animation Examples](#animation-examples)
4. [Advanced Techniques](#advanced-techniques)
5. [Creative Projects](#creative-projects)

## Getting Started

Before using any transformation effects, you must first load an image:

### Loading from a Costume

```scratch
when green flag clicked
load image from costume [sprite1-a]
```

### Loading from URL

```scratch
when green flag clicked
load image from URL [https://example.com/image.png]
```

## Basic Examples

### Example 1: Simple Trapezoid

Create a trapezoid shape by narrowing the top of the image.

```scratch
when green flag clicked
load image from costume [character-1]
apply [trapezoid] transform strength: (50)%
draw transformed image at x: (0) y: (0)
```

**Result**: The image will appear as a trapezoid with the top edge narrowed.

### Example 2: Perspective View

Apply a perspective transformation to create a 3D effect.

```scratch
when green flag clicked
load image from costume [background]
apply [perspective] transform strength: (70)%
draw transformed image at x: (0) y: (0)
```

**Result**: The image appears to be viewed from an angle, like a wall receding into the distance.

### Example 3: Wave Distortion

Apply a wave effect to make the image appear wavy.

```scratch
when green flag clicked
load image from costume [flag]
apply [wave] transform strength: (40)%
draw transformed image at x: (0) y: (0)
```

**Result**: The left and right edges of the image will be distorted in a wave pattern.

### Example 4: Bulge Effect

Make the image bulge outward from all sides.

```scratch
when green flag clicked
load image from costume [ball]
apply [bulge] transform strength: (60)%
draw transformed image at x: (0) y: (0)
```

**Result**: The image appears to bulge outward, creating a balloon-like effect.

## Animation Examples

### Example 5: Waving Flag Animation

Create a realistic flag waving in the wind.

```scratch
when green flag clicked
load image from costume [flag]
set [time v] to (0)
forever
  change [time v] by (5)
  set [wave1 v] to ((sin of (time)) * 15)
  set [wave2 v] to ((sin of ((time) + (90))) * 15)
  set vertex [Top Right] to x: (100) y: (wave1)
  set vertex [Bottom Right] to x: (100) y: ((100) + (wave2))
  draw transformed image at x: (0) y: (0)
end
```

**Result**: The flag will wave smoothly back and forth.

### Example 6: Pulsating Effect

Make an image pulse by applying a rhythmic bulge effect.

```scratch
when green flag clicked
load image from costume [heart]
forever
  repeat (10)
    set [strength v] to (((i) * (10)))
    apply [bulge] transform strength: (strength)%
    draw transformed image at x: (0) y: (0)
    wait (0.05) seconds
  end
  repeat (10)
    set [strength v] to ((100) - ((i) * (10)))
    apply [bulge] transform strength: (strength)%
    draw transformed image at x: (0) y: (0)
    wait (0.05) seconds
  end
end
```

**Result**: The heart will pulse in and out continuously.

### Example 7: Rotating Trapezoid

Cycle through different trapezoid strengths.

```scratch
when green flag clicked
load image from costume [character-1]
set [direction v] to (1)
set [strength v] to (0)
forever
  change [strength v] by ((direction) * (2))
  if <(strength) > (100)> then
    set [direction v] to (-1)
  end
  if <(strength) < (0)> then
    set [direction v] to (1)
  end
  apply [trapezoid] transform strength: (strength)%
  draw transformed image at x: (0) y: (0)
  wait (0.03) seconds
end
```

**Result**: The trapezoid effect will smoothly increase and decrease.

### Example 8: Character Head Tilt

Simulate character head tilting by manipulating vertices.

```scratch
when green flag clicked
load image from costume [character-face]
set [angle v] to (0)
forever
  change [angle v] by (2)
  set [tiltX v] to ((sin of (angle)) * 10)
  set [tiltY v] to ((cos of (angle)) * 5)
  set vertex [Top Right] to x: ((100) + (tiltX)) y: (tiltY)
  set vertex [Top Left] to x: ((0) - (tiltX)) y: (tiltY)
  draw transformed image at x: (0) y: (0)
  wait (0.05) seconds
end
```

**Result**: The character's face will tilt back and forth smoothly.

## Advanced Techniques

### Example 9: Interactive Mouse Control

Control the transformation with the mouse position.

```scratch
when green flag clicked
load image from costume [sprite]
forever
  set [mouseXNorm v] to (((mouse x) + (240)) / (480))
  set [mouseYNorm v] to (((mouse y) + (180)) / (360))
  set [strength v] to ((mouseXNorm) * (100))
  apply [perspective] transform strength: (strength)%
  draw transformed image at x: (0) y: (0)
end
```

**Result**: The perspective effect will change based on mouse X position.

### Example 10: Manual Diamond Shape

Create a diamond shape by setting all four vertices manually.

```scratch
when green flag clicked
load image from costume [gem]
set [size v] to (100)
set [halfSize v] to ((size) / (2))
set vertex [Top Left] to x: (halfSize) y: (0)
set vertex [Top Right] to x: (size) y: (halfSize)
set vertex [Bottom Right] to x: (halfSize) y: (size)
set vertex [Bottom Left] to x: (0) y: (halfSize)
draw transformed image at x: (0) y: (0)
```

**Result**: The image is transformed into a diamond shape.

### Example 11: Screen Shake Effect

Create a screen shake by randomly offsetting vertices.

```scratch
when green flag clicked
load image from costume [screen]
repeat (20)
  set vertex [Top Left] to x: (pick random (-5) to (5)) y: (pick random (-5) to (5))
  set vertex [Top Right] to x: ((100) + (pick random (-5) to (5))) y: (pick random (-5) to (5))
  set vertex [Bottom Left] to x: (pick random (-5) to (5)) y: ((100) + (pick random (-5) to (5)))
  set vertex [Bottom Right] to x: ((100) + (pick random (-5) to (5))) y: ((100) + (pick random (-5) to (5)))
  draw transformed image at x: (0) y: (0)
  wait (0.03) seconds
end
reset all transformations
draw transformed image at x: (0) y: (0)
```

**Result**: The image will shake rapidly for a moment, then return to normal.

### Example 12: Smooth Transition Between States

Animate smoothly from one transformation to another.

```scratch
when green flag clicked
load image from costume [sprite]

// Store initial state
set [startTL_X v] to (0)
set [startTL_Y v] to (0)
set [startTR_X v] to (100)
set [startTR_Y v] to (0)

// Apply target transformation
apply [perspective] transform strength: (75)%

// Store target state
set [endTL_X v] to (vertex [Top Left] x)
set [endTL_Y v] to (vertex [Top Left] y)
set [endTR_X v] to (vertex [Top Right] x)
set [endTR_Y v] to (vertex [Top Right] y)

// Reset and animate
reset all transformations

repeat (30)
  set [progress v] to ((i) / (30))
  
  set [currentTL_X v] to ((startTL_X) + (((endTL_X) - (startTL_X)) * (progress)))
  set [currentTL_Y v] to ((startTL_Y) + (((endTL_Y) - (startTL_Y)) * (progress)))
  
  set vertex [Top Left] to x: (currentTL_X) y: (currentTL_Y)
  set vertex [Top Right] to x: ((startTR_X) + (((endTR_X) - (startTR_X)) * (progress))) y: ((startTR_Y) + (((endTR_Y) - (startTR_Y)) * (progress)))
  
  draw transformed image at x: (0) y: (0)
  wait (0.03) seconds
end
```

**Result**: The image smoothly transitions from normal to perspective view.

## Creative Projects

### Example 13: Rain Puddle Reflection

Create a reflection effect that distorts like a puddle.

```scratch
when green flag clicked
load image from costume [character]

// Draw normal character
draw transformed image at x: (0) y: (100)

// Draw reflection
set vertex [Top Left] to x: (5) y: (0)
set vertex [Top Right] to x: (95) y: (0)
set vertex [Bottom Left] to x: (0) y: (100)
set vertex [Bottom Right] to x: (100) y: (100)

// Add wave to reflection
forever
  set [time v] to ((timer) * (100))
  set [wave v] to ((sin of (time)) * 3)
  set vertex [Top Left] to x: ((5) + (wave)) y: (0)
  set vertex [Top Right] to x: ((95) + (wave)) y: (0)
  draw transformed image at x: (0) y: (-100)
end
```

**Result**: A reflection that ripples like water.

### Example 14: Door Opening Effect

Simulate a door opening with perspective.

```scratch
when green flag clicked
load image from costume [door]
set [openAmount v] to (0)

repeat (20)
  change [openAmount v] by (5)
  
  set vertex [Top Right] to x: ((100) - (openAmount)) y: ((openAmount) * (0.3))
  set vertex [Bottom Right] to x: ((100) - (openAmount)) y: ((100) - ((openAmount) * (0.3)))
  
  draw transformed image at x: (0) y: (0)
  wait (0.05) seconds
end
```

**Result**: The door appears to swing open with perspective.

### Example 15: Curtain Effect

Create a theater curtain opening effect.

```scratch
when green flag clicked
load image from costume [curtain]

repeat (50)
  set [openness v] to ((i) * (2))
  
  // Left curtain half
  set vertex [Top Right] to x: ((50) - (openness)) y: (0)
  set vertex [Bottom Right] to x: ((50) - (openness)) y: (100)
  draw transformed image at x: (-50) y: (0)
  
  // Right curtain half
  reset all transformations
  set vertex [Top Left] to x: ((50) + (openness)) y: (0)
  set vertex [Bottom Left] to x: ((50) + (openness)) y: (100)
  draw transformed image at x: (50) y: (0)
  
  wait (0.03) seconds
end
```

**Result**: A curtain opens from the center.

## Tips and Best Practices

### Performance Tips

1. **Reduce Update Frequency**: Don't update every frame if not needed
2. **Use Appropriate Image Sizes**: Smaller images transform faster
3. **Cache Transformations**: Store vertex positions in variables to avoid recalculation

### Visual Quality Tips

1. **Smooth Animations**: Use small incremental changes for smooth motion
2. **Combine Effects**: Layer multiple transformed images for complex effects
3. **Reset Between Changes**: Call `reset all transformations` before applying new presets

### Creative Tips

1. **Experiment with Negative Values**: Vertex positions can go outside 0-100 range
2. **Combine with Scratch Effects**: Use color/transparency effects alongside transformations
3. **Layer Multiple Images**: Transform different parts of a character separately

## Common Patterns

### Pattern: Breathing Animation

```scratch
when green flag clicked
load image from costume [character]
forever
  repeat (20)
    set [size v] to ((i) * (2))
    apply [bulge] transform strength: (size)%
    draw transformed image at x: (0) y: (0)
    wait (0.05) seconds
  end
  repeat (20)
    set [size v] to ((40) - ((i) * (2)))
    apply [bulge] transform strength: (size)%
    draw transformed image at x: (0) y: (0)
    wait (0.05) seconds
  end
end
```

### Pattern: Wind Gust

```scratch
when [space v] key pressed
load image from costume [tree]
repeat (10)
  set [bend v] to ((i) * (3))
  set vertex [Top Right] to x: ((100) + (bend)) y: (0)
  set vertex [Top Left] to x: (bend) y: (0)
  draw transformed image at x: (0) y: (0)
  wait (0.05) seconds
end
repeat (10)
  set [bend v] to ((30) - ((i) * (3)))
  set vertex [Top Right] to x: ((100) + (bend)) y: (0)
  set vertex [Top Left] to x: (bend) y: (0)
  draw transformed image at x: (0) y: (0)
  wait (0.05) seconds
end
reset all transformations
```

### Pattern: Bouncing with Squash and Stretch

```scratch
when green flag clicked
load image from costume [ball]
set [y v] to (150)
set [velocity v] to (0)

forever
  change [velocity v] by (-1)
  change [y v] by (velocity)
  
  if <(y) < (0)> then
    set [y v] to (0)
    set [velocity v] to ((velocity) * (-0.8))
    
    // Squash on impact
    set vertex [Top Left] to x: (-10) y: (20)
    set vertex [Top Right] to x: (110) y: (20)
    set vertex [Bottom Left] to x: (-10) y: (100)
    set vertex [Bottom Right] to x: (110) y: (100)
  else
    // Stretch in air
    set vertex [Top Left] to x: (10) y: (0)
    set vertex [Top Right] to x: (90) y: (0)
    set vertex [Bottom Left] to x: (10) y: (100)
    set vertex [Bottom Right] to x: (90) y: (100)
  end
  
  draw transformed image at x: (0) y: (y)
  wait (0.03) seconds
end
```

## Troubleshooting Examples

If your transformation isn't working as expected, try these debugging approaches:

### Debug: Show Vertex Positions

```scratch
when green flag clicked
load image from costume [sprite]
apply [trapezoid] transform strength: (50)%
say (join [TL: ] (join (vertex [Top Left] x) (join [,] (vertex [Top Left] y)))) for (2) seconds
say (join [TR: ] (join (vertex [Top Right] x) (join [,] (vertex [Top Right] y)))) for (2) seconds
```

### Debug: Gradual Preset Application

```scratch
when green flag clicked
load image from costume [sprite]
repeat (10)
  set [strength v] to ((i) * (10))
  apply [perspective] transform strength: (strength)%
  draw transformed image at x: (0) y: (0)
  say (join [Strength: ] (strength)) for (0.5) seconds
end
```

## Conclusion

These examples should give you a solid foundation for using the Live2D Effect extension in your projects. Don't be afraid to experiment and combine different techniques to create unique effects!

For more information, see the main [README.md](README.md) file.
