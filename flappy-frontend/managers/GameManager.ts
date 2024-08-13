import { Bird, Pipe, SharedValue } from "@/types";``
import { withSequence, withTiming, Easing, withRepeat } from "react-native-reanimated";
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

  constructor(
    isCamera_access: boolean,
    bird: BirdManager,
  ) {
    this.points = 0;
    isCamera_access = false;
    //@ts-ignore
    bird = new BirdManager();
    this.isgameOver = false;
  }

  movePipe(width: number, duration: number, pipeX:SharedValue<number>) {
    pipeX.value = withRepeat(
      withSequence(

        withTiming(width, { duration: 0 }),
        withTiming(-150, { duration: duration, easing: Easing.linear }),
        withTiming(width, { duration: 0 })
      ), 0
    )
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

  setGameOver(){
    this.isgameOver=false;
  }

  get isGameOver(){
    return this.isgameOver;
  }

  generateRandomPipeHeight():number{
    return 0
  }
  
}
