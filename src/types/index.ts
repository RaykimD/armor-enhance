// src/types/index.ts
export type ArmorType = 'helmet' | 'armor' | 'belt' | 'shoes';

export type ArmorStats = {
    health: number;
    innerForce: number;
    luck: number;
    attackSpeed: number;
    evasion: number;
    attack: number;
};

export type Armor = {
    id: string;
    type: ArmorType;
    enhancement: number;
    baseStats: ArmorStats;
    enhanceStats: ArmorStats;
    potentials: PotentialOption[];
};

export type EnhanceLog = {
    type: 'success' | 'maintain' | 'degrade';
    armorType: ArmorType;
    enhancement: number;
    timestamp: number;
};

export type UsedResources = {
    money: number;
    luckyStone: number;
    advancedLuckyStone: number;
    starBalloonTicket: number;
};

export type PotentialOption = {
    type: 'recovery' | 'evasion' | 'criticalChance' | 'criticalDamage' | 'bossDamage' | 'attackSpeed' | 'health' | 'luck';
    value: number;
};

export const ArmorTypeKorean: Record<ArmorType, string> = {
    helmet: '투구',
    armor: '갑옷',
    belt: '허리띠',
    shoes: '신발'
};

export const PotentialTypeKorean: Record<PotentialOption['type'], string> = {
    recovery: '회복력',
    evasion: '회피율',
    criticalChance: '치명타 확률',
    criticalDamage: '치명타 피해',
    bossDamage: '보스 공격력',
    attackSpeed: '공격속도',
    health: '체력',
    luck: '행운'
};
