export class BirdManager {
   x_pos: number;
   y_pos: number;

  constructor(width: number) {
    this.x_pos = width / 4;
    this.y_pos = 200;
  }

  set change_birdY(newY: number) {
    this.y_pos = newY;
  }

  get getBirdPos(): { x: number; y: number } {
    return { x: this.x_pos, y: this.y_pos };
  }
}
