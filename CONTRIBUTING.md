# Contributing to Live2D Effect Extension

Thank you for your interest in contributing to the Live2D Effect extension for TurboWarp! This document provides guidelines and information for contributors.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Pull Request Process](#pull-request-process)
7. [Feature Requests](#feature-requests)
8. [Bug Reports](#bug-reports)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Expected Behavior

- Be respectful and constructive in communications
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community and project
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes**: Fix issues in the existing code
2. **New Features**: Add new transformation effects or blocks
3. **Documentation**: Improve or translate documentation
4. **Examples**: Add new usage examples
5. **Performance**: Optimize existing code
6. **Testing**: Add or improve tests

### Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your contribution
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic knowledge of JavaScript (ES6+)
- Familiarity with Canvas API (helpful but not required)
- Understanding of TurboWarp extension system

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/AMZSR/turbowarp_live2d.git
   cd turbowarp_live2d
   ```

2. Serve the extension locally using a simple HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   ```

3. Open TurboWarp and load the extension:
   - Go to Extensions
   - Select "Custom Extension"
   - Enter: `http://localhost:8000/extensions/live2d-effect.js`

4. Test your changes in TurboWarp

### File Structure

```
turbowarp_live2d/
├── extensions/
│   └── live2d-effect.js    # Main extension file
├── CONTRIBUTING.md          # This file
├── EXAMPLES.md             # Usage examples
├── LICENSE                 # MIT License
├── README.md               # Main documentation (English)
├── README.ja.md            # Japanese documentation
└── test.html               # Visual test page
```

## Coding Standards

### JavaScript Style Guide

- Use ES6+ features where appropriate
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and concise

### Code Organization

```javascript
// Good: Clear function with single responsibility
function calculateVertexPosition(u, v, vertices) {
  return {
    x: interpolateX(u, v, vertices),
    y: interpolateY(u, v, vertices)
  };
}

// Bad: Unclear function with mixed concerns
function doStuff(a, b, c) {
  // Multiple unrelated operations
}
```

### Documentation

- Add JSDoc comments for public methods
- Document parameters and return values
- Include usage examples for complex features
- Update README.md when adding new features

Example:
```javascript
/**
 * Apply a transformation preset to the image
 * @param {Object} args - Block arguments
 * @param {string} args.PRESET - Preset name (trapezoid, perspective, wave, bulge)
 * @param {number} args.STRENGTH - Transformation strength (0-100)
 */
applyPreset(args) {
  // Implementation
}
```

### Naming Conventions

- **Classes**: PascalCase (e.g., `Live2DEffect`)
- **Functions**: camelCase (e.g., `loadImageFromURL`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `VERTEX_NAMES`)
- **Private methods**: prefix with underscore (e.g., `_initCanvas`)

## Testing

### Manual Testing Checklist

Before submitting a pull request, test the following:

- [ ] Extension loads without errors in TurboWarp
- [ ] All blocks appear in the block palette
- [ ] Image loading works (both costume and URL)
- [ ] Vertex position setting works correctly
- [ ] All preset transformations work as expected
- [ ] Drawing functions render correctly
- [ ] Reset functionality works
- [ ] No console errors during normal operation
- [ ] Performance is acceptable with various image sizes

### Testing in Different Browsers

Test your changes in multiple browsers:
- Chrome/Chromium
- Firefox
- Safari (if available)
- TurboWarp Desktop

### Visual Testing

Use the included `test.html` file to visually verify transformations:

```bash
# Serve the test page
python -m http.server 8000

# Open in browser
open http://localhost:8000/test.html
```

## Pull Request Process

### Before Submitting

1. **Test Thoroughly**: Ensure all functionality works
2. **Update Documentation**: Add or update docs as needed
3. **Check Code Style**: Follow the coding standards
4. **Add Examples**: Include usage examples for new features
5. **Write Clear Commit Messages**: Describe what and why

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat: Add rotation preset transformation

- Implement rotation transformation preset
- Add rotation strength parameter
- Update documentation with rotation examples
- Add visual test for rotation effect

Closes #123
```

### Pull Request Template

When submitting a pull request, include:

1. **Description**: What does this PR do?
2. **Motivation**: Why is this change needed?
3. **Changes**: List of specific changes made
4. **Testing**: How was this tested?
5. **Screenshots**: For visual changes, include before/after
6. **Breaking Changes**: Note any breaking changes
7. **Related Issues**: Reference related issues

### Review Process

1. Submit your pull request
2. Wait for maintainer review
3. Address any feedback
4. Once approved, your PR will be merged

## Feature Requests

### Proposing New Features

1. Check existing issues to avoid duplicates
2. Open a new issue with the "Feature Request" label
3. Describe the feature clearly
4. Explain the use case and benefits
5. Provide examples if possible

### Feature Request Template

```markdown
## Feature Description
[Clear description of the feature]

## Use Case
[Why is this feature needed?]

## Proposed Solution
[How would this feature work?]

## Examples
[Usage examples or mockups]

## Alternatives Considered
[Other approaches you've considered]
```

## Bug Reports

### Before Reporting

1. Search existing issues
2. Try to reproduce the bug
3. Test in multiple browsers if possible
4. Gather relevant information

### Bug Report Template

```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [...]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [Chrome 120, Firefox 115, etc.]
- TurboWarp Version: [Desktop/Online]
- Extension Version: [1.0.0]

## Screenshots/Console Errors
[If applicable]

## Additional Context
[Any other relevant information]
```

## Adding New Transformation Presets

To add a new transformation preset:

1. Add the preset name to `PRESET_TYPES` constant
2. Add the menu item in `getInfo().menus.presetMenu`
3. Implement the transformation logic in `applyPreset()`
4. Add documentation and examples
5. Test thoroughly

Example:
```javascript
case 'rotation':
  // Calculate rotation transformation
  const angle = strength * Math.PI / 4; // Max 45 degrees
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  // Apply rotation around center
  this.vertices.topleft.x = 0.5 - cos * 0.5 + sin * 0.5;
  this.vertices.topleft.y = 0.5 - sin * 0.5 - cos * 0.5;
  // ... (other vertices)
  break;
```

## Adding New Blocks

To add a new block:

1. Add block definition in `getInfo().blocks`
2. Implement the corresponding method
3. Add any necessary menus
4. Update documentation
5. Add usage examples

Example:
```javascript
{
  opcode: 'getTransformStrength',
  blockType: Scratch.BlockType.REPORTER,
  text: 'current transform strength',
  // Implementation in class method
}
```

## Performance Optimization Guidelines

- Profile code before optimizing
- Focus on frequently called functions
- Consider mesh division trade-offs
- Cache calculations where possible
- Avoid unnecessary canvas operations
- Test with various image sizes

## Documentation Guidelines

### Writing Documentation

- Use clear, simple language
- Include code examples
- Add visual examples where helpful
- Translate to Japanese when possible
- Keep documentation up to date

### Documentation Sections

1. **README.md**: Main documentation
2. **README.ja.md**: Japanese translation
3. **EXAMPLES.md**: Detailed usage examples
4. **CONTRIBUTING.md**: This file
5. **Code comments**: Inline documentation

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with your question
4. Tag it with "question" label

## Recognition

Contributors will be recognized in:
- Git commit history
- Pull request discussions
- Release notes (for significant contributions)

Thank you for contributing to the Live2D Effect extension!
