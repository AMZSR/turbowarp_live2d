# Quick Start Guide - Live2D Effect Extension

Get started with the Live2D Effect extension in just a few minutes!

## 🚀 Installation

### Step 1: Open TurboWarp
Go to [https://turbowarp.org/](https://turbowarp.org/)

### Step 2: Load the Extension
1. Click the **Extensions** button (folder icon) in the bottom-left corner
2. Select **Custom Extension**
3. Enter the URL to the extension file:
   ```
   https://raw.githubusercontent.com/AMZSR/turbowarp_live2d/main/extensions/live2d-effect.js
   ```
4. Click **Load**

### Step 3: Find the Blocks
Look for the new **Live2D Effect** category in your block palette. It should have a pink/red color scheme.

## 📝 Your First Transformation

### Example 1: Simple Trapezoid Effect

Let's create a basic trapezoid transformation:

```scratch
when green flag clicked
load image from costume [costume1 ▾]
apply [trapezoid ▾] transform strength: (50)%
draw transformed image at x: (0) y: (0)
```

**What this does:**
1. Loads an image from your sprite's costume
2. Applies a trapezoid effect at 50% strength
3. Draws the transformed image at the center of the stage

### Example 2: Animated Wave

Create a waving flag effect:

```scratch
when green flag clicked
load image from costume [costume1 ▾]
forever
  apply [wave ▾] transform strength: ((50) + ((sin of (timer)) * (30)))
  draw transformed image at x: (0) y: (0)
end
```

**What this does:**
- Creates a continuous waving motion
- Uses sine wave for smooth animation
- Strength varies between 20% and 80%

### Example 3: Interactive Perspective

Control transformation with the mouse:

```scratch
when green flag clicked
load image from costume [costume1 ▾]
forever
  set [strength v] to (((mouse x) + (240)) / (4.8))
  apply [perspective ▾] transform strength: (strength)%
  draw transformed image at x: (0) y: (0)
end
```

**What this does:**
- Mouse position controls the perspective effect
- Left side: no effect, Right side: maximum effect
- Real-time interactive transformation

## 🎨 Available Transformations

### Trapezoid
Narrows the top edge of the image.
- **Best for:** Creating depth, roof shapes, roads going into distance
- **Strength range:** 0-100%

### Perspective
Creates a 3D perspective effect.
- **Best for:** Walls, buildings, background scenery
- **Strength range:** 0-100%

### Wave
Applies a sinusoidal wave distortion.
- **Best for:** Flags, water reflections, elastic objects
- **Strength range:** 0-100%

### Bulge
Bulges the image outward from the center.
- **Best for:** Balloons, bubbles, magnification effects
- **Strength range:** 0-100%

## 🎯 Common Use Cases

### Use Case 1: Character Expression

Tilt a character's head:

```scratch
when green flag clicked
load image from costume [face ▾]
set vertex [Top Left ▾] to x: (-10) y: (5)
set vertex [Top Right ▾] to x: (110) y: (-5)
set vertex [Bottom Left ▾] to x: (0) y: (100)
set vertex [Bottom Right ▾] to x: (100) y: (100)
draw transformed image at x: (0) y: (0)
```

### Use Case 2: Screen Shake

Create an impact effect:

```scratch
when [space v] key pressed
load image from costume [screen ▾]
repeat (10)
  set vertex [Top Left ▾] to x: (pick random (-5) to (5)) y: (pick random (-5) to (5))
  set vertex [Top Right ▾] to x: ((100) + (pick random (-5) to (5))) y: (pick random (-5) to (5))
  set vertex [Bottom Left ▾] to x: (pick random (-5) to (5)) y: ((100) + (pick random (-5) to (5)))
  set vertex [Bottom Right ▾] to x: ((100) + (pick random (-5) to (5))) y: ((100) + (pick random (-5) to (5)))
  draw transformed image at x: (0) y: (0)
  wait (0.03) seconds
end
reset all transformations
draw transformed image at x: (0) y: (0)
```

### Use Case 3: Smooth Transition

Animate from normal to transformed:

```scratch
when green flag clicked
load image from costume [sprite ▾]
repeat (30)
  set [progress v] to ((i) / (30))
  set [strength v] to ((progress) * (100))
  apply [bulge ▾] transform strength: (strength)%
  draw transformed image at x: (0) y: (0)
  wait (0.03) seconds
end
```

## 💡 Tips & Tricks

### Tip 1: Start Simple
Begin with preset transformations before trying manual vertex control.

### Tip 2: Use Variables
Store vertex positions in variables for complex animations:
```scratch
set [topLeftX v] to (0)
set [topLeftY v] to (0)
set vertex [Top Left ▾] to x: (topLeftX) y: (topLeftY)
```

### Tip 3: Reset Often
Use `reset all transformations` when switching between effects to start fresh.

### Tip 4: Adjust Strength
Different images look best at different strength levels. Experiment!
- Subtle effects: 20-40%
- Medium effects: 40-70%
- Strong effects: 70-100%

### Tip 5: Combine with Scratch Effects
Layer Live2D transformations with built-in Scratch effects:
```scratch
set [ghost ▾] effect to (50)
apply [wave ▾] transform strength: (60)%
draw transformed image at x: (0) y: (0)
```

## 🐛 Troubleshooting

### Problem: Extension won't load
**Solution:** Make sure you're using TurboWarp (not regular Scratch) and that you've entered the correct URL.

### Problem: Image doesn't appear
**Solution:** 
1. Check that you've loaded an image first
2. Make sure the costume name is spelled correctly (case-sensitive)
3. Try drawing at different coordinates

### Problem: Transformation looks wrong
**Solution:**
1. Try resetting: `reset all transformations`
2. Check vertex positions aren't too extreme
3. Reduce the transformation strength

### Problem: Performance is slow
**Solution:**
1. Use smaller images
2. Reduce update frequency (add longer waits)
3. Simplify your transformation

## 📚 Next Steps

Now that you know the basics, explore more:

1. **Read the full documentation**: [README.md](README.md)
2. **Try advanced examples**: [EXAMPLES.md](EXAMPLES.md)
3. **Experiment**: Create your own unique transformations!
4. **Share**: Show your projects to the community

## 🎓 Learning Path

### Beginner Level
1. Use preset transformations
2. Adjust strength values
3. Create simple animations

### Intermediate Level
1. Control individual vertices
2. Combine multiple transformations
3. Use mouse/keyboard for interaction

### Advanced Level
1. Create custom transformation patterns
2. Implement complex animations
3. Combine with other extensions

## 💬 Need Help?

If you get stuck:
1. Check the [EXAMPLES.md](EXAMPLES.md) file for more examples
2. Review the [README.md](README.md) for detailed documentation
3. Open an issue on GitHub if you find a bug

## 🎉 Have Fun!

The Live2D Effect extension opens up many creative possibilities. Don't be afraid to experiment and try new things. Happy creating!

---

**Quick Reference Card**

| Block | Purpose |
|-------|---------|
| `load image from costume` | Load image to transform |
| `apply [preset] transform strength: (%)` | Apply quick transformation |
| `set vertex [vertex] to x: y:` | Control individual corners |
| `draw transformed image at x: y:` | Display the result |
| `reset all transformations` | Start over |
| `image width` / `image height` | Get image dimensions |

**Vertices:**
- Top Left (TL) - Top-left corner
- Top Right (TR) - Top-right corner
- Bottom Left (BL) - Bottom-left corner
- Bottom Right (BR) - Bottom-right corner

**Presets:**
- Trapezoid - Narrow the top
- Perspective - 3D depth effect
- Wave - Wavy distortion
- Bulge - Expand outward
