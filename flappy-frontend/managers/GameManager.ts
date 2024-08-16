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
  private bird: Bird;
  //@ts-ignore
  private pipe: Pipe;
  private isgameOver: boolean;
  screenHeight: number;

  constructor(
    bird: BirdManager,
    screenHeight: number

  ) {
    this.points = 0;
    //@ts-ignore
    bird = new BirdManager();
    this.isgameOver = false;
    this.screenHeight = screenHeight;
  }

  get getScore(): number {
    return this.points;
  }

  calculate_score():number {
    if (!this.isgameOver) {
      setInterval(() => {
        this.points++;
        
      }, 800);
    }
    
    return this.points;
  }

  setGameOver() {
    this.isgameOver = false;
  }

  get isGameOver() {
    return this.isgameOver;
  }

  run(
    width: number,
    screenHeight: number
  ) :number{
    console.log("points logged",this.points)
    return this.calculate_score();
  }
}
