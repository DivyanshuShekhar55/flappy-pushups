import { Bird, Pipe, SharedValue } from "@/types";
``;
import {
  withSequence,
  withTiming,
  Easing,
  withRepeat,
  runOnUI,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated";
import { BirdManager } from "./BirdManager";

export class GameManager {
  private points: number;
  //@ts-ignore
  private isCamera_access: boolean;
  //@ts-ignore
  private bird: Bird;
  //@ts-ignore
  private pipe: Pipe;
  private isgameOver: boolean;
  private pipeHeight: number;
  screenHeight: number;
  pipeX: SharedValue<number>;

  constructor(
    isCamera_access: boolean,
    bird: BirdManager,
    pipeHeight: number,
    screenHeight: number,
    pipeX: SharedValue<number>
  ) {
    this.points = 0;
    isCamera_access = false;
    //@ts-ignore
    bird = new BirdManager();
    this.isgameOver = false;
    this.pipeHeight = pipeHeight;
    this.screenHeight = screenHeight;
    this.pipeX = pipeX;
  }

  get getScore(): number {
    return this.points;
  }

  calculate_score() {
    if (!this.isgameOver) {
      setInterval(() => {
        this.points++;
      }, 800);
    }
  }

  setGameOver() {
    this.isgameOver = false;
  }

  get isGameOver() {
    return this.isgameOver;
  }

  generateRandomPipeHeight(screenHeight: number): number {
    let hgt = Math.floor(Math.random() * screenHeight * 0.6);
    //top pipe has been given a max height of 60% screen height
    console.log(hgt);
    return hgt;
  }

  run(
    width: number,
    duration: number,
    pipeX: SharedValue<number>,
    screenHeight: number
  ) {
    // controls game when started...
    console.log("from run function", this);
    //this.movePipe(width, duration, pipeX, screenHeight);
    //this.calculate_score()
  }
}

