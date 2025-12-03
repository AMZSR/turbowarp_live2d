/**
 * Live2D Effect Extension for TurboWarp
 * Provides image deformation and mesh transformation effects similar to Live2D
 * 
 * @author AMZSR
 * @version 1.0.0
 */

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Live2D Effect extension must run unsandboxed');
  }

  const VERTEX_NAMES = ['topleft', 'topright', 'bottomleft', 'bottomright'];
  const PRESET_TYPES = ['trapezoid', 'perspective', 'wave', 'bulge'];

  class Live2DEffect {
    constructor() {
      this.runtime = null;
      this.canvas = null;
      this.ctx = null;
      this.imageData = null;
      this.imageWidth = 0;
      this.imageHeight = 0;
      
      // Vertex positions (normalized 0-1 coordinates)
      this.vertices = {
        topleft: { x: 0, y: 0 },
        topright: { x: 1, y: 0 },
        bottomleft: { x: 0, y: 1 },
        bottomright: { x: 1, y: 1 }
      };
      
      // Original vertices for reset
      this.originalVertices = JSON.parse(JSON.stringify(this.vertices));
    }

    getInfo() {
      return {
        id: 'live2deffect',
        name: 'Live2D Effect',
        color1: '#FF6680',
        color2: '#FF4D6A',
        color3: '#E63F5F',
        blocks: [
          {
            opcode: 'loadImageFromCostume',
            blockType: Scratch.BlockType.COMMAND,
            text: 'load image from costume [COSTUME]',
            arguments: {
              COSTUME: {
                type: Scratch.ArgumentType.COSTUME
              }
            }
          },
          {
            opcode: 'loadImageFromURL',
            blockType: Scratch.BlockType.COMMAND,
            text: 'load image from URL [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/image.png'
              }
            }
          },
          '---',
          {
            opcode: 'setVertexPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set vertex [VERTEX] to x: [X] y: [Y]',
            arguments: {
              VERTEX: {
                type: Scratch.ArgumentType.STRING,
                menu: 'vertexMenu'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'getVertexX',
            blockType: Scratch.BlockType.REPORTER,
            text: 'vertex [VERTEX] x',
            arguments: {
              VERTEX: {
                type: Scratch.ArgumentType.STRING,
                menu: 'vertexMenu'
              }
            }
          },
          {
            opcode: 'getVertexY',
            blockType: Scratch.BlockType.REPORTER,
            text: 'vertex [VERTEX] y',
            arguments: {
              VERTEX: {
                type: Scratch.ArgumentType.STRING,
                menu: 'vertexMenu'
              }
            }
          },
          '---',
          {
            opcode: 'applyPreset',
            blockType: Scratch.BlockType.COMMAND,
            text: 'apply [PRESET] transform strength: [STRENGTH]%',
            arguments: {
              PRESET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'presetMenu'
              },
              STRENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              }
            }
          },
          '---',
          {
            opcode: 'drawTransformed',
            blockType: Scratch.BlockType.COMMAND,
            text: 'draw transformed image at x: [X] y: [Y]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'drawTransformedWithSize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'draw transformed image at x: [X] y: [Y] width: [WIDTH] height: [HEIGHT]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          '---',
          {
            opcode: 'resetTransform',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset all transformations'
          },
          '---',
          {
            opcode: 'getImageWidth',
            blockType: Scratch.BlockType.REPORTER,
            text: 'image width'
          },
          {
            opcode: 'getImageHeight',
            blockType: Scratch.BlockType.REPORTER,
            text: 'image height'
          }
        ],
        menus: {
          vertexMenu: {
            acceptReporters: true,
            items: [
              { text: 'Top Left', value: 'topleft' },
              { text: 'Top Right', value: 'topright' },
              { text: 'Bottom Left', value: 'bottomleft' },
              { text: 'Bottom Right', value: 'bottomright' }
            ]
          },
          presetMenu: {
            acceptReporters: true,
            items: [
              { text: 'Trapezoid', value: 'trapezoid' },
              { text: 'Perspective', value: 'perspective' },
              { text: 'Wave', value: 'wave' },
              { text: 'Bulge', value: 'bulge' }
            ]
          }
        }
      };
    }

    /**
     * Load image from a costume
     */
    loadImageFromCostume(args, util) {
      return new Promise((resolve) => {
        const costume = util.target.getCostumes().find(c => c.name === args.COSTUME);
        if (!costume) {
          console.error('Costume not found:', args.COSTUME);
          resolve();
          return;
        }

        const image = new Image();
        image.crossOrigin = 'anonymous';
        
        image.onload = () => {
          this.imageWidth = image.width;
          this.imageHeight = image.height;
          this.imageData = image;
          this._initCanvas();
          resolve();
        };
        
        image.onerror = () => {
          console.error('Failed to load image from costume');
          resolve();
        };

        // Get the asset and create object URL
        const asset = util.target.runtime.storage.get(costume.assetId);
        if (asset && asset.data) {
          const blob = new Blob([asset.data], { type: costume.dataFormat === 'png' ? 'image/png' : 'image/svg+xml' });
          image.src = URL.createObjectURL(blob);
        } else if (costume.asset && costume.asset.data) {
          const blob = new Blob([costume.asset.data], { type: costume.dataFormat === 'png' ? 'image/png' : 'image/svg+xml' });
          image.src = URL.createObjectURL(blob);
        } else {
          console.error('Could not access costume data');
          resolve();
        }
      });
    }

    /**
     * Load image from URL
     */
    loadImageFromURL(args) {
      return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        
        image.onload = () => {
          this.imageWidth = image.width;
          this.imageHeight = image.height;
          this.imageData = image;
          this._initCanvas();
          resolve();
        };
        
        image.onerror = () => {
          console.error('Failed to load image from URL:', args.URL);
          resolve();
        };
        
        image.src = args.URL;
      });
    }

    /**
     * Initialize canvas for image processing
     */
    _initCanvas() {
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
      }
      this.canvas.width = this.imageWidth;
      this.canvas.height = this.imageHeight;
    }

    /**
     * Set vertex position
     */
    setVertexPosition(args) {
      const vertex = args.VERTEX.toLowerCase().replace(/\s+/g, '');
      if (this.vertices[vertex]) {
        this.vertices[vertex].x = Scratch.Cast.toNumber(args.X);
        this.vertices[vertex].y = Scratch.Cast.toNumber(args.Y);
      }
    }

    /**
     * Get vertex X position
     */
    getVertexX(args) {
      const vertex = args.VERTEX.toLowerCase().replace(/\s+/g, '');
      return this.vertices[vertex] ? this.vertices[vertex].x : 0;
    }

    /**
     * Get vertex Y position
     */
    getVertexY(args) {
      const vertex = args.VERTEX.toLowerCase().replace(/\s+/g, '');
      return this.vertices[vertex] ? this.vertices[vertex].y : 0;
    }

    /**
     * Apply transformation preset
     */
    applyPreset(args) {
      const preset = args.PRESET;
      const strength = Scratch.Cast.toNumber(args.STRENGTH) / 100;
      
      // Reset to original first
      this.vertices = JSON.parse(JSON.stringify(this.originalVertices));
      
      switch (preset) {
        case 'trapezoid':
          // Narrow the top
          const trapOffset = strength * 0.3;
          this.vertices.topleft.x = trapOffset;
          this.vertices.topright.x = 1 - trapOffset;
          break;
          
        case 'perspective':
          // Create perspective effect
          const perspOffset = strength * 0.2;
          this.vertices.topright.x = 1 - perspOffset;
          this.vertices.bottomright.x = 1 + perspOffset * 0.5;
          this.vertices.topright.y = perspOffset;
          this.vertices.bottomright.y = 1 - perspOffset * 0.5;
          break;
          
        case 'wave':
          // Sinusoidal wave effect
          const waveAmount = strength * 0.15;
          this.vertices.topright.x = 1 + Math.sin(0) * waveAmount;
          this.vertices.bottomright.x = 1 + Math.sin(Math.PI) * waveAmount;
          this.vertices.topleft.x = 0 - Math.sin(0) * waveAmount;
          this.vertices.bottomleft.x = 0 - Math.sin(Math.PI) * waveAmount;
          break;
          
        case 'bulge':
          // Bulge outward from center
          const bulgeAmount = strength * 0.2;
          this.vertices.topleft.x = -bulgeAmount;
          this.vertices.topleft.y = -bulgeAmount;
          this.vertices.topright.x = 1 + bulgeAmount;
          this.vertices.topright.y = -bulgeAmount;
          this.vertices.bottomleft.x = -bulgeAmount;
          this.vertices.bottomleft.y = 1 + bulgeAmount;
          this.vertices.bottomright.x = 1 + bulgeAmount;
          this.vertices.bottomright.y = 1 + bulgeAmount;
          break;
      }
    }

    /**
     * Draw the transformed image at specified position
     */
    drawTransformed(args, util) {
      if (!this.imageData || !this.ctx) {
        console.error('No image loaded');
        return;
      }

      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      
      // Use the sprite's native size
      const width = this.imageWidth;
      const height = this.imageHeight;
      
      this._drawTransformedImage(util, x, y, width, height);
    }

    /**
     * Draw the transformed image with custom size
     */
    drawTransformedWithSize(args, util) {
      if (!this.imageData || !this.ctx) {
        console.error('No image loaded');
        return;
      }

      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      const width = Scratch.Cast.toNumber(args.WIDTH);
      const height = Scratch.Cast.toNumber(args.HEIGHT);
      
      this._drawTransformedImage(util, x, y, width, height);
    }

    /**
     * Internal method to draw transformed image using quadrilateral mapping
     */
    _drawTransformedImage(util, x, y, width, height) {
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Convert normalized vertices to pixel coordinates
      const v = {
        tl: { 
          x: this.vertices.topleft.x * width, 
          y: this.vertices.topleft.y * height 
        },
        tr: { 
          x: this.vertices.topright.x * width, 
          y: this.vertices.topright.y * height 
        },
        bl: { 
          x: this.vertices.bottomleft.x * width, 
          y: this.vertices.bottomleft.y * height 
        },
        br: { 
          x: this.vertices.bottomright.x * width, 
          y: this.vertices.bottomright.y * height 
        }
      };
      
      // Use mesh-based transformation
      this._drawMeshTransform(v, width, height);
      
      // Draw the transformed image to the stage
      this._stampToStage(util, x, y, width, height);
    }

    /**
     * Draw image with mesh-based transformation
     * Divides the image into a grid and transforms each cell
     */
    _drawMeshTransform(vertices, width, height) {
      const divisions = 10; // Number of subdivisions for smoother transformation
      
      this.ctx.save();
      
      for (let row = 0; row < divisions; row++) {
        for (let col = 0; col < divisions; col++) {
          const u0 = col / divisions;
          const v0 = row / divisions;
          const u1 = (col + 1) / divisions;
          const v1 = (row + 1) / divisions;
          
          // Calculate source rectangle
          const sx = u0 * this.imageWidth;
          const sy = v0 * this.imageHeight;
          const sw = (u1 - u0) * this.imageWidth;
          const sh = (v1 - v0) * this.imageHeight;
          
          // Calculate destination quad using bilinear interpolation
          const topLeft = this._interpolateQuad(vertices, u0, v0);
          const topRight = this._interpolateQuad(vertices, u1, v0);
          const bottomLeft = this._interpolateQuad(vertices, u0, v1);
          const bottomRight = this._interpolateQuad(vertices, u1, v1);
          
          // Draw this cell with transform
          this._drawQuadCell(
            sx, sy, sw, sh,
            topLeft, topRight, bottomLeft, bottomRight
          );
        }
      }
      
      this.ctx.restore();
    }

    /**
     * Bilinear interpolation for quad position
     */
    _interpolateQuad(vertices, u, v) {
      const x = 
        vertices.tl.x * (1 - u) * (1 - v) +
        vertices.tr.x * u * (1 - v) +
        vertices.bl.x * (1 - u) * v +
        vertices.br.x * u * v;
        
      const y = 
        vertices.tl.y * (1 - u) * (1 - v) +
        vertices.tr.y * u * (1 - v) +
        vertices.bl.y * (1 - u) * v +
        vertices.br.y * u * v;
        
      return { x, y };
    }

    /**
     * Draw a single quad cell with perspective transform
     */
    _drawQuadCell(sx, sy, sw, sh, tl, tr, bl, br) {
      // Use an approximate affine transform for the cell
      // Calculate transform matrix
      const dx1 = tr.x - tl.x;
      const dy1 = tr.y - tl.y;
      const dx2 = bl.x - tl.x;
      const dy2 = bl.y - tl.y;
      
      this.ctx.save();
      
      // Apply transform matrix
      this.ctx.transform(
        dx1 / sw, dy1 / sw,
        dx2 / sh, dy2 / sh,
        tl.x, tl.y
      );
      
      // Draw the image segment
      try {
        this.ctx.drawImage(
          this.imageData,
          sx, sy, sw, sh,
          0, 0, sw, sh
        );
      } catch (e) {
        // Silently handle any drawing errors
      }
      
      this.ctx.restore();
    }

    /**
     * Stamp the transformed image to the Scratch stage
     */
    _stampToStage(util, x, y, width, height) {
      const renderer = util.target.runtime.renderer;
      if (!renderer) return;
      
      try {
        // Get the canvas data as data URL
        const dataURL = this.canvas.toDataURL('image/png');
        
        // Create a temporary skin for stamping
        const skin = renderer.createPenSkin();
        const penSkinId = skin.id;
        
        // Create a drawable for the transformed image
        const drawableID = renderer.createDrawable('pen');
        renderer.updateDrawablePosition(drawableID, [x, y]);
        renderer.updateDrawableScale(drawableID, [width / this.imageWidth * 100, height / this.imageHeight * 100]);
        
        // Load image and stamp it
        const img = new Image();
        img.onload = () => {
          try {
            // Use pen layer to draw the image
            const penLayer = renderer._penSkin;
            if (penLayer && penLayer.drawStamp) {
              // Convert stage coordinates to pen layer coordinates
              penLayer.drawStamp(penSkinId, x, y, width, height, img);
            }
          } catch (e) {
            console.error('Error stamping to stage:', e);
          }
        };
        img.src = dataURL;
        
      } catch (e) {
        console.error('Error creating stamp:', e);
      }
    }

    /**
     * Reset all transformations
     */
    resetTransform() {
      this.vertices = JSON.parse(JSON.stringify(this.originalVertices));
    }

    /**
     * Get image width
     */
    getImageWidth() {
      return this.imageWidth;
    }

    /**
     * Get image height
     */
    getImageHeight() {
      return this.imageHeight;
    }
  }

  Scratch.extensions.register(new Live2DEffect());
})(Scratch);
