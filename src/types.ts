export type ModelType = 'GPT' | 'Sonnet' | 'Gemma';

export interface ModelStats {
  pbPerSec: number;
  pbPerClick: number;
  moneyPerSec: number;
  moneyPerClick: number;
  rewardPerPb: {
    money: number;
    rep: number;
  };
  clickCooldown: number; // in ms
  specialDescription: string;
}

export interface UpgradesState {
  moneyBoost: number;
  pbBoost: number;
  imageGen: number;
  videoGen: number;
  gameGen: number;
  autonomousWarfare: boolean;
  partnership: number;
}
